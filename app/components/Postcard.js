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

    this.model = props.model
    this.state = {
      liked: false,
      likes: 0,
      images: [],
      ...props.model.val()
    }
  }

  componentDidMount() {
    this.model.ref().child('likes').on('value', snap => {
      this.setState({
        likesCount: snap.numChildren(),
        liked: snap.child(this.props.uid).exists()
      })
    })
    this.model.ref().on('value', snap => {
      this.model = snap
      this.setState(snap.val())
    })
  }

  componentWillUnmount() {
    this.model.ref().off('value')
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
          <Text style={[styles.text,{fontSize: 20}]}>{this.state.date}</Text>
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
            size={32}
            name={this.state.liked ? 'thumbs-up' : 'thumbs-o-up'} />
          <Text>Liked by {this.state.likesCount} other{this.state.likesCount > 1 ? 's' : ''}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _like() {
    let liked = this.state.liked
    this.setState({liked: !liked})

    let ref = this.model.ref().child(`likes/${this.props.uid}`)
    liked ? ref.remove() : ref.set(true)
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
    resizeMode: 'cover'
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
