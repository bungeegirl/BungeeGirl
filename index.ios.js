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
      userData: {
      }
    }
  }

  componentDidMount() {
    var firebaseRef = this.firebaseRef
    var renderContext = this
    codePush.sync()
//     this.firebaseRef.removeUser({
//       email: 'Ari@gmail.com',
//       password: 'test'
//     }, function(error) {
//   if (error) {
//     switch (error.code) {
//       case "INVALID_USER":
//         console.log("The specified user account does not exist.");
//         break;
//       case "INVALID_PASSWORD":
//         console.log("The specified user account password is incorrect.")
//         break;
//       default:
//         console.log("Error removing user:", error)
//     }
//   } else {
//     console.log("User account deleted successfully!")
//   }
// })
    // AsyncStorage.clear()

    AsyncStorage.getItem('authMethod', (error, data) => {
      if(data == 'email') {
        AsyncStorage.multiGet(['uid', 'email', 'password'], (err, stores) => {
          this.firebaseRef.authWithPassword({
            email: stores[1][1],
            password: stores[2][1]
          }, (error, authData) => {
            console.log(authData)
          })
        })
      } else if (data == 'facebook') {
        AsyncStorage.multiGet(['uid', 'OAuthToken'], (err, stores) => {
          this.firebaseRef.authWithOAuthToken('facebook',stores[1][1], (error, authData) => {
            console.log(authData)
          })
        })
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
          firebaseRef.child('users').child(authData.uid).set({
            provider: authData.provider,
            email: authData.facebook.email
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
          this.firebaseRef.child('users').child(data.uid).set({
            provider: authData.provider,
            name: userData.name,
            email: userData.email,
            imageData: userData.imageData,
            birthday: {
              month: userData.month,
              day: userData.day,
              year: userData.year,
            }
          })
        })
      }
    })
    // this.firebaseRef.onAuth((authData) => { this.authDataCallback(authData, userData) })
    // UserDefaults.setStringForKey(id, 'OAuthToken')
  }

  _createUserFromFacebookLogin(userData) {
    console.log('creating user from facebook')
    AsyncStorage.setItem('authMethod', 'facebook')
    AsyncStorage.getItem('uid', (error, data) => {
      console.log('uid is:',data)
      this.firebaseRef.child('users').child(data).update({
        name: userData.name,
        imageData: userData.imageData,
        birthday: {
          month: userData.month,
          day: userData.day,
          year: userData.year,
        }
      })
    })
  }

  render() {
    return (
      <AppNavigator
        ref="TheNavigator"
        eventEmitter={this.eventEmitter}
        firebaseRef={this.firebaseRef}
        initialRoute="LoginScreen" />
    )
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
