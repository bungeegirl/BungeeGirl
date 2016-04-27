
import React, {
  Component,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
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
        <Image
          source={require('../assets/grid-background.png')}
          resizeMode='cover'
          style={styles.backgroundImage} />
        <View style={styles.container}>
          <View style={styles.logo} />
          <Text style={styles.introText}>FlipTrip is for travellers to</Text>
          <Text style={styles.introText}>connect and help each other</Text>
          <Text style={styles.introText}>explore the globe.</Text>
          <Text style={[styles.introText, {marginTop: 10}]}>Use the app to meet people</Text>
          <Text style={styles.introText}>from other major cities and</Text>
          <Text style={styles.introText}>create unique experiences.</Text>
          <View style={{flex: 1}} />
          <TouchableOpacity
            style={styles.facebookButton}
            onPress={() => this._facebookAuth()}>
            <Text style={styles.buttonText}>Connect with Facebook</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => FBLoginManager.logout(() => {})}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => this._signUp()}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ViewContainer>
    )
  }

  _facebookAuth() {
    FBLoginManager.login(function(error, data) {
      if (!error) {
        console.log("Login data: ", data);
      } else {
        console.log("Error: ", data);
      }
    })
  }

  _signUp() {
    this.props.navigator.push({
      ident: 'SignupScreen'
    })
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: deviceWidth,
    height: deviceHeight,
    top: 0,
    left: 0,
  },
  logo: {
    width: 120,
    height: 120,
    marginTop: 48,
    marginBottom: 48,
    borderRadius: 60,
    backgroundColor: 'grey'
  },
  introText: {
    color: Colors.grey,
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 8,
  },
  facebookButton: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
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
    fontSize: 21
  },
  loginButton : {
    height: 48,
    width: 150,
    borderRadius: 4,
    alignSelf: 'stretch',
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

module.exports = LoginScreen
