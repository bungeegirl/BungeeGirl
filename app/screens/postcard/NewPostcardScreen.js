import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  ActionSheetIOS,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Dimensions,
  View,
  ScrollView,
  ListView,
} from 'react-native'

import ViewContainer from '../../components/ViewContainer'
import NavigationBar from 'react-native-navbar'
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from '../../styles/Colors'
import Icon from 'react-native-vector-icons/FontAwesome'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import _ from 'lodash'
import moment from 'moment'
// import ImageResizer from 'react-native-image-resizer'
import {
  Buffer
} from 'buffer'

import {
  Hoshi
} from 'react-native-textinput-effects'
import appRequest from '../../utils/fetch'

export default class NewPostcardScreen extends Component {

  constructor(props) {
    super(props)

    let value
    if(props.trip) {
      this.trip = props.trip
      value = this.trip.val()
    }

    this.state = {}
    _.extend(this.state, {
      savingData: false,
      userId: props.uid,
      name: props.userData.name,
      foods: [],
      activities: [],
      events: [],
      dos: [],
      donts: []
    }, value)
  }

  render() {
    return (
      <ViewContainer
        overlayColor='#0001'>
        <Spinner visible={this.state.savingData} textContent='Saving postcards...' />
        <NavigationBar
          title={<Text style={[styles.titleText, {marginBottom: 4, color: Colors.darkGrey}]}>Fill out your postcard:</Text>}
          leftButton={
            <TouchableOpacity
              style={[styles.backButton, {marginLeft: 8}]}
              onPress={() => this.props.navigator.pop()}>
              <Text style={[styles.buttonText, {color: Colors.black, fontSize: 14}]}>Cancel</Text>
            </TouchableOpacity>
          }
          rightButton={
            <TouchableOpacity
              style={[styles.backButton, {margin: 5}]}
              onPress={() => this._submit()}>
              <Text style={[styles.buttonText, {padding: 10, color: Colors.black, backgroundColor: Colors.fadedOrange, fontSize: 14}]}>Submit</Text>
            </TouchableOpacity>
          }
          statusBar={{
            tintColor: '#8db4dd',
            hidden: true
          }}
          style={{backgroundColor: '#8db4dd', marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}} />
        <ScrollView style={styles.mainContent}>
          <View style={styles.padding}>
            <Image
              style={styles.icon}
              resizeMode='contain'
              source={require('../../assets/location-pin.png')} />
            <Hoshi
              style={{flex: 1}}
              label='Where did you travel to?'
              labelStyle={{fontWeight: 'bold'}}
              borderColor='#8db4dd'
              onChangeText={location => this.setState({location})}
              value={this.state.location} />
          </View>

          <View style={styles.padding}>
            <Image
              style={styles.icon}
              resizeMode='contain'
              source={require('../../assets/calendar.png')} />
            <Hoshi
              style={{flex: 1}}
              label='When did you go?'
              labelStyle={{fontWeight: 'bold'}}
              borderColor='#8db4dd'
              onChangeText={date => this.setState({date})}
              value={this.state.date} />
          </View>

          <View style={styles.padding}>
            <View style={styles.col0}>
            </View>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <View style={{flex: 1}}>
                <Text style={{fontSize: 20}}>Share up to 4 of your best pics from this trip:</Text>
                <Text style={{fontSize: 15}}>First will appear as stamp image.</Text>
              </View>
              <View style={{flex: 1,flexDirection: 'row'}}>
                {this._buildImages()}
              </View>
            </View>
          </View>

          <View style={styles.padding}>
            <Image
              style={styles.icon}
              resizeMode='contain'
              source={require('../../assets/pencil.png')} />
            <Hoshi
              style={{flex: 1}}
              label='Say a few words about your trip'
              labelStyle={{fontWeight: 'bold'}}
              borderColor='#8db4dd'
              onChangeText={description => this.setState({description})}
              value={this.state.description} />
          </View>

          <View style={styles.padding}>
            <Image
              style={styles.icon}
              resizeMode='contain'
              source={require('../../assets/bed.png')} />
            <Hoshi
              style={{flex: 1}}
              label='Where did you stay?'
              labelStyle={{fontWeight: 'bold'}}
              borderColor='#8db4dd'
              onChangeText={stayedAt => this.setState({stayedAt})}
              value={this.state.stayedAt} />
          </View>

          <View style={{marginTop: 20}}>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={styles.icon}
                resizeMode='contain'
                source={require('../../assets/cutlery.png')} />
              <Text style={{
                marginLeft: 5,
                fontSize: 15,
                fontWeight: 'bold'
              }}>Where did you eat?</Text>
            </View>
            {this._buildInputs('foods', 'Food')}
          </View>

          <View style={{marginTop: 20}}>
            <View style={{flexDirection: 'row'}}>
              <MIcon
                size={32}
                style={styles.icon}
                name='directions-walk' />
              <Text style={{
                fontSize: 15,
                fontWeight: 'bold'
              }}>What activities did you participate in?</Text>
            </View>
            {this._buildInputs('activities', 'Activity')}
          </View>

          <View style={{marginTop: 20}}>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={styles.icon}
                resizeMode='contain'
                source={require('../../assets/ticket.png')} />
              <Text style={{
                fontSize: 15,
                fontWeight: 'bold'
              }}>What events did you attend?</Text>
            </View>
            {this._buildInputs('events', 'Event')}
          </View>

          <View style={{marginTop: 20}}>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={styles.icon}
                resizeMode='contain'
                source={require('../../assets/smile-face.png')} />
              <Text style={{
                fontSize: 15,
                fontWeight: 'bold'
              }}>Share your top Dos from this trip</Text>
            </View>
            {this._buildInputs('dos', 'Dos')}
          </View>

          <View style={{marginTop: 20}}>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={styles.icon}
                resizeMode='contain'
                source={require('../../assets/mehh-face.png')} />
              <Text style={{
                fontSize: 15,
                fontWeight: 'bold'
              }}>Share your top Don'ts from this trip</Text>
            </View>
            {this._buildInputs('donts', 'Don\'t')}
          </View>
        </ScrollView>
      </ViewContainer>
    )
  }

  _buildItems(key, contentFn) {
    let arr = []
    for(let i = 0; i < this.state[key].length+1; i++) {
      arr.push(
        <View key={`${key}-${i}`} style={[styles.row, {justifyContent: 'center'}]}>
          {contentFn(i)}
        </View>
      )
    }
    return arr
  }

  _buildImages() {
    let cameraImage = require('../../assets/camera.png')
    let images = []
    for(let i = 0; i < 4; i++) {
      let image = this.state[`image${i}`] ? {uri: this.state[`image${i}`]} : cameraImage
      images.push(
        <TouchableOpacity
          key={`image-${i}`}
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            margin: 5
          }}
          onPress={ _ => this._selectImage(i) }
          onLongPress={ _ => {
            let arr = this.state.images
            if(i === arr.length) return

            arr.splice(i,1)
            this.setState({images: arr})
          }}>
          <Image
            style={styles.userImage}
            source={image} />
        </TouchableOpacity>
      )
    }
    return images
  }
  _selectImage(i) {
    this.props.navigator.push({
      ident: 'CameraImagePicker',
      onBack: _ => this.props.navigator.pop(),
      onFinishLoad: (uri, image) => {
        let state = {}
        state[`image${i}`] = `data:image/jpeg;base64,${image}`
        this.setState(state)
      }
    })
  }

  _buildInputs(key, label) {
    return this._buildItems(key, i => {
      // NOTE: value prop needs `||''` at the end to assign blank text if it doesnt exist.
      // Only happens when removing text and an input is being deleted; Defaults to 1st
      // character(s) from initial typing of list. Not sure why.
      return (
        <Hoshi
          style={{flex: 1}}
          label={`${label} #${i+1}`}
          labelStyle={{fontWeight: 'bold'}}
          borderColor='#8db4dd'
          clearButtonMode='always'
          onChangeText={ val => {
            let arr = this.state[key], args = [i, 1]
            if(val) args.push(val)
            arr.splice.apply(arr,args)

            let state = {}
            state[key] = arr
            this.setState(state)
          }}
          value={this.state[key][i]||''} />
      )
    })
  }

  _submit() {
    this.setState({savingData: true})
    let hideSpinner = _ => this.setState({savingData: false})

    let skipKeys = [
      'savingData',
      'image0',
      'image1',
      'image2',
      'image3'
    ]
    let validProps = _.reduce(this.state, (props, val, key) => {
      if(!_.some(skipKeys, k => k === key))
        props[key] = val
      return props
    }, {})

    let postImages = (tripRef, val) => {
      let promises = []

      let imageRequest = index => {
        if(this.state[`image${index}`] === val[`image${index}`]) return

        promises.push(
          fetch('https://api.cloudinary.com/v1_1/bungee-girl/image/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              file: this.state[`image${index}`],
              upload_preset: 'bi5kbxa3'
            })
          }).then( response => response.json() ).then( response => {
            tripRef.child(`image${index}`).set(response.url)
          })
        )
      }

      imageRequest(0)
      imageRequest(1)
      imageRequest(2)
      imageRequest(3)

      return Promise.all(promises)
    }

    if(this.trip) {
      let trip = this.trip.val(), changed = {}
      _.each(validProps, (val, key) => {
        if(trip[key] !== val)
          changed[key] = val
      })
      this.trip.ref().update(changed).then( _ => {
        postImages(this.trip.ref(), this.trip.val()).then( _ => {
          hideSpinner()
          this.props.navigator.pop()
        })
      }).catch( err => {
        console.log(err)
      })
    } else {
      let newTrip = this.props.firebaseRef.child(`trips/${this.props.uid}`).push()
      newTrip.set(validProps).then( _ => {
        appRequest(`/notification/followers/${this.props.uid}`, {
          method: 'POST',
          body: JSON.stringify({
            message: `${this.props.userData.name} has added a new postcard!`,
            type: 'new postcard'
          })
        }).then( response => {
          postImages(newTrip,validProps).then( _ => {
            hideSpinner()
            this.props.navigator.pop()
          })
        })
      })
    }
  }

}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
    color: Colors.beige,
    fontFamily: "ArchitectsDaughter"
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    padding: 10
  },
  padding: {
    flexDirection:'row',
    padding: 5,
    alignItems: 'center'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column'
  },
  textInput: {
    flex: 1
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10
  },
  userImage: {
    width: 70,
    height: 70,
    borderRadius: 5
  }
})
