import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, Image, Dimensions, View, ScrollView } from 'react-native';

var deviceWidth = Dimensions.get('window').width
import questions from '../local_data/questions'
import ViewContainer from '../components/ViewContainer'
import Colors from '../styles/Colors'
import NavigationBar from 'react-native-navbar'


class TravelerProfileInfoScreen extends Component {

  render() {
    var content
    let title = <Text style={[styles.titleText, {marginBottom: 4, color: Colors.darkGrey}]}>{this.props.travelerType}</Text>
    var leftButton =
    <TouchableOpacity
      onPress={() => this.props.navigator.pop()}
      style={styles.backButton}>
      <Image
        source={require('../assets/Nav-Back.png')}/>
     </TouchableOpacity>

    content =
    <ViewContainer backgroundColor='transparent'>
      <NavigationBar
        title={title}
        leftButton={leftButton}
        style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}} />
      <ScrollView style={{ padding: 20}}>
        <Text style={styles.infoText}>{this.props.profileInfo}</Text>
      </ScrollView>
    </ViewContainer>

    return content
  }


}

module.exports = TravelerProfileInfoScreen

const styles = StyleSheet.create({
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 18,
    color: Colors.beige,
    fontFamily: "ArchitectsDaughter"
  },
  infoText: {
    fontSize: 24,
    fontFamily: "ArchitectsDaughter",
  },
})
