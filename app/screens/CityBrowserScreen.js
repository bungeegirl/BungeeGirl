import React, {
  AppRegistry,
  Component,
  StyleSheet,
  AlertIOS,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
  View,
  Picker,
  ListView,
} from 'react-native'

import ViewContainer from '../components/ViewContainer'
import Colors from '../styles/Colors'
import NavigationBar from 'react-native-navbar'
import cityData from '../local_data/cityData'
import ProfileCard from '../components/ProfileCard'
import Spinner from 'react-native-loading-spinner-overlay';
import _ from 'underscore'

var deviceWidth = Dimensions.get('window').width

class CityBrowserScreen extends Component {
  constructor(props) {
    super(props)
    var city = _.findWhere(cityData, {ident: props.cityIdent})
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      city: city,
      isLoading: true,
      dataSource: ds.cloneWithRows([])
    }
    this.cellRefs = []
  }

  componentDidMount() {
    this.props.firebaseRef.child(`cities/${this.state.city.ident}`).once('value', (users) => {
      let userData
      if(this.props.homeCity) {
        userData = _.reject(users.val(), (user) => { return user.uid == this.props.uid})
      } else {
        userData =
        _.chain(users.val())
          .filter((user) => { return user[`${this.props.userData.city}`]})
          .sortBy((user) => { return user[`${this.props.userData.city}`]})
          .value()
        userData.reverse()
      }
      this.setState({dataSource: this.state.dataSource.cloneWithRows(userData), isLoading: false})
    })
    if (this.props.homeCity) {
      AlertIOS.prompt(
        "Where do you want to travel next?",
        null,
        text => this.props.eventEmitter.emit('travelingTo', text)
      )
    }
  }

  render() {
    var title = <Text style={[styles.titleText, {marginBottom: 4}]}>Bungee girls from {this.state.city.name}</Text>
    if (this.props.homeCity) {
      title = <Text style={[styles.titleText, {marginBottom: 4}]}>Find a travel buddy</Text>
    }
    var leftButton =
    <TouchableOpacity
      onPress={() => this.props.navigator.pop()}
      style={styles.backButton}>
      <Image
        source={require('../assets/Nav-Back.png')}/>
     </TouchableOpacity>
    var content

    if(this.state.isLoading) {
      content =
      <Spinner visible={true} />
    } else {
      content =
      <ViewContainer backgroundColor={Colors.beige}>
        <NavigationBar
          title={title}
          leftButton={leftButton}
          style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}} />
        <ListView
          initialListSize={3}
          style={{marginTop: 10}}
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionID, rowID) => this._renderRow(rowData, sectionID, rowID)}/>
      </ViewContainer>
    }

    return content
  }

  _renderRow(rowData, sectionID, rowID) {
    let travelingTo = false
    console.log(rowData)
    if (this.props.homeCity && rowData.travelingTo) {
      travelingTo = rowData.travelingTo
    }
    var rowContent =
    <ProfileCard
      {...this.props}
      city={this.state.city}
      name={rowData.name}
      fromHomeCity={this.props.homeCity}
      bio={rowData.bio}
      travelingTo={travelingTo}
      travelType={rowData.travelType}
      userUid={rowData.uid} />
    return rowContent
  }
}

const styles = StyleSheet.create({
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    flex: 1,
    padding: 20,
  },
  titleText: {
    fontSize: 17,
    fontFamily: "ArchitectsDaughter",
  },
})
module.exports = CityBrowserScreen
