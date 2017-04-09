
import React, { Component } from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, View, Dimensions } from 'react-native';

import Colors from '../styles/Colors'

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height

var TopNavBar = React.createClass({

  render: function() {
    return (
      <View
        style={styles.container}>
      </View>
    )
  },

})

AppNavigator.propTypes = {
  leftItem: PropTypes.object,
  onLeftItemPressed: PropTypes.function,
  rightItem: PropTypes.object,
  onRightItemPressed: PropTypes.function,
  titleText: PropTypes.string.isRequired
}

var styles = React.StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'center',
    alignItems: 'center',
  }
})

module.exports = TopNavBar
