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
import ProfileImagePicker from '../components/ProfileImagePicker'
import NavigationBar from 'react-native-navbar'
import Colors from '../styles/Colors'
import travelData from '../local_data/questions'
import UserProfile from '../components/UserProfile'
import Spinner from 'react-native-loading-spinner-overlay';
import _ from 'underscore'
import moment from 'moment'

var FBLoginManager = require('NativeModules').FBLoginManager

class HomeScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loadingData: false,
      render: 'profile',
    }
  }

  render() {
    var content
    switch (this.state.render) {
      case 'profile':
        var title = <Text style={[styles.titleText, {marginBottom: 4, color: Colors.darkGrey}]}>My Profile</Text>
        content =
        <ViewContainer backgroundColor='transparent'>
          <NavigationBar
            title={title}
            style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}} />
          <UserProfile
            {...this.props}
            ref="UserProfile"
            uidToRender={this.props.uid}
            userDisplayData={this.props.userData} />
          <View style={{alignSelf: 'stretch', flex: 1}}/>
          <TouchableOpacity
            style={[styles.logoutButton, {backgroundColor: Colors.blue}]}
            onPress={() => this._editProfilePictures()}>
            <Text style={styles.buttonText}>Edit Profile Pics</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => this._logout()}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </ViewContainer>
        break;
      case 'profileImagePicker':
        var title = <Text style={[styles.titleText, {marginBottom: 4, color: Colors.darkGrey}]}>Profile Images</Text>
        var leftButton =
        <TouchableOpacity
          onPress={() => this.setState({render: 'profile'})}
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
           <ProfileImagePicker
             year={this.props.userData.year}
             month={this.props.userData.month}
             days={this.props.userData.days}
             onDataLoad={() => this.setState({loadingData: true})}
             onFinishLoad={() => this.setState({loadingData: false})}
             onFinishPicking={(profileImages) => {
               var successCallBack = () => { this.setState({loadingData: false, render: 'profile'})}
               var errorCallBack = () => {}
               this.props.eventEmitter.emit('editProfileImages', profileImages, successCallBack, errorCallBack)
             }}/>
           <Spinner visible={this.state.loadingData}/>
         </ViewContainer>
         break;
      default:

    }

    return content
  }

  _logout() {
    AsyncStorage.clear()
    FBLoginManager.logout(() => {})
    this.props.navigator.resetTo({
      ident: "LoginScreen"
    })
  }

  _editProfilePictures(){
    this.setState({render: 'profileImagePicker'})

  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
    color: Colors.beige,
    fontFamily: "ArchitectsDaughter"
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
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
    width: 200,
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
})

module.exports = HomeScreen
