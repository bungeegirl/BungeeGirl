import React, { Component } from 'react';
import { StyleSheet, Text, Image, TextInput, View, TouchableOpacity, Dimensions } from 'react-native';

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height
import Colors from '../styles/Colors'


class NamePicker extends Component {
  render() {
    var content =
    <View style={[styles.container, {flex: 1}]}>
      <Text style={styles.formLabel}>What's your name?</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.formPretext}>I'm</Text>
        <TextInput
          style={[styles.formInput, {flex: 1}]}
          autoFocus={true}
          onSubmitEditing={() => this.props.onSubmitEditing()}
          onChangeText={(text) => this.props.onChangeText(text)}/>
      </View>
    </View>

    return content
  }
}

module.exports = NamePicker

const styles = StyleSheet.create({
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
  inputContainer: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center'
  },
  formPretext: {
    fontSize: 32,
    fontFamily: "ArchitectsDaughter",
    marginRight: 8,
  },
})
