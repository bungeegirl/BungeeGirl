import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Alert,
  View,
} from 'react-native'

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
    // you can get `state` and `this`(ref to swiper's context) from params
    console.log(state, context.state)
  },
  render: function() {
    return (
      <Swiper style={styles.wrapper}
      onMomentumScrollEnd={this._onMomentumScrollEnd}
      showsButtons={true}>
        <View style={styles.slide}>
          <Text style={styles.text}>Create a really cool profile where you can display some of your best travel experiences. We also have a fun way to find out what your travel identity is.</Text>
        </View>
        <View style={styles.slide}>
          <Text style={styles.text}>Choose which city you want to travel to.</Text>
        </View>
        <View style={styles.slide}>
          <Text style={styles.text}> Get connected with like-minded bungee girls from the selected location that also have an interest in traveling to YOUR city as well. Because you each want to travel to each others' city, you can help each other out with trip ideas, safety tips, accommodation and someone to hang out with when you get there.</Text>
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
