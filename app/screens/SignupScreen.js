
import React, {
  Component,
  StyleSheet,
  Text,
  Image,
  TextInput,
  NativeModules,
  ScrollView,
  View,
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
    this.screens = [
      {
        titleText: 'Sign Up',
        component: () => this._renderEmailPassword(),
        backAction: () => this.props.navigator.pop(),
        rightButton: () => {
          var button
          if(this._validateEmailPassword()) {
            button =
            <Text
              onPress={() => this.setState({formIndex: 1})}
              style={[styles.titleText, {color: Colors.red, marginRight: 8}]}> Next </Text>
          } else {
            button = <Text style={[styles.titleText, {color: Colors.darkGrey, marginRight: 8}]}> Next </Text>
          }
          return button
        }
      },
      {
        titleText: 'Sign Up',
        component: () => this._renderName(),
        backAction: () => this.setState({formIndex: 0}),
        rightButton: () => {
          var button
          if(this._validateName()) {
            button = <Text
              onPress={() => this.setState({formIndex: 2})}
              style={[styles.titleText, {color: Colors.red, marginRight: 8}]}> Next </Text>
          } else {
            button = <Text style={[styles.titleText, {color: Colors.darkGrey, marginRight: 8}]}> Next </Text>
          }
          return button
        }
      },
      {
        titleText: 'Sign Up',
        component: () => this._renderBirthdate(),
        backAction: () => this.setState({formIndex: 1}),
        rightButton: () => {
          var button
          if(this._validateBirthdate()) {
            button = <Text
              onPress={() => this.setState({formIndex: 3})}
              style={[styles.titleText, {color: Colors.red, marginRight: 8}]}> Next </Text>
          } else {
            button = <Text style={[styles.titleText, {color: Colors.darkGrey, marginRight: 8}]}> Next </Text>
          }
          return button
        }
      },
      {
        titleText: 'Sign Up',
        component: () => this._renderAvatar(),
        backAction: () => this.setState({formIndex: 2}),
        rightButton: () => {
          var button
          if(this._validateImage()) {
            button = <Text
              onPress={() => this.setState({formIndex: 4})}
              style={[styles.titleText, {color: Colors.red, marginRight: 8}]}> Next </Text>
          } else {
            button = <Text style={[styles.titleText, {color: Colors.darkGrey, marginRight: 8}]}> Next </Text>
          }
          return button
        }
      },
      {
        titleText: 'Get Started',
        component: () => this._renderGetStarted(),
        backAction: () => this.setState({formIndex: 3}),
        rightButton: () => {
          return (
            <Text
            onPress={() => this._createUser()}
            style={[styles.titleText, {color: Colors.red, marginRight: 8}]}> Next </Text>
        )}
      },
    ]
    var formIndex
    this.props.isFacebookAuthenticated ? formIndex = 1 : formIndex = 0
    this.state = {
      formIndex: formIndex,
      email: "",
      password: "",
      name: "",
      month: "",
      day: "",
      year: "",
      imageData: "",
    }
  }
  _validateEmailPassword() {
    return (this._validateEmail(this.state.email) && this.state.password != "")
  }

  _validateName() {
    return this.state.name != ""
  }

  _validateBirthdate() {
    return (this.state.month <= 12 && this.state.day <= 31 && this.state.year <= 2020 && this.state.year > 1900)
  }

  _validateImage() {
    return this.state.imageData != ""
  }

  _validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email);
  }

  render() {
    var title = <Text style={[styles.titleText, {marginBottom: 4}]}>{this.screens[this.state.formIndex].titleText}</Text>
    var leftButton =
    <TouchableOpacity
      onPress={() => this.screens[this.state.formIndex].backAction()}
      style={styles.backButton}>
      <Image
        source={require('../assets/Nav-Back.png')}/>
     </TouchableOpacity>
    var rightButton = this.screens[this.state.formIndex].rightButton()
    var content =
    <ViewContainer backgroundColor={Colors.beige}>
      <NavigationBar
        style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}}
        title={title}
        leftButton={leftButton}
        rightButton={rightButton}/>
      {this.screens[this.state.formIndex].component()}
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

  _renderName() {
    var content =
    <View style={[styles.container, {flex: 1}]}>
      <Text style={styles.formLabel}>What's your name?</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.formPretext}>I'm</Text>
        <TextInput
          style={[styles.formInput, {flex: 1}]}
          autoFocus={true}
          onChangeText={(text) => this.setState({name: text})}/>
      </View>
    </View>

    return content
  }

  _renderImage(asset) {
    var imageSize = deviceWidth / 4
    return (
      <TouchableOpacity
        onPress={() =>
          NativeModules.ReadImageData.readImage(asset.node.image.uri, (image) => {
            this.setState({imageData: image, formIndex: 4})
          })}>
        <Image
          key={`asset.node.image.uri`}
          source={asset.node.image}
          style={{width: imageSize, height: imageSize}}/>
      </TouchableOpacity>
    )
  }

  _renderBirthdate() {
    if(this.state.month.length == 2 && this.state.day.length == 0 && this.state.year.length == 0) {
      this.refs.DaysTextInput.focus()
    }
    if(this.state.day.length == 2 && this.state.month.length == 2 && this.state.year.length == 0) {
      this.refs.YearsTextInput.focus()
    }
    var content =

    <View style={[styles.container, {flex: 1}]}>
      <View style={[styles.inputContainer, {marginTop: -10}]}>
        <Text style={styles.formPretext}>I'm</Text>
        <Text style={styles.formPretext}>{this.state.name}</Text>
      </View>
      <View style={{height: 10}} />
      <Text style={styles.formLabel}>What's your Birthdate?</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.formPretext}>Born</Text>
        <TextInput
          keyboardType='numeric'
          style={[styles.formInput, {width: 60}]}
          autoFocus={true}
          placeholder='MM'
          maxLength={2}
          onChangeText={(text) => this.setState({month: text})}/>
        <Text style={[styles.formPretext, {marginRight: 8, color: Colors.fadedGrey}]}>-</Text>
        <TextInput
          keyboardType='numeric'
          ref="DaysTextInput"
          style={[styles.formInput, {width: 60}]}
          placeholder='DD'
          maxLength={2}
          onChangeText={(text) => this.setState({day: text})}/>
        <Text style={[styles.formPretext, {marginRight: 8, color: Colors.fadedGrey}]}>-</Text>
          <TextInput
            keyboardType='numeric'
            ref="YearsTextInput"
            style={[styles.formInput, {width: 120}]}
            placeholder='YYYY'
            maxLength={4}
            onChangeText={(text) => this.setState({year: text})}/>
      </View>
    </View>

    return content
  }

  _renderAvatar() {
    var content =
    <View style={{flex: 1, alignItems: 'stretch'}}>
      <View style={styles.container}>
        <View style={[styles.inputContainer, {marginTop: -10}]}>
          <Text style={styles.formPretext}>I'm</Text>
          <Text style={styles.formPretext}>{this.state.name}</Text>
        </View>
        <View style={[styles.inputContainer, {marginTop: -24}]}>
          <Text style={styles.formPretext}>Born</Text>
          <Text style={styles.formPretext}>{this.state.month}-{this.state.day}-{this.state.year}</Text>
        </View>
        <Text style={[styles.formLabel, {marginTop: 8, marginBottom: 8}]}>Let's put a face to the name</Text>
      </View>
      <View style={{flex: 1}}>
        <CameraRollView
          imagesPerRow={4}
          renderImage={(asset, isFirst) => {
            if(!isFirst) {
              return this._renderImage(asset)
            } else {
              return this._renderPictureIcon()
            }}} />
      </View>
    </View>
    return content
  }

  _renderPictureIcon() {
    var imageSize = deviceWidth / 4
    var options = {
      cameraType: 'back', // 'front' or 'back'

    }
    var content =
    <TouchableOpacity
      onPress={() =>   ImagePickerManager.launchCamera(options, (response)  => {
        this.setState({imageData: response.data, formIndex: 4})
    })}>
      <Image
        style={{height: imageSize, width: imageSize}}
        resizeMode='contain'
        source={require('../assets/photo-placeholder.png')} />
    </TouchableOpacity>
    return content
  }

  _renderGetStarted() {
    var uri = `data:image/jpeg;base64, ${this.state.imageData}`
    var content =
      <View style={[styles.container, {flex: 1}]}>
        <View style={[styles.inputContainer, {marginTop: -10}]}>
          <Text style={styles.formPretext}>I'm</Text>
          <Text style={styles.formPretext}>{this.state.name}</Text>
        </View>
        <View style={[styles.inputContainer, {marginTop: -20}]}>
          <Text style={styles.formPretext}>Born</Text>
          <Text style={styles.formPretext}>{this.state.month}/{this.state.day}/{this.state.year}</Text>
        </View>
        <Image
          resizeMode='contain'
          source={{uri: uri}}
          style={styles.avatarImage}/>
        <Text style={[styles.formPretext, {marginTop: 10, color: Colors.fadedGrey}]}>& looking good!</Text>
        <Text style={[styles.formLabel, {marginTop: 100, marginBottom: 10}]}>FIGURE OUT YOUR TRAVEL PROFILE</Text>
        <Text
          lineHeight={40}
          numberOfLines={5}
          style={{marginTop: 16, marginBottom: 16, fontSize: 20, marginRight: 48}}>Great, You've set up an awesome profile! Now help us find out what kind of Wanderluster you are. We just need to ask a few questions!</Text>
        <TouchableOpacity
          onPress={() => {
            this._createUser()}}
          style={styles.button}>
          <Text style={styles.buttonText}>GET STARTED</Text>
          <View style={{flex: 1}} />
          <Image
            resizeMode='contain'
            source={require('../assets/selection-arrow.png')}
            style={{width: 48, height: 14, marginRight: 10}}/>
        </TouchableOpacity>
      </View>
    return content
  }

  _createUser() {
    if(this.props.isFacebookAuthenticated) {
      this.props.eventEmitter.emit('createUserFromFacebookLogin', this.state)
    } else {
      this.props.eventEmitter.emit("createUser", this.state)
    }
    this.props.navigator.push({
      ident: "QuestionScreen"
    })
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

module.exports = SignupScreen
