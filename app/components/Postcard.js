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
import Icon from 'react-native-vector-icons/FontAwesome'
import _ from 'underscore'

var deviceWidth = Dimensions.get('window').width

class Postcard extends Component {

  constructor(props) {
    super(props)

    this.trip = props.trip
    this.state = {
      liked: false,
      likes: 0,
      images: [],
      ...props.trip.val()
    }
  }

  componentDidMount() {
    this.tripLikesQuery = this.props.firebaseRef.child(`trips-likes/${this.trip.key()}`)
    this.tripLikesQuery.on('value', snap => {
      this.setState({
        likesCount: snap.numChildren(),
        liked: snap.child(this.props.uid).exists()
      })
    })
    this.trip.ref().on('value', snap => {
      this.trip = snap
      this.setState(snap.val())
    })
  }

  componentWillUnmount() {
    this.tripLikesQuery.off('value')
    this.trip.ref().off('value')
  }

  render() {
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
          <Lightbox
            renderContent={ _ => {
              return (
                <Image
                  resizeMode='contain'
                  style={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height
                  }}
                  source={{uri: `data:image/jpeg;base64, ${this.state.images[0]}`}} />
              )
            }}>
            <Image
              style={styles.stampImage}
              source={{uri: `data:image/jpeg;base64, ${this.state.images[0]}`}} />
          </Lightbox>
        </View>

        <View style={styles.dateContainer}>
          <Text style={[styles.text, {
            fontSize: 12
          }]}>Travel Date</Text>
          <Text style={[styles.text,{fontSize: 20, lineHeight: 20}]}>{this.state.date}</Text>
        </View>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={_ => this._viewTripDetails()}>
          <Text style={[styles.text, {textDecorationLine: 'underline', fontSize: 14}]}>Trip Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.likeBtn}
          onPress={this._like.bind(this)}>
          <Icon
            style={{color: Colors.red}}
            size={24}
            name={this.state.liked ? 'heart' : 'heart-o'} />
          <Text style={styles.likesCountText}>{this.state.likesCount}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _like() {
    let liked = this.state.liked
    this.setState({liked: !liked})

    let val = liked ? null : true
    this.props.firebaseRef.child(`trips-likes/${this.trip.key()}/${this.props.uid}`).set(val)
  }

  _viewTripDetails() {
    this.props.navigator.push({
      ident: 'TripDetailsScreen',
      trip: this.trip,
    })
  }

}

module.exports = Postcard

let cushion = 10,
  postcardHeight = 225
  width = Dimensions.get('window').width - 50,
  borderWidth = .5

const styles = StyleSheet.create({
  container: {
    height: postcardHeight,
    width: width,
    margin: cushion/2,
    right: cushion,
    borderWidth: borderWidth,
    borderRadius: 10,
  },
  postcardBgImage: {
    position: 'absolute',
    height: postcardHeight - borderWidth*2,
    width: width - borderWidth*2,
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
    fontFamily: 'Frijole',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 25
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
    resizeMode: 'cover'
  },
  dateContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 40
  },
  detailsButton: {
    position: 'absolute',
    right: 20,
    bottom: 50,
    padding: 5,
    backgroundColor: '#507bc0',
    borderRadius: 5
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
    fontFamily: 'Reenie Beanie',
    fontSize: 20
  },
  likeBtn: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  likesCountText: {
    margin: 5,
    fontSize: 20
  }
})
