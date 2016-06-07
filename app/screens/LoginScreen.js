
import React, {
  Component,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Alert,
  AsyncStorage,
  Dimensions
} from 'react-native'

import ViewContainer from '../components/ViewContainer'
import Colors from '../styles/Colors'

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height
var FBLoginManager = require('NativeModules').FBLoginManager


class LoginScreen extends Component {

  render() {

    return (
      <ViewContainer backgroundColor='transparent'>
        <View style={styles.container}>
          <View style={{flex: 3}}>
            <Image
              style={styles.logo}
              resizeMode='contain'
              source={require('../assets/bungee.png')}/>
          </View>
          <View style={{flex: 3}}>
            <Text style={styles.introText}>Hey Bungee Girl! Are you ready to go on an epic trip?</Text>
            <Text style={[styles.introText, {marginTop: 10}]}>Traveling alone can be daunting so we've got to stick together! Let us help you make useful connections to make this trip better than you ever expected!</Text>
            <View style={{flex: 1}} />
          </View>
          <View style={{flex: 2, alignSelf: 'stretch'}}>
            <TouchableOpacity
              style={styles.facebookButton}
              onPress={() => this._facebookAuth()}>
              <Text style={styles.buttonText}>Connect with Facebook</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => this._login()}>
                <Text style={styles.buttonText}>Log In</Text>
              </TouchableOpacity>
              <View style={{width: 10, height: 10}} />
              <TouchableOpacity
                style={[styles.loginButton, {backgroundColor: Colors.red}]}
                onPress={() => this._signUp()}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ViewContainer>
    )
  }

  _facebookAuth() {
    var successCallBack = (route) => this.props.navigator.resetTo({
      ident: route
    })
    var errorCallBack = (error) => {
      Alert.alert("Error with login", JSON.stringify(error))
    }
    this.props.eventEmitter.emit('createUserFromFacebook', successCallBack, errorCallBack)
  }

  _signUp() {
    this.props.navigator.push({
      ident: 'SignupScreen'
    })
  }

  _login() {
    this.props.navigator.push({
      ident: 'SignInScreen'
    })
  }

  _logout() {
    AsyncStorage.clear()
    FBLoginManager.logout(() => {})
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 48,
    marginBottom: 48,
  },
  introText: {
    color: Colors.grey,
    fontFamily: "ArchitectsDaughter",
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 8,
    marginLeft: 32,
    marginRight: 32
  },
  facebookButton: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blue,
    borderRadius: 4,
    marginLeft: 16,
    marginRight: 16,
    height: 48,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    margin: 16,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 21,
    fontFamily: "ArchitectsDaughter",
  },
  loginButton : {
    height: 48,
    flex: 1,
    borderRadius: 4,
    alignSelf: 'stretch',
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

module.exports = LoginScreen
