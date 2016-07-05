import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Dimensions,
  View,
  ListView,
} from 'react-native'

import ViewContainer from '../components/ViewContainer'
import Colors from '../styles/Colors'
import travelData from '../local_data/questions'
import UserProfile from '../components/UserProfile'
import _ from 'underscore'
import moment from 'moment'
import cityData from '../local_data/cityData'
import NavigationBar from 'react-native-navbar'

class UserProfileScreen extends Component {
  render() {
    var city = _.findWhere(cityData, {ident: this.props.userDisplayData.city})
    var title = <Text style={[styles.titleText, {marginBottom: 4, color: Colors.darkGrey}]}>{`${this.props.userDisplayData.name} from ${city.name}`}</Text>
    var leftButton =
    <TouchableOpacity
      onPress={() => this.props.navigator.pop()}
      style={styles.backButton}>
      <Image
        source={require('../assets/Nav-Back.png')}/>
     </TouchableOpacity>

    var content =
    <ViewContainer backgroundColor='transparent'>
      <NavigationBar
        title={title}
        leftButton={leftButton}
        style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}} />
      <UserProfile
        {...this.props} />
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => this._message()}>
        <Text style={styles.buttonText}>Message</Text>
      </TouchableOpacity>
    </ViewContainer>
    return content
  }

  _message() {
    this.props.eventEmitter.emit("initiateMessage", this.props.uidToRender)
    this.props.navigator.push({
      ident: "ChatScreen",
      userName: this.props.userDisplayData.name,
      otherUserImage: this.props.userDisplayData.imageData,
      userUid: this.props.uidToRender
    })
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
    color: Colors.beige,
    fontFamily: "ArchitectsDaughter"
  },
  container: {
    padding: 20,
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  formInput: {
    fontSize: 32,
    height: 74,
    color: Colors.beige,
    fontFamily: "ArchitectsDaughter"
  },
  formPretext: {
    fontSize: 32,
    marginRight: 8,
    color: Colors.beige,
    fontFamily: "ArchitectsDaughter"
  },
  bioContainer: {
    height: 150,
    fontSize: 18,
    color: Colors.beige,
    fontFamily: "ArchitectsDaughter",
  },
  inputContainer: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  logoutButton: {
    height: 48,
    width: 150,
    marginBottom: 50,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: "ArchitectsDaughter",
    color: 'white',
    fontSize: 21
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

module.exports = UserProfileScreen
