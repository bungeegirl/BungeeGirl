import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image, StatusBar } from 'react-native';

import Colors from '../styles/Colors'

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height

export default class ViewContainer extends Component {

  componentDidMount() {
  }

  render() {
    StatusBar.setBarStyle('default')
    if(this.props.statusBarOptions) {
      StatusBar.setHidden(true, 'none')
    } else {
      StatusBar.setHidden(false, 'slide')
    }

    return (
      <View
        ref="Container"
        style={styles.container}>
        <Image
          source={require('../assets/container-background.png')}
          resizeMode='cover'
          style={styles.full}/>

        <View style={{
          height: (this.props.hidden ? 0 : 20),
          backgroundColor: this.props.backgroundColor || Colors.beige
        }} />

        <View style={{flex: 1, backgroundColor: this.props.overlayColor || 'transparent'}}>
          {this.props.children}
        </View>
      </View>
    )
  }

  componentWillUnmount() {
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  full: {
    backgroundColor: 'black',
    position: 'absolute',
    height: deviceHeight,
    width: deviceWidth,
    top: 0,
    left: 0
  },
})

module.exports = ViewContainer
