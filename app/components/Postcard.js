import React, {
  Component,
  StyleSheet,
  Text,
  Image,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native'

import Colors from '../styles/Colors'
import Lightbox from 'react-native-lightbox'
import _ from 'underscore'

var deviceWidth = Dimensions.get('window').width

class Postcard extends Component {

  constructor(props) {
    super(props)

    this.model = props.model
    this.state = {
      profileImages: ["","","","",""],
      ...props.model.val()
    }
  }

  componentDidMount() {
    this.props.firebaseRef.child(`trips/${this.props.model.key()}`).on('value', snap => {
      this.model = snap
      this.setState(snap.val())
    })
  }

  componentWillUnmount() {
    this.props.firebaseRef.child(`trips/${this.props.model.key()}`).off('value')
  }

  render() {
    let stampImage = null

    return (
      <View style={styles.container}>
        <Image
          style={styles.postcardBgImage}
          source={require('../assets/postcard-background.jpg')} />
        <View style={styles.locationContainer}>
          <Text style={[styles.text, styles.locationText]}>{this.state.location}</Text>
        </View>
        <View style={styles.descriptionWrapper}>
          <Text
            style={[styles.text, styles.descriptionText]}
            numberOfLines={4}>{this.state.description}</Text>
        </View>
        <View style={styles.stampContainer}>
          <Image
            style={styles.stampBackground}
            source={require('../assets/stamp-background.png')} />
          <Image
            style={styles.stampImage}
            source={{uri: `data:image/jpeg;base64, ${this.state.image0}`}} />
        </View>
        <View style={styles.dateContainer}>
          <Text style={[styles.text,{fontSize: 20}]}>{this.state.date}</Text>
        </View>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={_ => this._viewTripDetails()}>
          <Text style={[styles.text, {textDecorationLine: 'underline', fontSize: 14}]}>Trip Details</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _viewTripDetails() {
    this.props.navigator.push({
      ident: 'TripDetailsScreen',
      model: this.model,
    })
  }

}

module.exports = Postcard

let cushion = 10,
  postcardHeight = 225
  width = Dimensions.get('window').width - 50

const styles = StyleSheet.create({
  container: {
    height: postcardHeight,
    width: width,
    margin: cushion/2,
    right: cushion,
  },
  postcardBgImage: {
    position: 'absolute',
    height: postcardHeight,
    width: width,
    resizeMode: 'stretch',
    borderRadius: 10
  },
  text: {
    fontFamily: 'ArchitectsDaughter',
  },
  locationContainer: {
    position: 'absolute',
    top: 20,
    left: 6,
    width: 180,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  locationText: {
    fontSize: 40,
    textAlign: 'center',
    lineHeight: 45
  },
  stampContainer: {
    position: 'absolute',
    top: 15,
    right: 15
  },
  stampBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 90,
    resizeMode: 'stretch'
  },
  stampImage: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 73,
    height: 70,
    resizeMode: 'stretch'
  },
  dateContainer: {
    position: 'absolute',
    bottom: 60,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 40
  },
  detailsButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  descriptionWrapper: {
    position: 'absolute',
    left: 14,
    bottom: 11,
    height: 100,
    width: 170
  },
  descriptionText: {
    height: 100,
    lineHeight: 20,
    fontSize: 15
  }
})
