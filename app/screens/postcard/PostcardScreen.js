import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  ActionSheetIOS,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Dimensions,
  View,
  ListView,
} from 'react-native'

import ViewContainer from '../../components/ViewContainer'
import Postcard from '../../components/Postcard'
import NavigationBar from 'react-native-navbar'
import Colors from '../../styles/Colors'
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/Ionicons'
import _ from 'underscore'
import moment from 'moment'

class PostcardScreen extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loadingData: false,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }
  }

  componentDidMount() {
    this.props.firebaseRef.child('trips').orderByChild('userId').equalTo(this.props.uid).on('value', data => {
      let trips = []
      data.forEach( trip => {
        trips.push(trip)
      })
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(trips),
        tripLength: trips.length
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <TouchableOpacity
            style={styles.followButton}
            onPress={this._follow.bind(this)}>
            <Image
              style={styles.followButtonImage}
              source={require('../../assets/follow-icon.png')} />
          </TouchableOpacity>
          <Text style={[styles.text, styles.titleText]}>My Postcards</Text>
        </View>
        <View style={styles.header}>
          <Image
            source={{uri: `data:image/jpeg;base64, ${this.props.userData.imageData}`}}
            style={styles.avatarImage}/>
          <Text style={[styles.text, {margin: 10}]}>{`(${this.state.tripLength})\nTrips`}</Text>
          <Text style={[styles.text, {margin: 10}]}>{`(0)\nFollowers`}</Text>
          <TouchableOpacity
            style={[styles.text,{position: 'absolute', right: 10, alignItems: 'center'}]}
            onPress={() => {
              this.props.navigator.push({
                ident: 'NewPostcardScreen'
              })
            }}>
            <Text style={styles.text}>Create Postcard</Text>
            <Image source={require('../../assets/postcard-icon.png')} />
          </TouchableOpacity>
        </View>
        <ListView
          initialListSize={3}
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionID, rowID) => this._renderRow(rowData, sectionID, rowID)}/>
      </View>
    )
  }

  _follow() {
    this.firebaseRef.child('user-follows').push({
      uid: this.props.model.uid,
      follerUid: this.props.uid
    }).then( _ => {
      // successfull follow
    })
  }

  _renderRow(data) {
    console.log(data)
    return (
      <Postcard
        {...this.props}
        model={data}/>
    )
  }

}

const fullWidth = Dimensions.get('window').width
const containerTopMargin = 20, titleHeight = 40, headerHeight = 80

const styles = StyleSheet.create({
  container: {
    marginTop: containerTopMargin
  },
  titleWrapper: {
    height: titleHeight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 17
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    height: headerHeight,
    width: fullWidth,
    padding: 10
  },
  followButton: {
    position: 'absolute',
    left: 10
  },
  followButtonImage: {
    width: 50,
    height: 32
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 5
  },
  text: {
    textAlign: 'center',
    fontFamily: 'ArchitectsDaughter'
  },
  list: {
    width: fullWidth,
    height: Dimensions.get('window').height - containerTopMargin - titleHeight - headerHeight - 48
  },
  listContainer: {
    alignItems: 'flex-end'
  }
})

module.exports = PostcardScreen
