import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  PropTypes,
  Navigator
} from 'react-native'

import LoginScreen from '../screens/LoginScreen'
import SignInScreen from '../screens/SignInScreen'
import SignupScreen from '../screens/SignupScreen'
import QuestionScreen from '../screens/QuestionScreen'
import CityPickerScreen from '../screens/CityPickerScreen'
import ExperienceScreen from '../screens/ExperienceScreen'
import HomeScreen from '../screens/HomeScreen'
import InfoScreen from '../screens/InfoScreen'
import ChatListScreen from '../screens/ChatListScreen'
import ChatScreen from '../screens/ChatScreen'
import CityBrowserScreen from '../screens/CityBrowserScreen'
import UserProfileScreen from '../screens/UserProfileScreen'

class AppNavigator extends Component {

  constructor(props) {
    super(props)
  }

  renderScene(route, navigator) {
    var globalScreenProps = {
      navigator: navigator,
      uid: this.props.uid,
      userData: this.props.userData,
      firebaseRef: this.props.firebaseRef,
      eventEmitter: this.props.eventEmitter
    }

    switch (route.ident) {
      case "LoginScreen":
        return (
          <LoginScreen
            {...globalScreenProps} />
        )
      case "InfoScreen":
        return (
          <InfoScreen
            {...globalScreenProps}/>
        )
      case "SignupScreen":
        return (
          <SignupScreen
            isFacebookAuthenticated={route.isFacebookAuthenticated}
            {...globalScreenProps} />
        )
      case "SignInScreen":
        return (
          <SignInScreen
            {...globalScreenProps} />
        )
      case "QuestionScreen":
        return (
          <QuestionScreen
            {...globalScreenProps}
            resetProfile={route.resetProfile}/>
        )
      case "CityPickerScreen":
        return (
          <CityPickerScreen
            {...globalScreenProps}/>
        )
      case "HomeScreen":
        return (
          <HomeScreen
            {...globalScreenProps}/>
        )
      case "ExperienceScreen":
        return (
          <ExperienceScreen
            {...globalScreenProps}/>
        )
      case "ChatListScreen":
        return (
          <ChatListScreen
            {...globalScreenProps}/>
        )
      case "ChatScreen":
        return (
          <ChatScreen
            {...globalScreenProps}
            userName={route.userName}
            otherUserImage={route.otherUserImage}
            userUid={route.userUid}/>
        )
      case "CityBrowserScreen":
        return(
          <CityBrowserScreen
            cityIdent={route.cityIdent}
            {...globalScreenProps}/>
        )
      case "UserProfileScreen":
        return (
          <UserProfileScreen
            userDisplayData={route.userDisplayData}
            uidToRender={route.uidToRender}
            {...globalScreenProps}/>
        )
    }
  }

  render() {
    return (
      <Navigator
        ref="TheNavigator"
        initialRoute={{ident: this.props.initialRoute}}
        renderScene={(route, navigator) => this.renderScene(route, navigator)}
        configureScene={(route) => ({
          ...route.sceneConfig || Navigator.SceneConfigs.FloatFromRight,
          gestures: route.gestures
        })}/>
    )
  }

  getNavigator() {
    return this.refs.TheNavigator
  }
}

AppNavigator.propTypes = {
  uid: PropTypes.string.isRequired,
  firebaseRef: PropTypes.object.isRequired,
  initialRoute: PropTypes.string.isRequired}

module.exports = AppNavigator
