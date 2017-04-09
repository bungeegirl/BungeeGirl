import React, { Component } from 'react';
import { AppRegistry, ActivityIndicator, StyleSheet, Text, Alert, TouchableOpacity, TouchableHighlight, Image, Dimensions, View, Picker, ListView } from 'react-native';

import Colors from '../styles/Colors'
import cityData from '../local_data/cityData'
import _ from 'underscore'

var deviceWidth = Dimensions.get('window').width

class ProfileCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userData: {},
    }
  }

  componentDidMount() {
    this._isMounted = true
    this.props.firebaseRef.child(`users/${this.props.userUid}`).once('value', (userData) => {
      if(this._isMounted)
        this.setState({ userData: userData.val() })
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    var content
    var image
    let { userData } = this.state
    let loading = _.isEmpty(this.state.userData)
    let travelDispay = this.props.travelType.toLowerCase() === 'danger' ? 'danger junkie' : this.props.travelType
    if(!loading){
      var uri = `data:image/jpeg;base64, ${this.state.userData.imageData}`
      image =
      <Image
        resizeMode='cover'
        style={styles.avatar}
        source={{uri: uri}}/>
    } else {
      image =
      <ActivityIndicator
        style={styles.avatar}
        animating={true}/>
    }
      let button =
      <TouchableOpacity
        disabled={loading}
        onPress={() => {
          this.props.navigator.push({
            ident: 'UserProfileScreen',
            uidToRender: this.props.userUid,
            userDisplayData: userData,
          })
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>{ loading ? 'Loading...' : 'Connect' }</Text>
        <View style={{flex: 1}} />
        <Image
          resizeMode='contain'
          source={require('../assets/selection-arrow.png')}
          style={{width: 48, height: 14, marginRight: 10}}/>
      </TouchableOpacity>
    content =
    <View style={styles.cardContainer}>
      <Image
        resizeMode='cover'
        style={styles.imageBackground}
        source={this.props.city.backgroundAsset}>
        {image}
        <Text style={styles.nameText}>I'm {this.props.name}, a {travelDispay}</Text>
        { this.props.travelingTo &&  <Text style={[styles.bioText, {color: 'white'}]}>Traveling to: {this.props.travelingTo}</Text> }
        <Text style={styles.bioText}>{this.props.bio}</Text>
        {button}
      </Image>
    </View>

    return content
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    height: 280,
    borderRadius: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    width: deviceWidth,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  imageBackground: {
    height: 280,
    padding: 16,
    overflow: 'hidden',
    width: deviceWidth - 20
  },
  nameText: {
    color: Colors.beige,
    fontFamily: 'ArchitectsDaughter',
    fontSize: 24,
    marginTop: 20
  },
  bioText: {
    color: Colors.darkGrey,
    fontFamily: 'ArchitectsDaughter',
    fontSize: 14,
  },
  button: {
    opacity: 0.5,
    position: 'absolute',
    flexDirection: 'row',
    width: 150,
    height: 32,
    left: 0,
    bottom: 15,
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: Colors.darkGrey,
  },
  buttonText: {
    color: "white",
    marginLeft: 28,
    fontSize: 14,
    fontFamily: "ArchitectsDaughter",
  },
})

module.exports = ProfileCard
