import React, {
  Component,
  StyleSheet,
  Text,
  Image,
  TextInput,
  Alert,
  View,
  NativeModules,
  TouchableOpacity,
  Dimensions
} from 'react-native'

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height
import Colors from '../styles/Colors'
import moment from 'moment'
import CameraRollView from '../components/CameraRollView'



class AvatarPicker extends Component {
  componentDidMount() {
    Alert.alert("To make an awesome profile, we'll need to access your camera roll")
  }

  _renderImage(asset) {
    let imageSize = deviceWidth / 4
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onImageLoad()
          NativeModules.ReadImageData.readImage(asset.node.image.uri, (image) => {
            this.props.onImagePress(image)
          })}}>
        <Image
          key={`asset.node.image.uri`}
          source={asset.node.image}
          style={{width: imageSize, height: imageSize}}/>
      </TouchableOpacity>
    )
  }

  _renderPictureIcon() {
    var imageSize = deviceWidth / 4
    var options = {
      cameraType: 'back', // 'front' or 'back'

    }
    var content =
    <TouchableOpacity
      onPress={() =>   ImagePickerManager.launchCamera(options, (response)  => {
        this.props.onImagePress(response.data)
    })}>
      <Image
        style={{height: imageSize, width: imageSize}}
        resizeMode='contain'
        source={require('../assets/photo-placeholder.png')} />
    </TouchableOpacity>
    return content
  }

  render() {
    var age = moment().diff(moment({years: this.props.year, months: this.props.month, days: this.props.days}), 'years')
    var content =
    <View style={{flex: 1, alignItems: 'stretch'}}>
      <View style={styles.container}>
        { !this.props.excludeIntro &&
          <View>
            <View style={[styles.inputContainer, {marginTop: -10}]}>
              <Text style={styles.formPretext}>I'm</Text>
              <Text style={styles.formPretext}>{this.props.name}</Text>
            </View>
            <View style={[styles.inputContainer, {marginTop: -24}]}>
              <Text style={styles.formPretext}>{age} years old</Text>
            </View>
          </View>
        }
        <Text style={[styles.formLabel, {marginTop: 8, marginBottom: 8}]}>Let's put a face to the name</Text>
      </View>
      <View style={{flex: 1}}>
        <CameraRollView
          imagesPerRow={4}
          renderImage={(asset, isFirst) => {
            if(!isFirst) {
              return this._renderImage(asset)
            } else {
              return this._renderPictureIcon()
            }}} />
      </View>
    </View>
    return content
  }
}

module.exports = AvatarPicker

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  formLabel: {
    color: Colors.fadedGrey,
    fontFamily: "ArchitectsDaughter",
    fontSize: 18,
  },
  formInput: {
    fontSize: 32,
    fontFamily: "ArchitectsDaughter",
    height: 74,
  },
  inputContainer: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center'
  },
  formPretext: {
    fontSize: 32,
    fontFamily: "ArchitectsDaughter",
    marginRight: 8,
  },
})
