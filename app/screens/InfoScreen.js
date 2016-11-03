
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
import ProfileImagePicker from '../components/ProfileImagePicker'
import NamePicker from '../components/NamePicker'
import BirthdatePicker from '../components/BirthdatePicker'
import AvatarPicker from '../components/AvatarPicker'
import BioEditor from '../components/BioEditor'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../styles/Colors'
import NavigationBar from 'react-native-navbar'
import CameraRollView from '../components/CameraRollView'
import moment from 'moment'
import _ from 'underscore'
import Spinner from 'react-native-loading-spinner-overlay';
var ImagePickerManager = require('NativeModules').ImagePickerManager

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height

class InfoScreen extends Component {

  constructor(props) {
    super(props)
    this.screens = [
      {
        titleText: 'Sign Up',
        component: () => this._renderName(),
        backAction: () => this.props.navigator.resetTo({
          ident: "LoginScreen"
        }),
        rightButton: () => {
          var button
          if(this._validateName()) {
            button = <Text
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
        component: () => this._renderBirthdate(),
        backAction: () => this.setState({formIndex: 0}),
        rightButton: () => {
          var button
          if(this._validateBirthdate()) {
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
        component: () => this._renderAvatar(),
        backAction: () => this.setState({formIndex: 1}),
        rightButton: () => {
          var button
          if(this._validateImage()) {
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
        titleText: 'Your Bio',
        component: () => this._renderBio(),
        backAction: () => this.setState({formIndex: 2}),
        rightButton: () => {
          var button
          if(this._validateBio()) {
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
        titleText: 'Sign Up',
        component: () => this._renderProfileImages(),
        backAction: () => this.setState({formIndex: 3}),
        rightButton: () => {
          var button
          if(this._validateProfileImages()) {
            button = <Text
              onPress={() => this.setState({formIndex: 5})}
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
        backAction: () => this.setState({formIndex: 4}),
        rightButton: () => {
          return (
            <Text
            onPress={() => this._addProfileData()}
            style={[styles.titleText, {color: Colors.red, marginRight: 8}]}> Next </Text>
        )}
      },
    ]
    var formIndex = 0
    this.state = {
      loadingData: false,
      formIndex: formIndex,
      name: "",
      month: "",
      day: "",
      year: "",
      imageData: "",
      bio: "",
      profileImages: [],
    }
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

  _validateProfileImages() {
    return this.state.profileImages.length == 5 && _.every(this.state.profileImages, (image) => image ? true : false)
  }

  _validateBio() {
    return this.state.bio != ""
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
      <Spinner visible={this.state.loadingData} />
    </ViewContainer>
    return content
  }

  _renderName() {
    var content =
    <NamePicker
      onChangeText={(text) => this.setState({name: text})}
      onSubmitEditing={() => this.setState({formIndex: this.state.formIndex + 1})}/>

    return content
  }

  _renderBirthdate() {
    var content =
    <BirthdatePicker
      month={this.state.month}
      day={this.state.day}
      year={this.state.year}
      name={this.state.name}
      onChangeMonth={(text) => this.setState({month: text})}
      onChangeDay={(text) => this.setState({day: text})}
      onChangeYear={(text) => this.setState({year: text})}
      onSubmitEditing={() => this.setState({formIndex: this.state.formIndex + 1})}/>
    return content
  }

  _renderAvatar() {
    var content =
    <AvatarPicker
      year={this.state.year}
      month={this.state.month}
      day={this.state.day}
      onImageLoad={() => this.setState({loadingData: true})}
      onImagePress={(image) => this.setState({imageData: image, formIndex: 3, loadingData: false})}/>

    return content
  }

  _renderProfileImages() {
    var content =
    <ProfileImagePicker
      year={this.state.year}
      month={this.state.month}
      days={this.state.days}
      profileImages={this.state.profileImages}
      onDataLoad={() => this.setState({loadingData: true})}
      deSelectImage={(newImages) => this.setState({profileImages: newImages})}
      onFinishLoad={(profileImages) => this.setState({loadingData: false, profileImages: profileImages})}
      onFinishPicking={(profileImages) => this.setState({loadingData: false, profileImages: profileImages, formIndex: 5})}/>
    return content
  }

  _renderBio() {
    var content =
    <BioEditor
      imageData={this.state.imageData}
      bio={this.state.bio}
      onChangeText={(text) => this.setState({bio: text})}/>
    return content
  }

  _renderGetStarted() {
    var uri = `data:image/jpeg;base64, ${this.state.imageData}`
    var age = moment().diff(moment({years: this.state.year, months: this.state.month, days: this.state.days}), 'years')
    var content =
    <View style={[styles.container, {flex: 1}]}>
      <View style={[styles.inputContainer, {marginTop: -10}]}>
        <Text style={styles.formPretext}>Hi</Text>
        <Text style={styles.formPretext}>{this.state.name}</Text>
      </View>
      <View style={[styles.inputContainer, {marginTop: -20}]}>
        <Text style={styles.formPretext}>{age} years old</Text>
      </View>
      <Image
        resizeMode='cover'
        source={{uri: uri}}
        style={styles.avatarImage}/>
      <Text style={[styles.formLabel, {marginTop: 24, marginBottom: 10}]}>WHAT KIND OF BUNGEE GIRL ARE YOU?</Text>
      <Text
        numberOfLines={10}
        style={styles.bungeeText}>As Bungee Girls we each have a venturesome spirit, wanderlust desires,  embrace risk-taking, crave confidence and seek personal development through exploring the world. But we each have different travel habits. Lets discover what your travel personality is. This can help  you find people just like you!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          this._addProfileData()}}>
        <View style={styles.buttonBackground}>
          <Text style={styles.buttonText}>GET STARTED</Text>
          <View style={{flex: 1}} />
          <Image
            resizeMode='contain'
            source={require('../assets/selection-arrow.png')}
            style={{width: 48, height: 14, marginRight: 10}}/>
        </View>
      </TouchableOpacity>
    </View>
    return content
  }

  _addProfileData() {
    var errorCallBack = () => { }
    var successCallBack = () => {
      this.props.navigator.resetTo({
        ident: "QuestionScreen"
      })
    }
    this.props.eventEmitter.emit('addProfileData', this.state, successCallBack, errorCallBack)
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
    fontFamily: "ArchitectsDaughter"
  },
  container: {
    padding: 20,
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  formLabel: {
    color: Colors.fadedGrey,
    fontFamily: "ArchitectsDaughter",
    fontSize: 18,
  },
  formInput: {
    fontSize: 32,
    fontFamily: "ArchitectsDaughter",
    height: 74,
  },
  bioContainer: {
    height: 150,
    fontSize: 18,
    fontFamily: "ArchitectsDaughter",
  },
  bungeeText: {
    marginTop: 16,
    marginBottom: 16,
    fontSize: 14,
    marginRight: 48,
    fontFamily: "ArchitectsDaughter",
  },
  formPretext: {
    fontSize: 32,
    fontFamily: "ArchitectsDaughter",
    marginRight: 8,
  },
  inputContainer: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60
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
  },
  buttonBackground: {
    backgroundColor: Colors.lightBlue,
    opacity: 0.8,
    width: deviceWidth - 30,
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
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
  },
  checkMarkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

module.exports = InfoScreen
