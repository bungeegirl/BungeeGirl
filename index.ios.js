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
  View
} from 'react-native'

import codePush from "react-native-code-push"
import AppNavigator from './app/navigation/AppNavigator'
import firebase from 'firebase'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'

var FBLoginManager = require('NativeModules').FBLoginManager


class FlipTrip extends Component {
  constructor(props) {
    super(props)
    this.firebaseRef = new Firebase('https://fliptrip-dev.firebaseio.com/')
  }

  componentDidMount() {
    var firebaseRef = this.firebaseRef
    codePush.sync()
    console.log(firebaseRef.getAuth())
    RCTDeviceEventEmitter.addListener(FBLoginManager.Events["Login"], (loginData) => {
      firebaseRef.authWithOAuthToken("facebook", loginData.credentials.token, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData)
          firebaseRef.child('users').child(authData.uid).set({
            provider: authData.provider,
            name: authData.facebook.displayName
          })
        }
      })
    })
  }

  render() {
    return (
      <AppNavigator
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
