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
import _ from 'underscore'

class Postcard extends Component {

  constructor(props) {
    super(props)

    this.state = {
      profileImages: ["","","","",""]
    }

    this.model = props.model
  }

  componentDidMount() {
    this.props.firebaseRef.child('userImages').once('value', (imageData) => {
      var profileImages = _.values(imageData.val())
      this.setState({
        profileImages: profileImages
      })
    }, (error) => {
      console.log(error)
    })
  }

  render() {
    var uris = _.map(this.state.profileImages, (imageData) => {
      return `data:image/jpeg;base64, ${imageData}`
    })

    let stampImage = null

    return (
      <View style={styles.container}>
        <Image
          style={styles.postcardBgImage}
          source={require('../assets/postcard-background.png')} />
        <View style={styles.content}>
          <View style={styles.locationContainer}>
            <Text style={{fontSize: 15}}>{this.model.name} was in:</Text>
            <Text style={styles.locationText}>{this.model.location}</Text>
          </View>
        </View>
        <View style={styles.descriptionWrapper}>
          <Text
            style={styles.descriptionText}
            numberOfLines={4}>{this.model.description}sthasoehtu sanhtu uoeanuthasonu hnah eunath ousnatho usnatoh usnae thousanoeu htsnou htesano uthsanu thaso h</Text>
        </View>
        <View style={styles.stampContainer}>
          <Image
            style={styles.stampBackground}
            source={require('../assets/stamp-background.png')} />
          <Image
            style={styles.stampImage}
            source={require('../assets/san-francisco.png')} />
        </View>
        <View style={styles.dateContainer}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>{this.model.date}</Text>
        </View>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={_ => this._viewTripDetails()}>
          <Text style={{textDecorationLine: 'underline', fontSize: 14}}>Trip Details</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _viewTripDetails() {
    this.props.navigator.push({
      ident: 'TripDetailsScreen',
      model: this.model
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
  content: {
    padding: cushion*2
  },
  locationContainer: {
    width: 190,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  locationText: {
    fontSize: 30,
    textAlign: 'center'
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
    top: 7,
    right: 8,
    width: 76,
    height: 77,
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
    backgroundColor: '#88adcc',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  descriptionWrapper: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    height: 100,
    width: 175
  },
  descriptionText: {
    height: 100,
    lineHeight: 25,
    fontSize: 15
  }
})
