
import React, {
  Component,
  StyleSheet,
  Text,
  Image,
  TextInput,
  NativeModules,
  ScrollView,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../styles/Colors'
import CameraRollView from '../components/CameraRollView'
import moment from 'moment'
import _ from 'underscore'
import Spinner from 'react-native-loading-spinner-overlay';
var ImagePickerManager = require('NativeModules').ImagePickerManager

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height

class ProfileImagePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      profileImages: []
    }
  }

  render() {
    var {year, month, days, name } = this.props
    var age = moment().diff(moment({years: year, months: month, days: days}), 'years')
    var content =
    <View style={{flex: 1, alignItems: 'stretch'}}>
      <View style={styles.container}>
        <View style={[styles.inputContainer, {marginTop: -10}]}>
          <Text style={styles.formPretext}>{`I'm`}</Text>
          <Text style={styles.formPretext}>{name}</Text>
        </View>
        <View style={[styles.inputContainer, {marginTop: -24}]}>
          <Text style={styles.formPretext}>{age} years old</Text>
        </View>
        <Text style={[styles.formLabel, {marginTop: 8, marginBottom: 8}]}>Share five of your best travel pics</Text>
      </View>
      <View style={{flex: 1}}>
        <CameraRollView
          imagesPerRow={4}
          renderImage={(asset, isFirst) => { return this._renderProfileImagePicker(asset)}} />
      </View>
    </View>
    return content
  }

  _renderProfileImagePicker(asset) {
    let imageSize = deviceWidth / 4
    var profileImages = _.clone(this.state.profileImages)
    let selected = _.contains(_.pluck(profileImages, 'uri'), asset.node.image.uri)
    var addImage = () => {
      this.props.onDataLoad()
      NativeModules.ReadImageData.readImage(asset.node.image.uri, (image) => {
        profileImages.push({uri: asset.node.image.uri, imageData: image})
        if(profileImages.length == 5) {
          this.props.onFinishPicking(profileImages)
        } else {
          this.props.onFinishLoad()
          this.setState({profileImages: profileImages})
        }
      })
    }
    var unselectImage = () => {
      var newImages = _.reject(profileImages, (imageObject) => {
        return imageObject.uri == asset.node.image.uri
      })
      this.setState({profileImages: newImages})
    }
    var selectionFuction
    var checkMark
    if(selected) {
      selectionFuction = unselectImage
      checkMark =
      <View style={[styles.checkMarkContainer, {width: imageSize, height: imageSize}]}>
        <Icon
          size={48}
          name="md-checkbox"
          color='white'/>
      </View>
    } else {
      selectionFuction = addImage
      checkMark = <View />
    }

    return (
      <TouchableOpacity
        onPress={() => selectionFuction()}>
        <Image
          key={`asset.node.image.uri`}
          source={asset.node.image}
          style={{width: imageSize, height: imageSize}}/>
        {checkMark}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  checkMarkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formPretext: {
    fontSize: 32,
    fontFamily: "ArchitectsDaughter",
    marginRight: 8,
  },
  inputContainer: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center'
  },
  formLabel: {
    color: Colors.fadedGrey,
    fontFamily: "ArchitectsDaughter",
    fontSize: 18,
  },

})

module.exports = ProfileImagePicker
