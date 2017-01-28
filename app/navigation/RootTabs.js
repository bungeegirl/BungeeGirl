import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native'

import TabNavigator from '../../react-native-tab-navigator'
import AppNavigator from './AppNavigator'
import Icon from 'react-native-vector-icons/Ionicons'
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
    <Icon
      style={{height: 36, width: 36}}
      name='ios-person-outline'
      size={40}
      color={Colors.darkGrey}/>

    var profileIconSelected =
    <Icon
      style={{height: 36, width: 36}}
      name='ios-person'
      size={40}
      color={Colors.darkGrey}/>

    var chatIcon =
    <Icon
      style={{height: 32, width: 32}}
      name='ios-chatbubbles-outline'
      size={32}
      color={Colors.darkGrey}/>

    var chatIconSelected =
    <Icon
      style={{height: 32, width: 32}}
      name='ios-chatbubbles'
      size={32}
      color={Colors.darkGrey}/>

    var travelIcon =
    <Icon
      style={{height: 32, width: 32}}
      name='ios-globe-outline'
      size={32}
      color={Colors.darkGrey}/>

    var travelIconSelected =
    <Icon
      style={{height: 32, width: 32}}
      name='ios-globe'
      size={32}
      color={Colors.darkGrey}/>

    var settingsIcon =
    <Icon
      style={{height: 32, width: 32}}
      name='ios-settings-outline'
      size={32}
      color={Colors.darkGrey}/>

    var settingsIconSelected =
    <Icon
      style={{height: 32, width: 32}}
      name='ios-settings'
      size={32}
      color={Colors.darkGrey}/>

    var postcardIcon =
    <Image
      source={require('../assets/postcard-icon.png')}
      style={{height: 28}} />

    var postcardIconSelected =
    <Image
      source={require('../assets/postcard-outline-icon.png')}
      style={{height: 28}} />

    var tabNavigator =
    <TabNavigator
      tabBarStyle={{backgroundColor: Colors.beige, overflow: 'hidden', height: 48}}>
      <TabNavigator.Item
        selected={this.state.selectedTab === 'profile'}
        renderIcon={() => profileIcon}
        renderSelectedIcon={() => profileIconSelected}
        onPress={() => this.setState({ selectedTab: 'profile' })}>
        <AppNavigator
          {...globalScreenProps}
          initialRoute='HomeScreen' />
      </TabNavigator.Item>
      <TabNavigator.Item
        testID="travel-tab"
        selected={this.state.selectedTab === 'travel'}
        renderIcon={() => travelIcon}
        renderSelectedIcon={() => travelIconSelected}
        onPress={() => this.setState({ selectedTab: 'travel' })}>
        <AppNavigator
          {...globalScreenProps}
          initialRoute='ExperienceScreen' />
      </TabNavigator.Item>
      <TabNavigator.Item
        selected={this.state.selectedTab === 'chat'}
        renderIcon={() => chatIcon}
        renderSelectedIcon={() => chatIconSelected}
        onPress={() => this.setState({ selectedTab: 'chat' })}>
        <AppNavigator
          {...globalScreenProps}
          initialRoute='ChatListScreen' />
      </TabNavigator.Item>
      <TabNavigator.Item
        selected={this.state.selectedTab === 'postcard'}
        renderIcon={() => postcardIcon}
        renderSelectedIcon={() => postcardIconSelected}
        onPress={() => this.setState({ selectedTab: 'postcard' })}>
        <AppNavigator
          {...globalScreenProps}
          initialRoute='PostcardScreen' />
      </TabNavigator.Item>
    </TabNavigator>

    return tabNavigator
  }
}

module.exports = RootTabs
