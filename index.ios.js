/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Alert,
  View,
  AsyncStorage
} from 'react-native'

import codePush from "react-native-code-push"
import AppNavigator from './app/navigation/AppNavigator'
import { NativeModules } from 'react-native';
import RootTabs from './app/navigation/RootTabs'
import OnBoardingScreen from './app/screens/OnBoardingScreen'
import firebase from 'firebase'
import EventEmitter from 'EventEmitter'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import _ from 'underscore'
import RNGeocoder from 'react-native-geocoder'
import Spinner from 'react-native-loading-spinner-overlay';

const Native = NativeModules.Native;

var FBLoginManager = require('NativeModules').FBLoginManager
class FlipTrip extends Component {
  constructor(props) {
    super(props)
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
    var renderContext = this
    codePush.sync()
    // AsyncStorage.clear()
    //   FBLoginManager.logout(() => {})

    AsyncStorage.multiGet(['authMethod','onBoardingScreen'], (error, data) => {
      this.setState({sawOnBoardingScreen: data[1][1]})
      console.log(data[1])
      if(data[0][1] == 'email') {
        AsyncStorage.multiGet(['uid', 'email', 'password'], (err, stores) => {
          this.firebaseRef.authWithPassword({
            email: stores[1][1],
            password: stores[2][1]
          }, (error, authData) => {
            var uid = stores[0][1]
            Native.setBatchId(authData.uid)
            this.firebaseRef.child('users').child(uid).on('value', (userData) => { this._syncUserData(userData.val(),uid) })
            console.log(authData)
          })
        })
      } else if (data[0][1] == 'facebook') {
        AsyncStorage.multiGet(['uid', 'OAuthToken'], (err, stores) => {
          console.log(stores)
          if(stores[1][1]) {
            this.firebaseRef.authWithOAuthToken('facebook',stores[1][1], (error, authData) => {
              if(error) {
                Alert.alert('Error', JSON.stringify(error.code))
                this.setState({loadingData: false})
              } else {
                Native.setBatchId(authData.uid)
                var uid = stores[0][1]
                this.firebaseRef.child('users').child(stores[0][1]).on('value', (userData) => { this._syncUserData(userData.val(),uid) })
              }
            })
          } else {
            this.setState({loadingData: false})
          }

        })
      } else {
        this.setState({loadingData: false})
        console.log("no user createed")
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
      console.log(loginData)
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
    var renderContext = this
    FBLoginManager.loginWithPermissions(["email", "public_profile", "user_hometown"],function(error, data) {
      if (!error) {
        console.log("Login data: ", data);
        firebaseRef.authWithOAuthToken('facebook', data.credentials.token, (error, authData) => {
          if(error) {
            errorCallBack()
          } else {
            Native.setBatchId(authData.uid)
            console.log("Authenticated successfully with payload:", authData)
            AsyncStorage.getItem('authMethod', (error, data) => {
              if(data == 'email') {
                AsyncStorage.multiGet(['uid', 'email', 'password'], (err, stores) => {
                  firebaseRef.authWithPassword({
                    email: stores[1][1],
                    password: stores[2][1]
                  }, (error, authData2) => {
                    console.log("reauthenticated with email", authData)
                    if(authData.facebook.cachedUserProfile.gender) {
                      firebaseRef.child('users').child(renderContext.state.uid).update({
                        gender: authData.facebook.cachedUserProfile.gender
                      })
                    }
                    console.log(authData)
                  })
                })
              } else if (data == 'facebook') {
                if(authData.facebook.cachedUserProfile.gender) {
                  firebaseRef.child('users').child(renderContext.state.uid).update({
                    gender: authData.facebook.cachedUserProfile.gender
                  })
                }
              }
            })
            successCallBack()
          }
        })
      } else {
        console.log("Error: ", data);
        errorCallBack()
      }
    })
  }

  _createUserFromFacebook(successCallBack, errorCallBack) {
    var firebaseRef = this.firebaseRef
    var renderContext = this
    FBLoginManager.loginWithPermissions(["email", "public_profile", "user_hometown"],function(error, data) {
      if (!error) {
        console.log("Login data: ", data);
        firebaseRef.authWithOAuthToken('facebook', data.credentials.token, (error, authData) => {
          if(error) {
            errorCallBack(error)
          } else {
            console.log("Authenticated successfully with payload:", authData)
            Native.setBatchId(authData.uid)
            AsyncStorage.multiSet([['uid', authData.uid],['authMethod', 'facebook']])
            var email, gender
            authData.facebook.email ? email = authData.facebook.email : email = ""
            authData.facebook.cachedUserProfile.gender ? gender = authData.facebook.cachedUserProfile.gender : gender = ''
            firebaseRef.child('users').child(authData.uid).once('value', (theData) => {
              var onBoardingStep
              _.has(theData.val(), 'onBoardingStep') ? onBoardingStep = theData.val().onBoardingStep : onBoardingStep = 'profile'
              firebaseRef.child('users').child(authData.uid).update({
                provider: authData.provider,
                email: email,
                gender: gender,
                onBoardingStep: onBoardingStep,
                uid: authData.uid
              })
              firebaseRef.child('users').child(authData.uid).on('value', (theData) => { renderContext._syncUserData(theData.val(),authData.uid) })
              successCallBack(renderContext._routeForStep(onBoardingStep))
            })
          }
        })
      } else {
        console.log("Error: ", data);
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
    } else {
      this.firebaseRef.child('users').child(this.state.uid).update({
        onBoardingStep: 'citySelect',
        travelType: travelIdent,
      })
    }
    this.firebaseRef.child('cities').child(this.state.userData.city).child(this.state.uid).update({travelType: travelIdent})
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
    var timeVisited = {selectedCity: timestamp}
    console.log(selectedCity, timestamp)
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
  }

  _initiateMessage(uid) {
    // send push message
    console.log("attempting initiation")
    this.firebaseRef.child('chats').child(this.state.uid).child(uid).update({ chatRequested: true, chatAccepted: false })
    this.firebaseRef.child('chats').child(uid).child(this.state.uid).update({ chatRequested: true, chatAccepted: false })
  }

  _sendPushWithMessage(messageData) {
    const {uid, name, text } = messageData
    const uri = 'https://api.batch.com/1.0/578EC1727C200A73BE71A173171ECF/transactional/send'
    const body = {
      'group_id': `${this.state.uid}-${uid}`,
      'recipients': {
        'custom_ids': [uid]
      },
      'message': {
        'title': name,
        'body': `${name}: ${text}`
      }
    }

    const apiData = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': '38d2666af1f34348af2e5876bc4198ce'
      },
      body: JSON.stringify(body)
    }

    fetch(uri, apiData)
    .then((response) => {
      console.log('success', response)
    })
    .catch((error) => {
      console.error(error)
    })
  }

  render() {
    var mainContent
    var initialRoute
    if(this.state.loadingData) {
      mainContent = <Spinner visible={true}/>
    } else if(!this.state.sawOnBoardingScreen){
      mainContent =
      <OnBoardingScreen
        onComplete={() => {
          AsyncStorage.setItem('onBoardingScreen', JSON.stringify(true))
          this.setState({sawOnBoardingScreen: true})
        }}/>
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
    return mainContent
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
    return route
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
