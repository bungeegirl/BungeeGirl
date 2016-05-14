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
import firebase from 'firebase'
import EventEmitter from 'EventEmitter'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import _ from 'underscore'

var FBLoginManager = require('NativeModules').FBLoginManager


class FlipTrip extends Component {
  constructor(props) {
    super(props)
    this.eventEmitter = new EventEmitter()
    this.firebaseRef = new Firebase('https://fliptrip-dev.firebaseio.com/')
    this.state = {
      loadingData: true,
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

    AsyncStorage.getItem('authMethod', (error, data) => {
      if(data == 'email') {
        AsyncStorage.multiGet(['uid', 'email', 'password'], (err, stores) => {
          this.firebaseRef.authWithPassword({
            email: stores[1][1],
            password: stores[2][1]
          }, (error, authData) => {
            var uid = stores[0][1]
            this.firebaseRef.child('users').child(uid).on('value', (userData) => { this._syncUserData(userData.val(),uid) })
            console.log(authData)
          })
        })
      } else if (data == 'facebook') {
        AsyncStorage.multiGet(['uid', 'OAuthToken'], (err, stores) => {
          console.log(stores)
          this.firebaseRef.authWithOAuthToken('facebook',stores[1][1], (error, authData) => {
            if(error) {
              Alert.alert('Error', JSON.stringify(error.code))
              this.setState({loadingData: false})
            } else {
              var uid = stores[0][1]
              this.firebaseRef.child('users').child(stores[0][1]).on('value', (userData) => { this._syncUserData(userData.val(),uid) })
            }
          })

        })
      } else {
        this.setState({loadingData: false})
        console.log("no user createed")
      }
    })
    this.eventEmitter.addListener('createUser',(userData, successCallBack, errorCallBack) => this._createUser(userData, successCallBack, errorCallBack))
    this.eventEmitter.addListener('addProfileData', (userData, successCallBack, errorCallBack) => this._addProfileData(userData, successCallBack, errorCallBack))
    this.eventEmitter.addListener('updateTravelProfile', (travelIdent, successCallBack) => this._updateTravelProfile(travelIdent, successCallBack))
    this.eventEmitter.addListener('citySelected', (selectedCity, successCallBack) => this._updateSelectedCity(selectedCity, successCallBack))
    this.eventEmitter.addListener('createUserFromFacebook',(successCallBack, errorCallBack) => this._createUserFromFacebook(successCallBack, errorCallBack))
    this.eventEmitter.addListener('loginUser', (userData, successCallBack, errorCallBack) => this._loginUser(userData, successCallBack, errorCallBack))

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

  _createUserFromFacebook(successCallBack, errorCallBack) {
    var firebaseRef = this.firebaseRef
    var renderContext = this
    FBLoginManager.login(function(error, data) {
      if (!error) {
        console.log("Login data: ", data);
        firebaseRef.authWithOAuthToken('facebook', data.credentials.token, (error, authData) => {
          if(error) {
            errorCallBack(error)
          } else {
            console.log("Authenticated successfully with payload:", authData)
            AsyncStorage.multiSet([['uid', authData.uid],['authMethod', 'facebook']])
            var email
            authData.facebook.email ? email = authData.facebook.email : email = ""
            firebaseRef.child('users').child(authData.uid).once('value', (theData) => {
              var onBoardingStep
              _.has(theData.val(), 'onBoardingStep') ? onBoardingStep = theData.val().onBoardingStep : onBoardingStep = 'profile'
              firebaseRef.child('users').child(authData.uid).update({
                provider: authData.provider,
                email: email,
                onBoardingStep: onBoardingStep
              })
              firebaseRef.child('users').child(authData.uid).on('value', (theData) => { renderContext._syncUserData(theData.val(),authData.uid) })
              successCallBack(renderContext._routeForStep(onBoardingStep))
            })
          }
        })
      } else {
        console.log("Error: ", data);
      }
    })
  }

  _addProfileData(userData, successCallBack, errorCallBack) {
    console.log(this.state.uid)
    var userDataToWrite = _.pick(userData, 'name', 'imageData', 'month', 'day', 'year')
    userDataToWrite['onBoardingStep'] = 'questions'
    this.firebaseRef.child('users').child(this.state.uid).update(userDataToWrite)
    successCallBack()
  }

  _updateTravelProfile(travelIdent, successCallBack) {
    this.firebaseRef.child('users').child(this.state.uid).update({
      onBoardingStep: 'citySelect',
      travelType: travelIdent,
    })
    successCallBack()
  }

  _updateSelectedCity(selectedCity, successCallBack) {
    this.firebaseRef.child('users').child(this.state.uid).update({
      city: selectedCity,
      onBoardingStep: 'home'
    })
    var input = {}
    input[this.state.uid] = true
    this.firebaseRef.child('cities').child(selectedCity).update(input)
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

  render() {
    var mainContent
    var initialRoute
    console.log(this.state.userData)
    if(this.state.loadingData) {
      mainContent = <View />
    } else {
      var onBoardingStep
      _.has(this.state.userData, 'onBoardingStep') ? onBoardingStep = this.state.userData.onBoardingStep : onBoardingStep = ""
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
