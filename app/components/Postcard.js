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
          <View>
            <View style={styles.headerContainer}>
              <Text>{this.model.name} was in: {this.model.location}</Text>
            </View>
            <View>
              <Text>{this.model.description}</Text>
            </View>
            <View style={styles.imageContainer}>
              <Image
                resizeMode='cover'
                style={styles.imageThumb}
                source={{uri: uris[0]}}/>
              <Image
                resizeMode='cover'
                style={styles.imageThumb}
                source={{uri: uris[1]}}/>
              <Image
                resizeMode='cover'
                style={styles.imageThumb}
                source={{uri: uris[2]}}/>
              <Image
                resizeMode='cover'
                style={styles.imageThumb}
                source={{uri: uris[3]}}/>
            </View>
          </View>
        </View>
        <View style={styles.stampContainer}>
          <Image
            stlye={styles.stampImage}
            source={require('../assets/stamp-background.png')} />
          <Image
            stlye={styles.stampImage}
            source={stampImage} />
        </View>
        <View style={styles.dateContainer}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>{this.model.date}</Text>
        </View>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => this}>
          <Text style={{textDecorationLine: 'underline', fontSize: 14}}>Trip Details</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

module.exports = Postcard

let cushion = 10,
  width = Dimensions.get('window').width - 50,
  dateWidth = 125,
  headerWidth = width - (cushion*2) - dateWidth,
  headerHeight = 45

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: width,
    margin: cushion/2,
    right: cushion,
    backgroundColor: Colors.fadedOrange,
    borderWidth: 1,
    borderColor: '#000'
  },
  postcardBgImage: {
    flex: 1,
    width: null,
    height: null
  },
  content: {
    padding: cushion
  },
  headerContainer: {
    width: headerWidth,
    height: headerHeight
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: cushion,
    marginLeft: 0
  },
  imageThumb: {
    height: 50,
    width: 50,
    marginRight: cushion,
    borderWidth: 1
  },
  stampContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 5
  },
  stampImage: {
    width: null,
    height: null,
  },
  dateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: dateWidth,
    height: headerHeight,
    backgroundColor: '#88adcc',
    borderWidth: 1,
    borderColor: '#000'
  },
  detailsButton: {
    position: 'absolute',
    right: cushion,
    bottom: cushion,
    backgroundColor: '#88adcc',
    padding: 5
  }
})
