
import React, {
  Component,
  StyleSheet,
  Text,
  Image,
  TextInput,
  NativeModules,
  ScrollView,
  View,
  Alert,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions
} from 'react-native'

import ViewContainer from '../components/ViewContainer'
import Colors from '../styles/Colors'
import NavigationBar from 'react-native-navbar'
import CameraRollView from '../components/CameraRollView'
var ImagePickerManager = require('NativeModules').ImagePickerManager

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height

class SignupScreen extends Component {

  constructor(props) {
    super(props)
    this.screen =
      {
        titleText: 'Sign Up',
        component: () => this._renderEmailPassword(),
        backAction: () => this.props.navigator.resetTo({
          ident: 'LoginScreen'
        }),
        rightButton: () => {
          var button
          if(this._validateEmailPassword()) {
            button =
            <Text
              onPress={() => this._createUser()}
              style={[styles.titleText, {color: Colors.red, marginRight: 8}]}> Next </Text>
          } else {
            button = <Text style={[styles.titleText, {color: Colors.darkGrey, marginRight: 8}]}> Next </Text>
          }
          return button
        }
      }
    this.state = {
      email: "",
      password: "",
    }
  }
  _validateEmailPassword() {
    return (this._validateEmail(this.state.email) && this.state.password != "")
  }
  _validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email);
  }

  render() {
    var title = <Text style={[styles.titleText, {marginBottom: 4}]}>{this.screen.titleText}</Text>
    var leftButton =
    <TouchableOpacity
      onPress={() => this.screens.backAction()}
      style={styles.backButton}>
      <Image
        source={require('../assets/Nav-Back.png')}/>
     </TouchableOpacity>
    var rightButton = this.screen.rightButton()
    var content =
    <ViewContainer backgroundColor={Colors.beige}>
      <NavigationBar
        style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}}
        title={title}
        leftButton={leftButton}
        rightButton={rightButton}/>
      {this.screen.component()}
    </ViewContainer>
    return content
  }

  _renderEmailPassword() {
    var content =
    <View style={[styles.container, {flex: 1}]}>
      <Text style={styles.formLabel}>What's your email address?</Text>
      <TextInput
        autoFocus={true}
        keyboardType='email-address'
        style={styles.formInput}
        onChangeText={(text) => this.setState({email: text})}
        placeholderTextColor={Colors.fadedGrey}
        onEndEditing={() => this.refs.PasswordTextInput.focus()}
        placeholder='Email'/>
      <View style={{height: 10}} />
      <Text style={styles.formLabel}>Create a Password</Text>
      <TextInput
        style={styles.formInput}
        onChangeText={(text) => this.setState({password: text})}
        ref='PasswordTextInput'
        secureTextEntry={true}
        placeholder='Password'
        placeholderTextColor={Colors.fadedGrey}/>
    </View>
    return content
  }

  _createUser() {
    var errorCallBack = (error) => {
      console.log(error)
      Alert.alert('Error creating user', JSON.stringify(error.code))
    }
    var successCallBack = () => {
      this.props.navigator.resetTo({
        ident: 'InfoScreen'
      })
    }
    if(this.props.isFacebookAuthenticated) {
      this.props.eventEmitter.emit('createUserFromFacebookLogin', this.state, successCallBack, errorCallBack)
    } else {
      this.props.eventEmitter.emit("createUser", this.state, successCallBack, errorCallBack)
    }

  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
  },
  container: {
    padding: 20,
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  formLabel: {
    color: Colors.fadedGrey,
    fontSize: 18,
  },
  formInput: {
    fontSize: 32,
    height: 74,
  },
  formPretext: {
    fontSize: 32,
    marginRight: 8,
  },
  inputContainer: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44
  },
  button: {
    position: 'absolute',
    flexDirection: 'row',
    width: deviceWidth - 30,
    height: 50,
    left: -8,
    bottom: 30,
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: Colors.lightBlue,
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    marginLeft: 28,
    fontSize: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  }

})

module.exports = SignupScreen
