/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

global.__DEV__ = false

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Alert,
  View,
  AsyncStorage,
} from 'react-native'

import codePush, {
  InstallMode
} from "react-native-code-push"
import AppNavigator from './app/navigation/AppNavigator'
import { NativeModules } from 'react-native';
import RootTabs from './app/navigation/RootTabs'
import OnBoardingScreen from './app/screens/OnBoardingScreen'
import firebase from './firebase'
import EventEmitter from 'EventEmitter'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import _ from 'underscore'
import Spinner from 'react-native-loading-spinner-overlay';
var Raven = require('raven-js');
require('raven-js/plugins/react-native')(Raven);
import OneSignal from 'react-native-onesignal';
import {
  MessageBar,
  MessageBarManager
} from 'react-native-message-bar'

var { FBLoginManager } = require('react-native-facebook-login')

Raven
  .config('https://428836d3216248a69f1dcb85c8ba9d72@sentry.io/98471', { release: "1.1" })
  .install();

const Native = NativeModules.Native;

let instance
class FlipTrip extends Component {

  constructor(props) {
    super(props)
    instance = this

    this.eventEmitter = new EventEmitter()
    this.firebaseRef = new Firebase('https://fliptrip-dev.firebaseio.com/')
    this.state = {
      loadingData: true,
      sawOnBoardingScreen: false,
      userData: {
      },
      uid: '',
    }
  }

  componentDidMount() {
    var firebaseRef = this.firebaseRef
    codePush.sync({
      updateDialog: true,
      installMode: InstallMode.IMMEDIATE
    })
    // AsyncStorage.clear()
    //   FBLoginManager.logout(() => {})

    MessageBarManager.registerMessageBar(this.refs.alert)

    AsyncStorage.multiGet(['authMethod','onBoardingScreen'], (error, data) => {
      this.setState({sawOnBoardingScreen: data[1][1]})
      if(data[0][1] == 'email') {
        AsyncStorage.multiGet(['uid', 'email', 'password'], (err, stores) => {
          this.firebaseRef.authWithPassword({
            email: stores[1][1],
            password: stores[2][1]
          }, (error, authData) => {
            var uid = stores[0][1]
            Native.setBatchId(authData.uid)
            this.firebaseRef.child('users').child(uid).on('value', (userData) => { this._syncUserData(userData.val(),uid) })
          })
        })
      } else if (data[0][1] == 'facebook') {
        AsyncStorage.multiGet(['uid', 'OAuthToken'], (err, stores) => {
          let oAuthToken = stores[1][1]
          if(oAuthToken) {
            this.firebaseRef.authWithOAuthToken('facebook', oAuthToken, (error, authData) => {
              if(error) {
                Alert.alert('Error', JSON.stringify(error.code))
                this.setState({loadingData: false})
              } else {
                let uid = authData.uid
                Native.setBatchId(uid)
                this._configureNotifications(uid)
                this.firebaseRef.child('users').child(uid).on('value', (userData) => { this._syncUserData(userData.val(),uid) })
              }
            })
          } else {
            this.setState({loadingData: false})
          }

        })
      } else {
        this.setState({loadingData: false})
      }
    })
    this.eventEmitter.addListener('createUser',(userData, successCallBack, errorCallBack) => this._createUser(userData, successCallBack, errorCallBack))
    this.eventEmitter.addListener('addProfileData', (userData, successCallBack, errorCallBack) => this._addProfileData(userData, successCallBack, errorCallBack))
    this.eventEmitter.addListener('updateTravelProfile', (travelIdent, successCallBack) => this._updateTravelProfile(travelIdent, successCallBack))
    this.eventEmitter.addListener('resetTravelProfile', (travelIdent, successCallBack) => this._updateTravelProfile(travelIdent, successCallBack, true))
    this.eventEmitter.addListener('citySelected', (selectedCity, successCallBack) => this._updateSelectedCity(selectedCity, successCallBack))
    this.eventEmitter.addListener('browsedCity', (selectedCity, successCallBack) => this._browsedCity(selectedCity, successCallBack))
    this.eventEmitter.addListener('createUserFromFacebook',(successCallBack, errorCallBack) => this._createUserFromFacebook(successCallBack, errorCallBack))
    this.eventEmitter.addListener('validateFacebookInfo', (successCallBack, errorCallBack) => this._validateFacebookInfo(successCallBack, errorCallBack))
    this.eventEmitter.addListener('loginUser', (userData, successCallBack, errorCallBack) => this._loginUser(userData, successCallBack, errorCallBack))
    this.eventEmitter.addListener('editProfileImages', (profileImages, successCallBack, errorCallBack) => this._editProfileImages(profileImages,successCallBack,errorCallBack))
    this.eventEmitter.addListener('editProfileName', (name, successCallBack, errorCallBack) => this._editProfileName(name, successCallBack, errorCallBack))
    this.eventEmitter.addListener('editProfileBio', (bio, successCallBack, errorCallBack) => this._editProfileBio(bio, successCallBack, errorCallBack))
    this.eventEmitter.addListener('editBirthdate', (birthdate, successCallBack, errorCallBack) => this._editBirthdate(birthdate, successCallBack, errorCallBack))
    this.eventEmitter.addListener('editAvatar', (image, successCallBack, errorCallBack) => this._editAvatar(image, successCallBack, errorCallBack))
    this.eventEmitter.addListener('travelingTo', (text) => this._updateTravelingTo(text))

    this.eventEmitter.addListener('sendPushWithMessage', (messageData) => this._sendPushWithMessage(messageData))
    RCTDeviceEventEmitter.addListener(FBLoginManager.Events["Login"], (loginData) => {
      AsyncStorage.multiSet([['OAuthToken', loginData.credentials.token]])
      // firebaseRef.authWithOAuthToken("facebook", loginData.credentials.token, function(error, authData) {
      //   if (error) {
      //     console.log("Login Failed!", error);
      //   } else {
      //     console.log("Authenticated successfully with payload:", authData)
      //     AsyncStorage.multiSet([['OAuthToken', loginData.credentials.token],['uid', authData.uid]])
      //     var email
      //     authData.facebook.email ? email = authData.facebook.email : email = ""
      //     firebaseRef.child('users').child(authData.uid).update({
      //       provider: authData.provider,
      //       email: email
      //     })
      //     renderContext.refs.TheNavigator.getNavigator().push({
      //       ident: "SignupScreen",
      //       isFacebookAuthenticated: true
      //     })
      //   }
      // })
    })
  }

  componentWillUnmount() {
    MessageBarManager.unregisterMessageBar()
  }

  _configureNotifications(uid) {
    OneSignal.addEventListener('ids', (device) => {
      instance.firebaseRef.child('users').child(uid).update({pushToken: device.userId})
      let userDataClone = _.clone(instance.state.userData)
      userDataClone['pushToken'] = device.pushToken
      instance.setState({userData: userDataClone})
    })
    OneSignal.addEventListener('received', (notification) => {
      console.log(notification)
    })
    OneSignal.addEventListener('opened', (result) => {
      let {
        isAppInFocus,
        payload: {
          body,
          additionalData: {
            type,
            userId
          }
        }
      } = result.notification

      if(type === 'follow') {
        instance.firebaseRef.child(`users/${userId}`).once('value', snap => {
          instance.eventEmitter.emit('pushRoute', {
            ident: 'UserProfileScreen',
            userDisplayData: snap.val()
          })
        })
      } else if(type == 'new postcard') {
        MessageBarManager.showAlert({
          title: 'New Postcard',
          message: body,
          onTapped: _ => {
            instance.firebaseRef.child(`users/${userId}`).once('value', snap => {
              instance.eventEmitter.emit('pushRoute', {
                ident: 'PostcardScreen',
                userDisplayData: snap.val()
              })
            })
          }
        })
      }
    })
  }

  _createUser(userData, successCallBack, errorCallBack) {
    this.firebaseRef.createUser({
      email: userData.email,
      password: userData.password
    }, (error, data) => {
      if (error) {
        errorCallBack(error)
      } else {
        this.firebaseRef.authWithPassword({
          email: userData.email,
          password: userData.password
        }, (error, authData) => {
          Native.setBatchId(authData.uid)
          AsyncStorage.multiSet([['uid', data.uid],['email', userData.email], ['password', userData.password],['authMethod', 'email']])
          var userDataToWrite = {
            provider: authData.provider,
            email: userData.email,
            onBoardingStep: 'profile',
            uid: data.uid,
          }
          this.firebaseRef.child('users').child(data.uid).on('value', (theData) => { this._syncUserData(theData.val(),data.uid) })
          this.firebaseRef.child('users').child(data.uid).set(userDataToWrite)
          successCallBack()
        })
      }
    })
  }

  _validateFacebookInfo(successCallBack, errorCallBack) {
    var firebaseRef = this.firebaseRef
    FBLoginManager.loginWithPermissions(["email", "public_profile", "user_hometown", "user_photos"],function(error, data) {
      if (!error) {
        firebaseRef.authWithOAuthToken('facebook', data.credentials.token, (error, authData) => {
          if(error) {
            errorCallBack()
          } else {
            Native.setBatchId(authData.uid)
            AsyncStorage.getItem('authMethod', (error, data) => {
              if(data == 'email') {
                AsyncStorage.multiGet(['uid', 'email', 'password'], (err, stores) => {
                  firebaseRef.authWithPassword({
                    email: stores[1][1],
                    password: stores[2][1]
                  }, (error, authData2) => {
                    if(authData.facebook.cachedUserProfile.gender) {
                      firebaseRef.child('users').child(instance.state.uid).update({
                        gender: authData.facebook.cachedUserProfile.gender
                      })
                    }
                  })
                })
              } else if (data == 'facebook') {
                if(authData.facebook.cachedUserProfile.gender) {
                  firebaseRef.child('users').child(instance.state.uid).update({
                    gender: authData.facebook.cachedUserProfile.gender
                  })
                }
              }
            })
            successCallBack()
          }
        })
      } else {
        errorCallBack()
      }
    })
  }

  _createUserFromFacebook(successCallBack, errorCallBack) {
    var firebaseRef = this.firebaseRef
    FBLoginManager.loginWithPermissions(["email", "public_profile", "user_location", "user_photos"],function(error, data) {
      if (!error) {
        Raven.captureMessage('Facebook login data:', {extra: data});
        firebaseRef.authWithOAuthToken('facebook', data.credentials.token, (error, authData) => {
          if(error) {
            Raven.captureMessage('Facebook login error', {extra: error});
            errorCallBack(error)
          } else {
            Raven.captureMessage('Facebook successfull authentication', { extra: authData});
            Native.setBatchId(authData.uid)
            AsyncStorage.multiSet([['uid', authData.uid],['authMethod', 'facebook']])
            var email, gender
            authData.facebook.email ? email = authData.facebook.email : email = ""
            authData.facebook.cachedUserProfile.gender ? gender = authData.facebook.cachedUserProfile.gender : gender = ''
            if(gender !== 'female') {
              errorCallBack('Bungee girl is for girls only!')
              FBLoginManager.logout(() => {})
            } else {
              instance._configureNotifications(authData.uid)
              firebaseRef.child('users').child(authData.uid).once('value', (theData) => {
                var onBoardingStep
                var location = authData.facebook.cachedUserProfile.location ? authData.facebook.cachedUserProfile.location.name : 'No location verified'
                _.has(theData.val(), 'onBoardingStep') ? onBoardingStep = theData.val().onBoardingStep : onBoardingStep = 'profile'
                firebaseRef.child('users').child(authData.uid).update({
                  provider: authData.provider,
                  email: email,
                  gender: gender,
                  onBoardingStep: onBoardingStep,
                  uid: authData.uid,
                  facebookLocation: location
                })
                firebaseRef.child('users').child(authData.uid).on('value', (theData) => { instance._syncUserData(theData.val(),authData.uid) })
                successCallBack(instance._routeForStep(onBoardingStep))
              })
            }
          }
        })
      } else {
        Raven.captureMessage('Facebook complete login error:', { extra: data});
        errorCallBack(data)
      }
    })
  }

  _addProfileData(userData, successCallBack, errorCallBack) {
    var userDataToWrite = _.pick(userData, 'name', 'imageData', 'month', 'day', 'year', 'bio')
    var imageData = {}
    var imageDataToWrite = _.each(userData.profileImages, (image, index) => {
      var imageKey = `image${index}`
      imageData[imageKey] = image.imageData
    })
    userDataToWrite['onBoardingStep'] = 'questions'
    this.firebaseRef.child('users').child(this.state.uid).update(userDataToWrite)
    this.firebaseRef.child('userImages').child(this.state.uid).update(imageData)
    successCallBack()
  }

  _editProfileName(name, successCallBack, errorCallBack) {
    let update = {name: name}
    this.firebaseRef.child('users').child(this.state.uid).update(update)
    this.firebaseRef.child('cities').child(this.state.userData.city).child(this.state.uid).update(update)
    successCallBack()
  }

  _editProfileBio(bio, successCallBack, errorCallBack) {
    let update = {bio: bio}
    this.firebaseRef.child('users').child(this.state.uid).update(update)
    this.firebaseRef.child('cities').child(this.state.userData.city).child(this.state.uid).update(update)
    successCallBack()
  }

  _editBirthdate(birthdate, successCallBack, errorCallBack) {
    this.firebaseRef.child('users').child(this.state.uid).update(birthdate)
    successCallBack()
  }

  _editAvatar(image, successCallBack, errorCallBack) {
    this.firebaseRef.child('users').child(this.state.uid).update({imageData: image})
    successCallBack()
  }

  _updateTravelingTo(text) {
    this.firebaseRef.child('cities').child(this.state.userData.city).child(this.state.uid).update({travelingTo: text})
  }

  _editProfileImages(profileImages, successCallBack, errorCallBack) {
    var imageData = {}
    var imageDataToWrite = _.each(profileImages, (image, index) => {
      var imageKey = `image${index}`
      imageData[imageKey] = image.imageData
    })
    this.firebaseRef.child('userImages').child(this.state.uid).update(imageData)
    successCallBack()
  }

  _updateTravelProfile(travelIdent, successCallBack, reset) {
    if(reset) {
      this.firebaseRef.child('users').child(this.state.uid).update({
        travelType: travelIdent,
      })
      this.firebaseRef.child('cities').child(this.state.userData.city).child(this.state.uid).update({travelType: travelIdent})
    } else {
      this.firebaseRef.child('users').child(this.state.uid).update({
        onBoardingStep: 'citySelect',
        travelType: travelIdent,
      })
    }
    successCallBack()
  }

  _updateSelectedCity(selectedCity, successCallBack) {
    if(this.state.userData.city) {
      let oldCity = this.state.userData.city
      this.firebaseRef.child('cities').child(oldCity).child(this.state.uid).once('value', (userData) => {
        this.firebaseRef.child('cities').child(oldCity).child(this.state.uid).remove()
        this.firebaseRef.child('cities').child(selectedCity).child(this.state.uid).update(userData.val())
      })
      this.firebaseRef.child('users').child(this.state.uid).update({city: selectedCity})
    } else {
      var input = {
        uid: this.state.uid,
        name: this.state.userData.name,
        travelType: this.state.userData.travelType,
        bio: this.state.userData.bio,
      }
      if(this.state.userData.pushToken) {
        input.pushToken = this.state.userData.pushToken
      }
      this.firebaseRef.child('cities').child(selectedCity).child(this.state.uid).update(input)
      this.firebaseRef.child('users').child(this.state.uid).update({
        city: selectedCity,
        onBoardingStep: 'home'
      })
    }

    successCallBack()
  }

  _browsedCity(selectedCity, successCallBack) {
    var timestamp = new Date().getTime()
    var timeVisited = {}
    timeVisited[`${selectedCity}`] = timestamp
    this.firebaseRef.child('cities').child(this.state.userData.city).child(this.state.uid).update(timeVisited)
    successCallBack()
  }

  _loginUser(userData, successCallBack, errorCallBack) {
    this.firebaseRef.authWithPassword({
      email: userData.email,
      password: userData.password
    }, (error, authData) => {
      if(error) {
        errorCallBack(error)
      } else {
        Native.setBatchId(authData.uid)
        AsyncStorage.multiSet([['uid', authData.uid],['email', userData.email], ['password', userData.password],['authMethod', 'email']])
      }
    })
    .then((data) => {
      this.firebaseRef.child('users').child(data.uid).once('value', (theData) => {
        this._syncUserData(theData.val(), data.uid)
        var onBoardingStep
        _.has(theData.val(), 'onBoardingStep') ? onBoardingStep = theData.val().onBoardingStep : onBoardingStep = 'profile'
        successCallBack(this._routeForStep(onBoardingStep))
      })
    })
  }
  _syncUserData(userData, uid) {
    this.setState({userData: userData, loadingData: false, uid: uid})
    this.state.userData.city && this.state.userData.pushToken && this.firebaseRef.child(`cities/${this.state.userData.city}`).child(uid).update({pushToken: this.state.userData.pushToken})

  }

  _initiateMessage(uid) {
    // send push message
    this.firebaseRef.child('chats').child(this.state.uid).child(uid).update({ chatRequested: true, chatAccepted: false })
    this.firebaseRef.child('chats').child(uid).child(this.state.uid).update({ chatRequested: true, chatAccepted: false })
  }

  _sendPushWithMessage(messageData) {
    const {uid, name, text, pushToken } = messageData
    const contents = {
        'en': `${name}: ${text}`
    }
    pushToken && OneSignal.postNotification(contents, {}, pushToken)
  }

  render() {
    var mainContent
    var initialRoute
    if(this.state.loadingData) {
      mainContent = <Spinner visible={true}/>
    } else {
      var onBoardingStep
      _.has(this.state.userData, 'onBoardingStep') ? onBoardingStep = this.state.userData.onBoardingStep : onBoardingStep = ""
      if(onBoardingStep == 'home') {
        mainContent =
        <RootTabs
          uid={this.state.uid}
          userData={this.state.userData}
          eventEmitter={this.eventEmitter}
          firebaseRef={this.firebaseRef}
          initialTab='profile'/>
      } else {
        initialRoute = this._routeForStep(onBoardingStep)
        mainContent =
        <AppNavigator
          ref="TheNavigator"
          uid={this.state.uid}
          userData={this.state.userData}
          eventEmitter={this.eventEmitter}
          firebaseRef={this.firebaseRef}
          initialRoute={initialRoute} />
      }
    }
    return (
      <View style={{flex: 1}}>
        {mainContent}
        <MessageBar ref='alert' />
      </View>
    )
  }

  _routeForStep(onBoardingStep) {
    var route
    switch (onBoardingStep) {
      case "profile":
        route = 'InfoScreen'
        break
      case "questions":
        route = 'QuestionScreen'
        break
      case 'citySelect':
        route = 'CityPickerScreen'
        break
      case 'home':
        route = 'HomeScreen'
        break
      default:
        route = 'LoginScreen'
    }
    return {
      ident: route
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('FlipTrip', () => FlipTrip);
