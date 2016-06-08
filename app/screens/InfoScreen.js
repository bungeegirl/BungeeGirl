
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
    return this.state.profileImages.length == 5
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
    <View style={[styles.container, {flex: 1}]}>
      <Text style={styles.formLabel}>What's your name?</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.formPretext}>I'm</Text>
        <TextInput
          style={[styles.formInput, {flex: 1}]}
          autoFocus={true}
          onSubmitEditing={() => this.setState({formIndex: this.state.formIndex + 1})}
          onChangeText={(text) => this.setState({name: text})}/>
      </View>
    </View>

    return content
  }

  _renderImage(asset) {
    let imageSize = deviceWidth / 4
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({loadingData: true})
          NativeModules.ReadImageData.readImage(asset.node.image.uri, (image) => {
            this.setState({imageData: image, formIndex: 3, loadingData: false})
          })}}>
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
            onSubmitEditing={() => this.setState({formIndex: this.state.formIndex + 1})}
            onChangeText={(text) => this.setState({year: text})}/>
      </View>
    </View>

    return content
  }

  _renderAvatar() {
    var age = moment().diff(moment({years: this.state.year, months: this.state.month, days: this.state.days}), 'years')
    var content =
    <View style={{flex: 1, alignItems: 'stretch'}}>
      <View style={styles.container}>
        <View style={[styles.inputContainer, {marginTop: -10}]}>
          <Text style={styles.formPretext}>I'm</Text>
          <Text style={styles.formPretext}>{this.state.name}</Text>
        </View>
        <View style={[styles.inputContainer, {marginTop: -24}]}>
          <Text style={styles.formPretext}>{age} years old</Text>
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

  _renderPictureIcon() {
    var imageSize = deviceWidth / 4
    var options = {
      cameraType: 'back', // 'front' or 'back'

    }
    var content =
    <TouchableOpacity
      onPress={() =>   ImagePickerManager.launchCamera(options, (response)  => {
        this.setState({imageData: response.data, formIndex: 3})
    })}>
      <Image
        style={{height: imageSize, width: imageSize}}
        resizeMode='contain'
        source={require('../assets/photo-placeholder.png')} />
    </TouchableOpacity>
    return content
  }

  _renderBio() {
    var uri = `data:image/jpeg;base64, ${this.state.imageData}`
    var content =
    <View style={[styles.container, {flex: 1}]}>
      <Image
        resizeMode='cover'
        source={{uri: uri}}
        style={styles.avatarImage}/>
      <Text style={[styles.formLabel, {marginTop: 16, marginBottom: 16}]}>Add a little about yourself...</Text>
      <TextInput
        style={styles.bioContainer}
        maxLength={140}
        placeholder='Enter a short bio, e.g. “I’m a commercial architect for a big studio, who likes to shop & dine abroad in between projects!'
        onChangeText={(text) => { this.setState({bio: text}) }}
        multiline={true}/>
      <Text style={[styles.formLabel, {marginTop: 16, marginBottom: 16}]}>{this.state.bio.length}/180 Characters</Text>
    </View>
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
      <Text style={[styles.formLabel, {marginTop: 100, marginBottom: 10}]}>WHAT KIND OF BUNGEE GIRL ARE YOU?</Text>
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
