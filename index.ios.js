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

var FBLoginManager = require('NativeModules').FBLoginManager


class FlipTrip extends Component {
  constructor(props) {
    super(props)
    this.eventEmitter = new EventEmitter()
    this.firebaseRef = new Firebase('https://fliptrip-dev.firebaseio.com/')
    this.state = {
      loadingData: true,
      userData: {
      }
    }
  }

  componentDidMount() {
    var firebaseRef = this.firebaseRef
    var renderContext = this
    codePush.sync()
    // AsyncStorage.clear()

    AsyncStorage.getItem('authMethod', (error, data) => {
      if(data == 'email') {
        AsyncStorage.multiGet(['uid', 'email', 'password'], (err, stores) => {
          this.firebaseRef.authWithPassword({
            email: stores[1][1],
            password: stores[2][1]
          }, (error, authData) => {
            this.firebaseRef.child('users').child(stores[0][1]).on('value', (userData) => { this._syncUserData(userData.val()) })
            console.log(authData)
          })
        })
      } else if (data == 'facebook') {
        AsyncStorage.multiGet(['uid', 'OAuthToken'], (err, stores) => {
          this.firebaseRef.authWithOAuthToken('facebook',stores[1][1], (error, authData) => {
            console.log(authData)
          })
          console.log(stores[0][1])
          this.firebaseRef.child('users').child(stores[0][1]).on('value', (userData) => { this._syncUserData(userData.val()) })
        })
      } else {
        this.setState({loadingData: false})
        console.log("no user createed")
      }
    })
    this.eventEmitter.addListener('createUser',(userData) => this._createUser(userData))
    this.eventEmitter.addListener('createUserFromFacebookLogin',(userData) => this._createUserFromFacebookLogin(userData))

    RCTDeviceEventEmitter.addListener(FBLoginManager.Events["Login"], (loginData) => {
      console.log(loginData)
      firebaseRef.authWithOAuthToken("facebook", loginData.credentials.token, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData)
          AsyncStorage.multiSet([['OAuthToken', loginData.credentials.token],['uid', authData.uid]])
          var email
          authData.facebook.email ? email = authData.facebook.email : email = ""
          firebaseRef.child('users').child(authData.uid).update({
            provider: authData.provider,
            email: email
          })
          renderContext.refs.TheNavigator.getNavigator().push({
            ident: "SignupScreen",
            isFacebookAuthenticated: true
          })
        }
      })
    })
  }

  _createUser(userData) {
    this.firebaseRef.createUser({
      email: userData.email,
      password: userData.password
    }, (error, data) => {
      if (error) {
        Alert.alert('Error creating user', JSON.stringify(error.code))
      } else {
        this.firebaseRef.authWithPassword({
          email: userData.email,
          password: userData.password
        }, (error, authData) => {
          AsyncStorage.multiSet([['uid', data.uid],['email', userData.email], ['password', userData.password],['authMethod', 'email']])
          var userData= {
            provider: authData.provider,
            name: userData.name,
            email: userData.email,
            imageData: userData.imageData,
            birthday: {
              month: userData.month,
              day: userData.day,
              year: userData.year,
            },
            profileCreated: true,
          }
          this.firebaseRef.child('users').child(data.uid).set(userData)
          this.setState({userData: userData})
        })
      }
    })
    // this.firebaseRef.onAuth((authData) => { this.authDataCallback(authData, userData) })
    // UserDefaults.setStringForKey(id, 'OAuthToken')
  }

  _createUserFromFacebookLogin(userData) {
    console.log(userData)
    console.log('creating user from facebook')
    AsyncStorage.setItem('authMethod', 'facebook')
    AsyncStorage.getItem('uid', (error, data) => {
      console.log('uid is:',data)
      var userDataObject = {
        name: userData.name,
        imageData: userData.imageData,
        birthday: {
          month: userData.month,
          day: userData.day,
          year: userData.year,
        },
        profileCreated: true,
      }
      console.log(userDataObject)
      this.firebaseRef.child('users').child(data).update(userDataObject)
      this.setState({userData: userDataObject, loadingData: false})
    })
  }

  _syncUserData(userData) {
    this.setState({userData: userData, loadingData: false})
  }

  render() {
    var mainContent
    var initialRoute
    console.log(this.state.userData)
    if(this.state.loadingData) {
      mainContent = <View />
    } else {
      if(!this.state.userData.profileCreated) {
        initialRoute = "LoginScreen"
      } else {
        initialRoute = "QuestionScreen"
      }
      mainContent =
      <AppNavigator
        ref="TheNavigator"
        eventEmitter={this.eventEmitter}
        firebaseRef={this.firebaseRef}
        initialRoute={initialRoute} />
    }
    return mainContent
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
