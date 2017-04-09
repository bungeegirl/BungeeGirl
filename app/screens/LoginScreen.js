
import React, { Component } from 'react';
import { StyleSheet, Text, Image, ActivityIndicator, TouchableOpacity, View, Alert, AsyncStorage, Dimensions } from 'react-native';

import ViewContainer from '../components/ViewContainer'
import Colors from '../styles/Colors'

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height
var { FBLoginManager } = require('react-native-facebook-login')


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
          <Image
            style={styles.logo}
            resizeMode='contain'
            source={require('../assets/bungee.png')}/>
          <Text style={[styles.whyText, { color: Colors.red, fontSize: 18, fontWeight: '700'}]}>Bringing together girls who wander!</Text>
          <View style={{flex: 1}} />
          <TouchableOpacity
            style={styles.facebookButton}
            onPress={() => this._facebookAuth()}>
            <Text style={styles.buttonText}>Connect with Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert('Facebook verification', "This is a girls-only zone and we want to keep it that way so we require sign up through Facebook for your security. Using Facebook, we'll be able to verify gender and other key information")}>
            <Text style={[styles.whyText, {marginTop: 10}]}>Why do I have to sign in through facebook?</Text>
          </TouchableOpacity>
        </View>
        { this.state.isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
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
    width: deviceWidth * .7,
    height: deviceWidth * .7,
    marginTop: deviceWidth * .2,
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
  whyText: {
    fontSize: 12,
    fontWeight: '600',
    padding: 12,
    color: Colors.blue,
    textAlign: 'center',
    fontFamily: 'ArchitectsDaughter'
  }
})

module.exports = LoginScreen
