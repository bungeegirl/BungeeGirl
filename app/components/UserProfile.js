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
import cityData from '../local_data/cityData'
import Lightbox from 'react-native-lightbox'
import Icon from 'react-native-vector-icons/Ionicons'
import MIcon from 'react-native-vector-icons/MaterialIcons'


var deviceWidth = Dimensions.get('window').width

class UserProfile extends Component {
  constructor(props){
    super(props)
    this.state ={
      avatarWidth: 120,
      avatarHeight: 120,
      borderRadius: 60
    }
  }

  render() {
    var uri = `data:image/jpeg;base64, ${this.props.userDisplayData.imageData}`
    var travelTypes = travelData.travelProfiles
    var profileTitle
    if(this.props.userDisplayData.travelType) {
      profileTitle = _.where(travelTypes, {ident: this.props.userDisplayData.travelType})[0]["title"]
    } else {
      profileTitle = ""
    }
    var city = _.findWhere(cityData, {ident: this.props.userDisplayData.city})
    var verifiedLocation = this.props.userDisplayData.facebookLocation
    var age = moment().diff(moment({years: this.props.userDisplayData.year, months: this.props.userDisplayData.month, days: this.props.userDisplayData.days}), 'years')
    var content =
    <View style={{flex: 1}}>
      <ProfileBackground
        ref="ProfileBackground"
        firebaseRef={this.props.firebaseRef}
        uidToRender={this.props.uidToRender} />
      <View style={[styles.container, {flex: 1}]}>
        <View style={[styles.inputContainer, {marginTop: -10}]}>
          <Text style={styles.formPretext}>I'm</Text>
          <Text style={styles.formPretext}>{this.props.userDisplayData.name}</Text>
          {this.props.userDisplayData.gender == 'female' &&
            <Icon
              style={{width: 32, height: 32}}
              size={32}
              name='ios-female'
              color={Colors.green}/>}
          {this.props.userDisplayData.gender == 'male' &&
            <Icon
              style={{width: 32, height: 32}}
              size={32}
              name='ios-close-circle'
              color={Colors.red}/>}
        </View>
        <View style={[styles.inputContainer, {marginTop: -10}]}>
          <Text style={styles.formPretext}>{age} years old</Text>
        </View>
        <View style={[styles.inputContainer, {marginTop: -10}]}>
          { city && ( <Text style={styles.formPretext}>from {city.name}</Text> ) }
          <TouchableOpacity
            onPress={() => Alert.alert(`Verified from ${verifiedLocation}`)}>
          <MIcon
            size={32}
            color='white'
            name='location-on'/>
        </TouchableOpacity>
        </View>

        <Lightbox
          underlayColor={Colors.beige}
          backgroundColor={Colors.beige}
          onOpen={() => this.setState({avatarWidth: deviceWidth, avatarHeight: deviceWidth, borderRadius: deviceWidth/2})}
          onClose={() => this.setState({avatarWidth: 160, avatarHeight: 160, borderRadius: 160/2})}
          activeProps={{alignItems: 'center', justifyContent: 'center'}}>
          <Image
            resizeMode='cover'
            source={{uri: uri}}
            style={[styles.avatarImage, {width: this.state.avatarWidth, height: this.state.avatarHeight, borderRadius: this.state.borderRadius}]}/>
        </Lightbox>
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
    fontFamily: "ArchitectsDaughter"
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
    fontFamily: "ArchitectsDaughter"
  },
  formPretext: {
    fontSize: 24,
    marginRight: 8,
    color: Colors.beige,
    fontFamily: "ArchitectsDaughter"
  },
  bioContainer: {
    height: 150,
    fontSize: 18,
    color: Colors.beige,
    fontFamily: "ArchitectsDaughter",
  },
  inputContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: Colors.beige
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: "ArchitectsDaughter",
    color: 'white',
    fontSize: 21
  },
})

module.exports = UserProfile
