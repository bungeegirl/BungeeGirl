
import React, {
  Component,
  StyleSheet,
  Text,
  Image,
  NativeModules,
  ScrollView,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  ActivityIndicatorIOS,
  ActionSheetIOS
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../styles/Colors'
import CameraRollView from '../components/CameraRollView'
import FacebookRollView from './FacebookRollView'
import moment from 'moment'
import _ from 'underscore'
var ImagePickerManager = require('NativeModules').ImagePickerManager

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height

class ImageRow extends Component {
  addImage() {
    var { asset, imageIndex, source } = this.props
    var profileImages = this.props.getProfileImages()
    if(this.props.pickerType !== 'facebook') {
      NativeModules.ReadImageData.readImage(asset.node.image.uri, (image) => {
        var profileImageClone = _.clone(profileImages)
        profileImageClone[imageIndex] = {uri: asset.node.image.uri, imageData: image}
        this.props.onFinishLoad(profileImageClone)
        this.props.onClose()
      })
    } else {
      NativeModules.Native.getBase64String(source, (err, base64) => {
        var profileImageClone = _.clone(profileImages)
        profileImageClone[imageIndex] = {uri: source, imageData: base64}
        this.props.onFinishLoad(profileImageClone)
        this.props.onClose()
      })
    }
  }

  render() {

    var {rowID, asset, index, profileImages, imageIndex, source, pickerType } = this.props
    let imageSize = deviceWidth / 4
    const imageSource = pickerType === 'facebook' ? {uri: source} : asset.node.image
    return (
      <TouchableOpacity
        onPress={() => this.addImage(this.props.imageIndex)}>
        <Image
          key={`asset.node.image.uri`}
          source={imageSource}
          style={{width: imageSize, height: imageSize}}/>
      </TouchableOpacity>
    )
  }
}

class CameraImagePicker extends Component {
  constructor() {
    super()
    var arr = [];

    for(var i=0;i<1000;i++) {
     arr[i] = [];
    }
    this.imageRefs = arr
  }

  render() {
    let imagePicker
    if(this.props.pickerType === 'facebook') {
      imagePicker =
      <FacebookRollView
        pickerType={this.props.pickerType}
        imagesPerRow={4}
        renderImage={(source, isFirst, rowID, index) => { return this._renderFacebookProfileImagePicker(source, rowID, index)}}
        albumId={this.props.albumId}/>
    } else {
      imagePicker =
      <CameraRollView
        imagesPerRow={4}
        renderImage={(asset, isFirst, rowID, index) => { return this._renderProfileImagePicker(asset, rowID, index)}} />
    }
    return (
      <View style={{flex: 1, backgroundColor:Colors.beige, marginTop: 20, paddingTop: 48, alignItems: 'stretch'}}>
        <TouchableOpacity
          onPress={() => this.props.onBack()}
          style={styles.closeButton}>
          <Icon
            size={48}
            name="md-close"
            color='black'/>
        </TouchableOpacity>
        <View style={{flex: 1, backgroundColor: Colors.beige}}>
          {imagePicker}
        </View>
      </View>
    )
  }

  _renderProfileImagePicker(asset, rowID, index) {
    var renderContext = this
    return (
    <ImageRow
      {...renderContext.props}
      key={`image${rowID}${index}`}
      getProfileImages={() => { return renderContext.props.profileImages}}
      ref={(component) => this.imageRefs[rowID][index] = component}
      asset={asset}
      rowID={rowID}
      index={index}/>
    )
  }

  _renderFacebookProfileImagePicker(source, rowID, index) {
    var renderContext = this
    return (
      <ImageRow
        {...renderContext.props}
        key={`image${rowID}${index}`}
        getProfileImages={() => { return renderContext.props.profileImages}}
        ref={(component) => this.imageRefs[rowID][index] = component}
        source={source}
        rowID={rowID}
        index={index}/>
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
  activityBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.beige
  },
  imageBorder: {
    borderWidth: 1,
    borderColor: Colors.beige
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 48,
    width: 48,
  }
})

module.exports = CameraImagePicker
