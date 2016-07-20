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

import ViewContainer from '../components/ViewContainer'
import EditListView from '../components/EditListView'
import ProfileImagePicker from '../components/ProfileImagePicker'
import NamePicker from '../components/NamePicker'
import BirthdatePicker from '../components/BirthdatePicker'
import AvatarPicker from '../components/AvatarPicker'
import BioEditor from '../components/BioEditor'
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
      profileImages: [],
      imageData: "",
      name: "",
      month: "",
      day: "",
      year: "",
      bio: "",
    }
  }

  _validateBio() {
    return this.state.bio != ""
  }

  _validateImage() {
    return this.state.imageData != ""
  }

  _validateName() {
    return this.state.name != ""
  }

  _validateBirthdate() {
    return (this.state.month <= 12 && this.state.day <= 31 && this.state.year <= 2020 && this.state.year > 1900)
  }


  render() {
    var content,title,leftButton
    var rightButton = () => {}
    switch (this.state.render) {
      case 'profile':
        title = <Text style={[styles.titleText, {marginBottom: 4, color: Colors.darkGrey}]}>My Profile</Text>
        rightButton = () => (
        <TouchableOpacity
          style={[styles.backButton, {marginRight: 8}]}
          onPress={() => this._logout()}>
          <Text style={[styles.buttonText, {color: Colors.red, fontSize: 14}]}>Logout</Text>
        </TouchableOpacity>
        )
        leftButton =
        <TouchableOpacity
          style={[styles.backButton, {marginLeft: 8}]}
          onPress={() => this._editProfile()}>
          <Text style={[styles.buttonText, {color: Colors.blue, fontSize: 14}]}>Edit</Text>
        </TouchableOpacity>
        content =
        <View style={{flex: 1}}>
          <UserProfile
            {...this.props}
            name={this.state.name}
            ref="UserProfile"
            uidToRender={this.props.uid}
            userDisplayData={this.props.userData} />
          <TouchableOpacity
            onPress={() => {
              ActionSheetIOS.showShareActionSheetWithOptions({
                message: "Check out this app Bungee!",
                url: "http://www.bungeegirl.com"
              },
            (error) => alert(error),
            (success, method) => {

            })
            }}
            style={styles.logoutButton}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>

        </View>
        break;
      case 'editProfile':
        title = <Text style={[styles.titleText, {marginBottom: 4, color: Colors.darkGrey}]}>Edit Profile</Text>
        leftButton =
        <TouchableOpacity
          onPress={() => this.setState({render: 'profile'})}
          style={styles.backButton}>
          <Image
            source={require('../assets/Nav-Back.png')}/>
         </TouchableOpacity>
         content =
         <EditListView
           editBirthdate={() => this.setState({render: 'editBirthdate'})}
           editBio={() => this.setState({render: "editBio"})}
           editHometown={() => this.props.navigator.push({ident: 'CityPickerScreen'})}
           editTravelType={() => this.props.navigator.push({ident: 'TravelerProfileScreen', resetProfile: true})}
           editProfilePicture={() => this.setState({render: 'editProfilePicture'})}
           editName={() => this.setState({render: 'editName'})}
           validateFacebookInfo={() => this._validateFacebookInfo()}
           editProfileBackgroundPictures={() => this.setState({render: 'editProfileBackgroundPictures'})}/>
         break;
      case 'editName':
        title = <Text style={[styles.titleText, {marginBottom: 4, color: Colors.darkGrey}]}>Edit Name</Text>
        leftButton =
        <TouchableOpacity
          onPress={() => this.setState({render: 'editProfile'})}
          style={styles.backButton}>
          <Image
            source={require('../assets/Nav-Back.png')}/>
         </TouchableOpacity>
         rightButton = () => {
           var button
           if(this._validateName()) {
             button = <Text
               onPress={() => this._submitName()}
               style={[styles.titleText, {color: Colors.red, marginRight: 8}]}> Submit </Text>
           } else {
             button = <Text style={[styles.titleText, {color: Colors.darkGrey, marginRight: 8}]}> Submit </Text>
           }
           return button
         }
         content =
         <NamePicker
            onSubmitEditing={() => this._submitName()}
            onChangeText={(text) => this.setState({name: text})}/>
         break;
      case 'editBirthdate':
        title = <Text style={[styles.titleText, {marginBottom: 4, color: Colors.darkGrey}]}>Edit Birthday</Text>
        leftButton =
        <TouchableOpacity
          onPress={() => this.setState({render: 'editProfile'})}
          style={styles.backButton}>
          <Image
            source={require('../assets/Nav-Back.png')}/>
         </TouchableOpacity>
         rightButton = () => {
           var button
           if(this._validateBirthdate()) {
             button = <Text
               onPress={() => this._submitBirthdate()}
               style={[styles.titleText, {color: Colors.red, marginRight: 8}]}> Submit </Text>
           } else {
             button = <Text style={[styles.titleText, {color: Colors.darkGrey, marginRight: 8}]}> Submit </Text>
           }
           return button
         }
         content =
         <BirthdatePicker
           excludeIntro={true}
           month={this.state.month}
           day={this.state.day}
           year={this.state.year}
           name={this.state.name}
           onChangeMonth={(text) => this.setState({month: text})}
           onChangeDay={(text) => this.setState({day: text})}
           onChangeYear={(text) => this.setState({year: text})}
           onSubmitEditing={() => this._submitBirthdate()}/>
         break;
      case 'editBio':
         title = <Text style={[styles.titleText, {marginBottom: 4, color: Colors.darkGrey}]}>Edit Bio</Text>
         leftButton =
         <TouchableOpacity
           onPress={() => this.setState({render: 'editProfile'})}
           style={styles.backButton}>
           <Image
             source={require('../assets/Nav-Back.png')}/>
          </TouchableOpacity>
          rightButton = () => {
            var button
            if(this._validateBio()) {
              button = <Text
                onPress={() => this._submitBio()}
                style={[styles.titleText, {color: Colors.red, marginRight: 8}]}> Submit </Text>
            } else {
              button = <Text style={[styles.titleText, {color: Colors.darkGrey, marginRight: 8}]}> Submit </Text>
            }
            return button
          }
          content =
          <BioEditor
            imageData={this.props.userData.imageData}
            onChangeText={(text) => this.setState({bio: text})}
            bio={this.state.bio}/>
          break;
      case 'editProfilePicture':
        title = <Text style={[styles.titleText, {marginBottom: 4, color: Colors.darkGrey}]}>Edit Profile Picture</Text>
        leftButton =
        <TouchableOpacity
          onPress={() => this.setState({render: 'editProfile'})}
          style={styles.backButton}>
          <Image
            source={require('../assets/Nav-Back.png')}/>
         </TouchableOpacity>
         rightButton = () => {
           var button
           if(this._validateImage()) {
             button = <Text
               onPress={() => this._submitAvatar()}
               style={[styles.titleText, {color: Colors.red, marginRight: 8}]}> Submit </Text>
           } else {
             button = <Text style={[styles.titleText, {color: Colors.darkGrey, marginRight: 8}]}> Submit </Text>
           }
           return button
         }
         content =
         <AvatarPicker
            excludeIntro={true}
            onImageLoad={() => this.setState({loadingData: true})}
            onImagePress={(imageData) =>  {
              var successCallBack = () => this.setState({loadingData: false, imageData: "", render: 'profile'})
              var errorCallBack = () => {}
              this.props.eventEmitter.emit('editAvatar', imageData, successCallBack, errorCallBack)
            }}/>
         break;
      case 'editProfileBackgroundPictures':
        title = <Text style={[styles.titleText, {marginBottom: 4, color: Colors.darkGrey}]}>Profile Background Images</Text>
        leftButton =
        <TouchableOpacity
          onPress={() => this.setState({render: 'editProfile'})}
          style={styles.backButton}>
          <Image
            source={require('../assets/Nav-Back.png')}/>
        </TouchableOpacity>
        content =
        <ProfileImagePicker
          excludeIntro={true}
          year={this.props.userData.year}
          month={this.props.userData.month}
          days={this.props.userData.day}
          profileImages={this.state.profileImages}
          deSelectImage={(newImages) => this.setState({profileImages: newImages})}
          onDataLoad={() => this.setState({loadingData: true})}
          onFinishLoad={(profileImages) => {
            this.setState({loadingData: false, profileImages: profileImages})
          }}
          onFinishPicking={(profileImages) => {
            var successCallBack = () => { this.setState({loadingData: false, render: 'profile', profileImages: []})}
            var errorCallBack = () => {}
            this.props.eventEmitter.emit('editProfileImages', profileImages, successCallBack, errorCallBack)
          }}/>
         break;
      default:
        content = <View />
    }

    return (
      <ViewContainer backgroundColor='transparent'>
        <NavigationBar
          title={title}
          rightButton={rightButton()}
          leftButton={leftButton}
          style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}} />
        {content}
        <Spinner visible={this.state.loadingData}/>
      </ViewContainer>
    )
  }

  _submitName() {
    var successCallBack = () => { this.setState({loadingData: false, render: 'profile', name: this.state.name})}
    var errorCallBack = () => {}
    this.props.eventEmitter.emit('editProfileName', this.state.name, successCallBack, errorCallBack)
  }

  _submitBirthdate() {
    var successCallBack = () => { this.setState({loadingData: false, render: 'profile', day: "", month: "", year: ""})}
    var errorCallBack = () => {}
    this.props.eventEmitter.emit('editBirthdate', {month: this.state.month, day: this.state.day, year: this.state.year}, successCallBack, errorCallBack)
  }

  _submitBio() {
    var successCallBack = () => { this.setState({loadingData: false, render: 'profile', bio: ""})}
    var errorCallBack = () => {}
    this.props.eventEmitter.emit('editProfileBio', this.state.bio, successCallBack, errorCallBack)
  }

  _validateFacebookInfo() {
    var successCallBack = () => { this.setState({loadingData: false, render: 'profile'})}
    var errorCallBack = () => {}
    this.props.eventEmitter.emit('validateFacebookInfo', successCallBack, errorCallBack)
  }

  _logout() {
    AsyncStorage.clear()
    FBLoginManager.logout(() => {})
    this.props.navigator.resetTo({
      ident: "LoginScreen"
    })
  }

  _editProfile(){
    this.setState({render: 'editProfile'})
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
    backgroundColor: Colors.blue,
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
