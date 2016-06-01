import React, {
  AppRegistry,
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

import ViewContainer from '../components/ViewContainer'
import Colors from '../styles/Colors'
import travelData from '../local_data/questions'
import _ from 'underscore'
import moment from 'moment'

var FBLoginManager = require('NativeModules').FBLoginManager

class HomeScreen extends Component {
  render() {
    var uri = `data:image/jpeg;base64, ${this.props.userData.imageData}`
    var travelTypes = travelData.travelProfiles
    var profileTitle
    if(this.props.userData.travelType) {
      profileTitle = _.where(travelTypes, {ident: this.props.userData.travelType})[0]["title"]
    } else {
      profileTitle = ""
    }
    var age = moment().diff(moment({years: this.props.userData.year, months: this.props.userData.month, days: this.props.userData.days}), 'years')
    var content =
    <ViewContainer backgroundColor='transparent'>
      <View style={[styles.container, {flex: 1}]}>
        <View style={[styles.inputContainer, {marginTop: -10}]}>
          <Text style={styles.formPretext}>I'm</Text>
          <Text style={styles.formPretext}>{this.props.userData.name}</Text>
        </View>
        <View style={[styles.inputContainer, {marginTop: -20}]}>
          <Text style={styles.formPretext}>{age} years old</Text>
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
          value={this.props.userData.bio}
          multiline={true}/>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => this._logout()}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </ViewContainer>
    return content
  }

  _logout() {
    AsyncStorage.clear()
    FBLoginManager.logout(() => {})
    this.props.navigator.resetTo({
      ident: "LoginScreen"
    })
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
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
    fontFamily: "SueEllenFrancisco"
  },
  formPretext: {
    fontSize: 32,
    marginRight: 8,
    fontFamily: "SueEllenFrancisco"
  },
  bioContainer: {
    height: 150,
    fontSize: 18,
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
  logoutButton: {
    height: 48,
    width: 150,
    marginBottom: 50,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: "SueEllenFrancisco",
    color: 'white',
    fontSize: 21
  },
})

module.exports = HomeScreen
