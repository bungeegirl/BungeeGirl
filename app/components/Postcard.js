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

import _ from 'underscore'

class Postcard extends Component {

  constructor(props) {
    super(props)
    this.state = {
      profileImages: ["","","","",""]
    }
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
    return (
      <View style={styles.postcardContainer}>
        <View>
          <View style={styles.headerContainer}>
            <Text>{this.props.model.user.name} was in: {this.props.model.location}</Text>
          </View>
          <View>
            <Text>{this.props.model.description}</Text>
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
        <View style={styles.dateContainer}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>{this.props.model.date}</Text>
        </View>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => this}>
          <Text style={{textDecorationLine: 'underline', fontSize: 14}}>Trip Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.askButton}
          onPress={() => this}>
          <Text style={{textDecorationLine: 'underline', fontSize: 14}}>Ask {this.props.model.user.name} about her trip</Text>
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
  postcardContainer: {
    flex: 1,
    flexDirection: 'column',
    height: 200,
    width: width,
    padding: cushion,
    position: 'absolute',
    right: cushion,
    backgroundColor: '#ffe2b5',
    borderWidth: 1,
    borderColor: '#000'
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
  dateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    width: dateWidth,
    height: headerHeight,
    backgroundColor: '#88adcc',
    borderWidth: 1,
    borderColor: '#000'
  },
  detailsButton: {
    position: 'absolute',
    left: cushion,
    bottom: cushion,
    backgroundColor: '#88adcc',
    padding: 5
  },
  askButton: {
    position: 'absolute',
    right: cushion,
    bottom: cushion
  }
})
