
import React, {
  Component,
  StyleSheet,
  Text,
  Image,
  TextInput,
  ScrollView,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions
} from 'react-native'

import ViewContainer from '../components/ViewContainer'
import Colors from '../styles/Colors'
import NavigationBar from 'react-native-navbar'
var ImagePickerManager = require('NativeModules').ImagePickerManager

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height

class SignupScreen extends Component {

  constructor(props) {
    super(props)
    this.screens = [
      {
        component: () => this._renderEmailPassword(),
        backAction: () => this.props.navigator.pop(),
        rightButton: () => {
          var button
          if(this.state.email != "" && this.state.password != "") {
            button = <Text
              onPress={() => this.setState({formIndex: 1})}
              style={styles.titleText}> Next </Text>
          } else {
            button = <Text style={[styles.titleText, {color: Colors.darkGrey}]}> Next </Text>
          }
          return button
        }
      },
      {
        component: () => this._renderName(),
        backAction: () => this.setState({formIndex: 0}),
        rightButton: () => {
          var button
          if(this.state.name != "") {
            button = <Text
              onPress={() => this.setState({formIndex: 2})}
              style={styles.titleText}> Next </Text>
          } else {
            button = <Text style={[styles.titleText, {color: Colors.darkGrey}]}> Next </Text>
          }
          return button
        }
      },
      {
        component: () => this._renderBirthdate(),
        backAction: () => this.setState({formIndex: 1}),
        rightButton: () => {
          var button
          if(this.state.month <= 12 && this.state.day <= 31 && this.state.year <= 2020 && this.state.year > 1900) {
            button = <Text
              onPress={() => this.setState({formIndex: 0})}
              style={styles.titleText}> Next </Text>
          } else {
            button = <Text style={[styles.titleText, {color: Colors.darkGrey}]}> Next </Text>
          }
          return button
        }
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
      year: ""
    }
  }
  componentDidMount() {
  }
  // {this.screens[this.state.formIndex].component()}

  render() {
    var title = <Text style={[styles.titleText, {marginBottom: 4}]}> Sign Up </Text>
    var leftButton = <Text
      onPress={() => this.screens[this.state.formIndex].backAction()}
      style={styles.titleText}> Back </Text>
    var rightButton = this.screens[this.state.formIndex].rightButton()
    var content =
    <ViewContainer backgroundColor={Colors.grey}>
      <NavigationBar
        statusBar={{style: 'light-content'}}
        style={{backgroundColor: Colors.grey, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}}
        title={title}
        leftButton={leftButton}
        rightButton={rightButton}/>
      {this.screens[this.state.formIndex].component()}
    </ViewContainer>
    return content
  }

  _renderEmailPassword() {
    var content =
    <View style={styles.container}>
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
    <View style={styles.container}>
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
      <TouchableWithoutFeedback
        onPress={(asset) => console.log(asset.node)}>
        <Image
          source={asset.node.image}
          style={{width: imageSize, height: imageSize}}/>
      </TouchableWithoutFeedback>
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

    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.formPretext}>I'm</Text>
        <Text style={[styles.formPretext, {color: 'white'}]}>{this.state.name}</Text>
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
        <Text style={[styles.formPretext, {marginRight: 8, color: Colors.fadedGrey}]}>/</Text>
        <TextInput
          keyboardType='numeric'
          ref="DaysTextInput"
          style={[styles.formInput, {width: 60}]}
          placeholder='DD'
          maxLength={2}
          onChangeText={(text) => this.setState({day: text})}/>
          <Text style={[styles.formPretext, {marginRight: 8, color: Colors.fadedGrey}]}>/</Text>
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
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
    color: 'white'
  },
  container: {
    padding: 30,
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: Colors.grey
  },
  formLabel: {
    color: Colors.darkGrey,
    fontSize: 21,
  },
  formInput: {
    fontSize: 32,
    height: 74,
    color: 'white'
  },
  formPretext: {
    fontSize: 32,
    marginRight: 8,
    color: Colors.fadedGrey
  },
  inputContainer: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center'
  }

})

module.exports = SignupScreen
