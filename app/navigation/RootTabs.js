import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native'

import TabNavigator from 'react-native-tab-navigator'
import AppNavigator from './AppNavigator'
import Colors from '../styles/Colors'
import _ from 'underscore'

class RootTabs extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedTab: props.initialTab
    }
  }

  render() {
    var globalScreenProps = {
      uid: this.props.uid,
      userData: this.props.userData,
      firebaseRef: this.props.firebaseRef,
      eventEmitter: this.props.eventEmitter
    }

    var profileIcon =
    <Image
      style={{height: 28, width: 28, backgroundColor: Colors.beige}}
      source={require('../assets/profile-icon.png')}
      resizeMode='contain'/>

    var chatIcon =
    <Image
      style={{height: 28, width: 28, backgroundColor: Colors.beige}}
      source={require('../assets/profile-icon.png')}
      resizeMode='contain'/>

    var travelIcon =
    <Image
      style={{height: 28, width: 28, backgroundColor: Colors.beige}}
      source={require('../assets/travel-icon.png')}
      resizeMode='contain'/>

    var tabNavigator =
    <TabNavigator
      tabBarStyle={{backgroundColor: Colors.beige, overflow: 'hidden', height: 48}}>
      <TabNavigator.Item
        selected={this.state.selectedTab === 'profile'}
        renderIcon={() => profileIcon}
        renderSelectedIcon={() => profileIcon}
        onPress={() => this.setState({ selectedTab: 'profile' })}>
        <AppNavigator
          {...globalScreenProps}
          initialRoute='HomeScreen' />
      </TabNavigator.Item>
      <TabNavigator.Item
        selected={this.state.selectedTab === 'travel'}
        renderIcon={() => travelIcon}
        renderSelectedIcon={() => travelIcon}
        onPress={() => this.setState({ selectedTab: 'travel' })}>
        <AppNavigator
          {...globalScreenProps}
          initialRoute='HomeScreen' />
      </TabNavigator.Item>
      <TabNavigator.Item
        selected={this.state.selectedTab === 'chat'}
        renderIcon={() => chatIcon}
        renderSelectedIcon={() => chatIcon}
        onPress={() => this.setState({ selectedTab: 'chat' })}>
        <AppNavigator
          {...globalScreenProps}
          initialRoute='HomeScreen' />
      </TabNavigator.Item>
    </TabNavigator>

    return tabNavigator
  }
}

module.exports = RootTabs
