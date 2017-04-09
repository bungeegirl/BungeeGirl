import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, Alert, View } from 'react-native';

import Swiper from 'react-native-swiper'
import Colors from '../styles/Colors'

var styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
    backgroundColor: Colors.beige,
  },
  text: {
    color: Colors.darkGrey,
    textAlign: 'center',
    fontSize: 30,
    fontFamily: "ArchitectsDaughter",
    fontWeight: 'bold',
  }
})

var swiper = React.createClass({
  _onMomentumScrollEnd: function (e, state, context) {
  },
  render: function() {
    return (
      <Swiper style={styles.wrapper}
        onMomentumScrollEnd={this._onMomentumScrollEnd}
        showsButtons={true}
        loop={false}>
        <View style={styles.slide}>
          <Text style={[styles.text, {fontSize: 48, marginBottom: 24}]}>Here's how the app works</Text>
          <Text style={styles.text}>Create a really cool profile where you can display some of your best travel experiences. We also have a fun way to find out what your travel identity is.</Text>
        </View>
        <View style={styles.slide}>
          <Text style={styles.text}>Choose which city you want to travel to.</Text>
        </View>
        <View style={styles.slide}>
          <Text style={styles.text}> Connect with like-minded solo female travelers from locations you want to visit. Your connection will be based on the fact that you each have an equal interest in visiting each other's city for a future solo trip. You can also connect in your own home city, you may find a travel buddy for your next trip</Text>
        </View>
        <View
          style={styles.slide}>
          <Text
            onPress={() => this.props.onComplete()}
            style={[styles.text, {color: Colors.blue}]}>DONE</Text>
        </View>
      </Swiper>
    )
  }
})

module.exports = swiper
