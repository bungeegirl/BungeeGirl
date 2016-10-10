
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

class ImageRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: false
    }
  }

  addImage() {
    this.props.onDataLoad()
    var { asset } = this.props
    var profileImages = this.props.getProfileImages()
    NativeModules.ReadImageData.readImage(asset.node.image.uri, (image) => {
      var profileImageClone = _.clone(profileImages)
      profileImageClone.push({uri: asset.node.image.uri, imageData: image})
      if(profileImageClone.length == 5) {
        this.props.onFinishPicking(profileImageClone)
      } else {
        this.props.onFinishLoad(profileImageClone)
        this.setState({selected: true})
      }
    })
  }

  unselectImage() {
    var profileImageClone = _.clone(this.props.profileImages)
    var { asset } = this.props
    var newImages = _.reject(profileImageClone, (imageObject) => {
      return imageObject.uri == asset.node.image.uri
    })
    this.props.deSelectImage(newImages)
    this.setState({selected: false})
  }
  render() {

    var {rowID, asset, index, profileImages } = this.props
    let imageSize = deviceWidth / 4
    var selectionFuction
    var checkMark
    if(this.state.selected) {
      selectionFuction = () => this.unselectImage()
      checkMark =
      <View style={[styles.checkMarkContainer, {width: imageSize, height: imageSize}]}>
        <Icon
          size={48}
          name="md-checkbox"
          color='white'/>
      </View>
    } else {
      selectionFuction = () => this.addImage()
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

class ProfileImagePicker extends Component {
  constructor(props) {
    super(props)
    var arr = [];

    for (var i=0;i<1000;i++) {
     arr[i] = [];
    }
    this.imageRefs = arr
  }

  render() {
    var {year, month, days, name, profileImages } = this.props
    var age = moment().diff(moment({years: year, months: month, days: days}), 'years')
    var intro
    var content =
    <View style={{flex: 1, alignItems: 'stretch'}}>
      <View style={styles.container}>
        { !this.props.excludeIntro &&
          <View>
            <View style={[styles.inputContainer, {marginTop: -10}]}>
              <Text style={styles.formPretext}>{`I'm`}</Text>
              <Text style={styles.formPretext}>{name}</Text>
            </View>
            <View style={[styles.inputContainer, {marginTop: -24}]}>
              <Text style={styles.formPretext}>{age} years old</Text>
            </View>
          </View>
        }
        <Text style={[styles.formLabel, {marginTop: 8, marginBottom: 8}]}>Share five of your best travel pics</Text>
      </View>
      <View style={{flex: 1}}>
        <CameraRollView
          ref="CameraRoll"
          imagesPerRow={4}
          renderImage={(asset, isFirst, rowID, index) => { return this._renderProfileImagePicker(asset, rowID, index)}} />
      </View>
    </View>
    return content
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
