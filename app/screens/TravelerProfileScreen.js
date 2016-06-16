import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  View,
  ListView,
} from 'react-native'

var deviceWidth = Dimensions.get('window').width
import questions from '../local_data/questions'
import ViewContainer from '../components/ViewContainer'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../styles/Colors'
import NavigationBar from 'react-native-navbar'


class TravelerProfileScreen extends Component {
  constructor(props) {
    super(props)
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(questions.travelProfiles)
    }
  }

  render() {
    var content
    let title = <Text style={[styles.titleText, {marginBottom: 4, color: Colors.darkGrey}]}>Choose your traveler type</Text>
    var leftButton =
    <TouchableOpacity
      onPress={() => this.props.navigator.pop()}
      style={styles.backButton}>
      <Image
        source={require('../assets/Nav-Back.png')}/>
     </TouchableOpacity>

    content =
    <ViewContainer backgroundColor='transparent'>
      <NavigationBar
        title={title}
        leftButton={leftButton}
        style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}} />
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => this._renderRow(rowData)}/>
    </ViewContainer>

    return content
  }

  _renderRow(rowData) {
    var row =
    <View
      style={styles.rowContainer}>
      <Text style={styles.rowText}>{rowData.title}</Text>
      <TouchableOpacity
        onPress={() => {
          this.props.navigator.push({
            ident: "TravelerProfileInfoScreen",
            travelerType: rowData.title,
            profileInfo: rowData.text
          })
        }}>
        <Icon
          style={styles.infoIcon}
          size={28}
          color={Colors.blue}
          name='ios-information-circle-outline' />
      </TouchableOpacity>
      <View style={{flex: 1}} />
      <TouchableOpacity
        onPress={() => {
          if(this.props.resetProfile) {
            this._resetProfile(rowData.ident)
          } else {
            this._setProfile(rowData.ident)
          }
        }}>
        <Text style={[styles.titleText, {marginLeft: 10, color: Colors.red}]}>Select</Text>
      </TouchableOpacity>
    </View>

    return row
  }

  _setProfile(travelIdent) {
    var successCallBack = () => { this.props.navigator.resetTo({
      ident: "CityPickerScreen"
    }) }
    this.props.eventEmitter.emit('updateTravelProfile', travelIdent, successCallBack)
  }

  _resetProfile(travelIdent) {
    var successCallBack = () => { this.props.navigator.resetTo({
      ident: "HomeScreen"
    }) }
    this.props.eventEmitter.emit('resetTravelProfile', travelIdent, successCallBack)
  }
}

module.exports = TravelerProfileScreen

const styles = StyleSheet.create({
  rowContainer: {
    height: 48,
    width: deviceWidth,
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 17,
    color: Colors.beige,
    fontFamily: "ArchitectsDaughter"
  },
  rowText: {
    fontSize: 18,
    fontFamily: "ArchitectsDaughter",
  },
  infoIcon: {
    marginLeft: 10,
    height: 32,
    width: 32
  }
})
