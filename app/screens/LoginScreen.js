
import React, {
  Component,
  StyleSheet,
  Text,
  Image,
  ActivityIndicatorIOS,
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

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false
    }
  }

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
          <View style={{flex: 1, alignSelf: 'stretch'}}>
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
        { this.state.isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicatorIOS
              size='large'
              animating={true}/>
          </View>
        )}
      </ViewContainer>
    )
  }

  _facebookAuth() {
    var renderContext = this
    var successCallBack = (route) => {
      renderContext.setState({isLoading: false})
      this.props.navigator.resetTo({
      ident: route
    })}
    var errorCallBack = (error) => {
      renderContext.setState({isLoading: false})
      Alert.alert("Error with login", JSON.stringify(error))
    }
    this.setState({isLoading: true})
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
    width: 300,
    height: 300,
    marginTop: 100,
    marginBottom: 8,
  },
  introText: {
    color: Colors.grey,
    fontFamily: "ArchitectsDaughter",
    textAlign: 'center',
    fontSize: 18,
    marginTop: 16,
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
    marginTop: 16,
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
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: deviceHeight,
    width: deviceWidth,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

module.exports = LoginScreen
