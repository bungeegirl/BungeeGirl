import React, { Component } from 'react';
import { StyleSheet, Text, Image, TextInput, Alert, View, Modal, ActionSheetIOS, NativeModules, TouchableOpacity, Dimensions } from 'react-native';

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height
import Colors from '../styles/Colors'
import moment from 'moment'
import CameraRollView from '../components/CameraRollView'
import CameraImagePicker from '../components/CameraImagePicker'
import FacebookAlbumList from '../components/FacebookAlbumList'
var ImagePickerManager = require('NativeModules').ImagePickerManager


class AvatarPicker extends Component {
  constructor() {
    super()
    this.state = {
      modalVisible: false,
      selection: null
    }
  }

  componentDidMount() {
    // this.askSelection()
  }

  askSelection() {
    ActionSheetIOS.showActionSheetWithOptions({
      message: 'Where should we grab your profile pic?',
      options: ['Camera Roll', 'Facebook'],
    },
    (buttonIndex) => {
      const selection = buttonIndex === 0 ? 'camera' : 'facebook'
      this.setState({
        modalVisible: true,
        selection
      })
    });
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
      onPress={() => ImagePickerManager.launchCamera(options, (response)  => {
        if(response.error) {
          Alert.alert(response.error)
        } else {
          response && this.props.onImagePress(response.data)
        }
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
    var modalView
    if(this.state.selection === 'camera') {
      modalView =
      <View style={{flex: 1, marginTop:170}}>
      <CameraRollView
        imagesPerRow={4}
        renderImage={(asset, isFirst) => {
          if(!isFirst) {
            return this._renderImage(asset)
          } else {
            return this._renderPictureIcon()
          }}} />
      </View>
      } else if (this.state.selection === 'facebook') {
        modalView =
        <FacebookAlbumList
          {...this.props}
          onSelectAlbum={(id) => this.setState({selection: 'facebookAlbum', albumId: id})}
          onClose={() => this.setState({selection: false})}/>
      } else if (this.state.selection === 'facebookAlbum') {
        modalView =
        <CameraImagePicker
          profileImages={[""]}
          imageIndex={0}
          pickerType='facebook'
          onFinishLoad={(images) => {
            this.props.onImageLoad()
            this.props.onImagePress(images[0].imageData)
          }}
          albumId={this.state.albumId}
          onBack={() => this.setState({selection: 'facebook'})}
          onClose={() => {
            this.setState({modalVisible: false, selection: false})
          }}/>
      } else {
        this.askSelection()
      }
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
        <Modal
           animationType={"slide"}
           transparent={true}
           visible={this.state.modalVisible}
           onRequestClose={() => {alert("Modal has been closed.")}}>
           {modalView}
        </Modal>
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
