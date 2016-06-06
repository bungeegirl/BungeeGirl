import React, {
  Component,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Dimensions,
  View,
  ListView,
} from 'react-native'

import ProfileBackground from './ProfileBackground'
import _ from 'underscore'
import Colors from '../styles/Colors'
import moment from 'moment'
import travelData from '../local_data/questions'

class UserProfile extends Component {
  render() {
    console.log(this.props)
    var uri = `data:image/jpeg;base64, ${this.props.userDisplayData.imageData}`
    var travelTypes = travelData.travelProfiles
    var profileTitle
    if(this.props.userDisplayData.travelType) {
      profileTitle = _.where(travelTypes, {ident: this.props.userDisplayData.travelType})[0]["title"]
    } else {
      profileTitle = ""
    }
    var age = moment().diff(moment({years: this.props.userDisplayData.year, months: this.props.userDisplayData.month, days: this.props.userDisplayData.days}), 'years')
    var content =
    <View style={{flex: 1}}>
      <ProfileBackground
        firebaseRef={this.props.firebaseRef}
        uidToRender={this.props.uidToRender} />
      <View style={[styles.container, {flex: 1}]}>
        <View style={[styles.inputContainer, {marginTop: -10}]}>
          <Text style={styles.formPretext}>I'm</Text>
          <Text style={styles.formPretext}>{this.props.userDisplayData.name}</Text>
        </View>
        <View style={[styles.inputContainer, {marginTop: -20}]}>
          <Text style={styles.formPretext}>{age} years old</Text>
        </View>
        <View style={[styles.inputContainer, {marginTop: -20}]}>
          <Text style={styles.formPretext}>from {this.props.userDisplayData.city}</Text>
        </View>
        <Image
          resizeMode='cover'
          source={{uri: uri}}
          style={styles.avatarImage}/>
        <Text style={[styles.formPretext, {marginTop: 10}]}>& I'm a {profileTitle}!</Text>
        <TextInput
          style={styles.bioContainer}
          maxLength={140}
          editable={false}
          value={this.props.userDisplayData.bio}
          multiline={true}/>
      </View>
    </View>

    return content
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
    color: Colors.beige,
    fontFamily: "SueEllenFrancisco"
  },
  container: {
    padding: 20,
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  formInput: {
    fontSize: 32,
    height: 74,
    color: Colors.beige,
    fontFamily: "SueEllenFrancisco"
  },
  formPretext: {
    fontSize: 32,
    marginRight: 8,
    color: Colors.beige,
    fontFamily: "SueEllenFrancisco"
  },
  bioContainer: {
    height: 150,
    fontSize: 18,
    color: Colors.beige,
    fontFamily: "SueEllenFrancisco",
  },
  inputContainer: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: "SueEllenFrancisco",
    color: 'white',
    fontSize: 21
  },
})

module.exports = UserProfile
