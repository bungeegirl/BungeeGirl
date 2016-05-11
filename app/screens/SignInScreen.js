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

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height

class SignInScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  _validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email);
  }

  _validateEmailPassword() {
    return (this._validateEmail(this.state.email) && this.state.password != "")
  }

  render() {
    var title = <Text style={[styles.titleText, {marginBottom: 4}]}>Sign In</Text>
    var leftButton =
    <TouchableOpacity
      onPress={() => this.props.navigator.pop()}
      style={styles.backButton}>
      <Image
        source={require('../assets/Nav-Back.png')}/>
     </TouchableOpacity>
    var rightButton
    if(this._validateEmailPassword()) {
      rightButton =
      <Text
        onPress={() => this._login()}
        style={[styles.titleText, {color: Colors.red, marginRight: 8}]}> Submit </Text>
    } else {
      rightButton = <Text style={[styles.titleText, {color: Colors.darkGrey, marginRight: 8}]}> Submit </Text>
    }
    var content =
    <ViewContainer backgroundColor={Colors.beige}>
      <NavigationBar
        style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}}
        title={title}
        leftButton={leftButton}
        rightButton={rightButton}/>
      {this._renderEmailPassword()}
    </ViewContainer>
    return content
  }

  _renderEmailPassword() {
    var content =
    <View style={[styles.container, {flex: 1}]}>
      <TextInput
        autoFocus={true}
        keyboardType='email-address'
        style={styles.formInput}
        onChangeText={(text) => this.setState({email: text})}
        placeholderTextColor={Colors.fadedGrey}
        onEndEditing={() => this.refs.PasswordTextInput.focus()}
        placeholder='Email'/>
      <View style={{height: 10}} />
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

  _login() {
    var successCallBack = (route) => { this.props.navigator.resetTo({ ident: route })}
    var errorCallBack = (error) => {  Alert.alert('Error signing in', JSON.stringify(error.code))}
    this.props.eventEmitter.emit('loginUser', this.state, successCallBack, errorCallBack)
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
  formInput: {
    fontSize: 32,
    height: 74,
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
    opacity: 0.5
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

module.exports = SignInScreen
