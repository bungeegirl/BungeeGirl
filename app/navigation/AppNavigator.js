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
import SignupScreen from '../screens/SignupScreen'

class AppNavigator extends Component {

  constructor(props) {
    super(props)
  }

  renderScene(route, navigator) {
    var globalScreenProps = {
      navigator: navigator,
      firebaseRef: this.props.firebaseRef,
      eventEmitter: this.props.eventEmitter
    }

    switch (route.ident) {
      case "LoginScreen":
        return (
          <LoginScreen
            {...globalScreenProps} />
        )
      case "SignupScreen":
        return (
          <SignupScreen
            isFacebookAuthenticated={route.isFacebookAuthenticated}
            {...globalScreenProps} />
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
  firebaseRef: PropTypes.object.isRequired,
  initialRoute: PropTypes.string.isRequired}

module.exports = AppNavigator
