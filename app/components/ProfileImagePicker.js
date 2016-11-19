
import React, {
  Component,
  StyleSheet,
  Text,
  Image,
  TextInput,
  NativeModules,
  ScrollView,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  ActivityIndicatorIOS,
  ActionSheetIOS
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../styles/Colors'
import _ from 'underscore'
import CameraImagePicker from './CameraImagePicker'
import FacebookAlbumList from './FacebookAlbumList'
var ImagePickerManager = require('NativeModules').ImagePickerManager

class ProfileImagePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageIndex: 0,
      image1layout: {height: 50, width: 50},
      image2layout: {height: 50, width: 50},
      image3layout: {height: 50, width: 50},
      image4layout: {height: 50, width: 50},
      image5layout: {height: 50, width: 50},
      modalVisible: false
    }
  }

  render() {
    var {year, month, days, name, profileImages } = this.props
    var modalView
    if(this.state.selection === 'camera') {
      modalView =
      <CameraImagePicker
        {...this.props}
        imageIndex={this.state.imageIndex}
        profileImages={this.props.profileImages}
        onBack={() => this.setState({modalVisible: false})}
        onClose={() => this.setState({modalVisible: false})}/>
    } else if (this.state.selection === 'facebook') {
      modalView =
      <FacebookAlbumList
        {...this.props}
        onSelectAlbum={(id) => this.setState({selection: 'facebookAlbum', albumId: id})}
        onClose={() => this.setState({selection: false})}
        imageIndex={this.state.imageIndex}/>
    } else if (this.state.selection === 'facebookAlbum') {
      modalView =
      <CameraImagePicker
        {...this.props}
        imageIndex={this.state.imageIndex}
        profileImages={this.props.profileImages}
        pickerType='facebook'
        albumId={this.state.albumId}
        onBack={() => this.setState({selection: 'facebook'})}
        onClose={() => this.setState({modalVisible: false})}/>
    }
    var content =
    <View style={{flex: 1, alignItems: 'stretch'}}>
      <View style={styles.container}>
        <Text style={[styles.formLabel, {marginTop: 8, marginBottom: 8}]}>Share five of your best travel pics</Text>
      </View>
      <View style={{flex: 1}}>
        {this._renderImageBoxes()}
      </View>
      <Modal
         animationType={"slide"}
         transparent={true}
         visible={this.state.modalVisible}
         onRequestClose={() => {alert("Modal has been closed.")}}>
         {modalView}
      </Modal>
    </View>
    return content
  }

  _renderImageBoxes(){
    var profileImages = this.props.profileImages
    var uris = ["","","","",""]
    const addIcon =
    <Icon
      size={48}
      name="md-camera"
      color='black'/>
    const deleteIcon =
    <Icon
      size={20}
      name='md-close'
      color='red'/>
    return (
      <View style={{backgroundColor: Colors.beige, flex: 1}}>
        <View
          onLayout={(event) => this.setState({image1layout: event.nativeEvent.layout})}
          style={{flex: 1}}>
          <TouchableOpacity
            onPress={() => this._pickImageSource(0)}
            style={[styles.activityBackground, {height: this.state.image1layout.height, width: this.state.image1layout.width}]}>
            {addIcon}
          </TouchableOpacity>
          {profileImages[0] && (
            <Image
              resizeMode='cover'
              style={[styles.imageBorder, {height: this.state.image1layout.height, width: this.state.image1layout.width}]}
              source={{uri: profileImages[0].uri}}>
              <TouchableOpacity
                onPress={() => this._deselectImage(0)}
                style={styles.deselect}>
                <View style={styles.deselectContainer}>
                  {deleteIcon}
                </View>
              </TouchableOpacity>
            </Image>)}
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View
            onLayout={(event) => this.setState({image2layout: event.nativeEvent.layout})}
            style={{flex: 3}}>
            <TouchableOpacity
              onPress={() => this._pickImageSource(1)}
              style={[styles.activityBackground, {height: this.state.image2layout.height, width: this.state.image2layout.width}]}>
              {addIcon}
            </TouchableOpacity>
            {profileImages[1] && (
              <Image
              resizeMode='cover'
              style={[styles.imageBorder, {height: this.state.image2layout.height, width: this.state.image2layout.width}]}
              source={{uri: profileImages[1].uri}}>
              <TouchableOpacity
                onPress={() => this._deselectImage(1)}
                style={styles.deselect}>
                <View style={styles.deselectContainer}>
                  {deleteIcon}
                </View>
              </TouchableOpacity>
              </Image>)}
          </View>
          <View
            onLayout={(event) => this.setState({image3layout: event.nativeEvent.layout})}
            style={{flex: 4}}>
            <TouchableOpacity
              onPress={() => this._pickImageSource(2)}
              style={[styles.activityBackground, {height: this.state.image3layout.height, width: this.state.image3layout.width}]}>
              {addIcon}
            </TouchableOpacity>
            {profileImages[2] && (
              <Image
                resizeMode='cover'
                style={[styles.imageBorder, {height: this.state.image3layout.height, width: this.state.image3layout.width}]}
                source={{uri: profileImages[2].uri}}>
                <TouchableOpacity
                  onPress={() => this._deselectImage(2)}
                  style={styles.deselect}>
                  <View style={styles.deselectContainer}>
                    {deleteIcon}
                  </View>
                </TouchableOpacity>
              </Image>)}
          </View>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View
            onLayout={(event) => this.setState({image4layout: event.nativeEvent.layout})}
            style={{flex: 4}}>
            <TouchableOpacity
              onPress={() => this._pickImageSource(3)}
              style={[styles.activityBackground, {height: this.state.image4layout.height, width: this.state.image4layout.width}]}>
              {addIcon}
            </TouchableOpacity>
            {profileImages[3] && (
              <Image
                resizeMode='cover'
                style={[styles.imageBorder, {height: this.state.image4layout.height, width: this.state.image4layout.width}]}
                source={{uri: profileImages[3].uri}}>
                <TouchableOpacity
                  onPress={() => this._deselectImage(3)}
                  style={styles.deselect}>
                  <View style={styles.deselectContainer}>
                    {deleteIcon}
                  </View>
                </TouchableOpacity>
              </Image>)}
          </View>
          <View
            onLayout={(event) => this.setState({image5layout: event.nativeEvent.layout})}
            style={{flex: 3}}>
            <TouchableOpacity
              onPress={() => this._pickImageSource(4)}
              style={[styles.activityBackground, {height: this.state.image5layout.height, width: this.state.image5layout.width}]}>
              {addIcon}
            </TouchableOpacity>
            {profileImages[4] && (
              <Image
                resizeMode='cover'
                style={[styles.imageBorder, {height: this.state.image5layout.height, width: this.state.image5layout.width}]}
                source={{uri: profileImages[4].uri}}>
                <TouchableOpacity
                  onPress={() => this._deselectImage(4)}
                  style={styles.deselect}>
                  <View style={styles.deselectContainer}>
                    {deleteIcon}
                  </View>
                </TouchableOpacity>
              </Image>)}
          </View>
        </View>
      </View>
    )
  }

  _deselectImage(index) {
    var profileImageClone = _.clone(this.props.profileImages)
    profileImageClone[index] = undefined
    this.props.deSelectImage(profileImageClone)
  }

  _pickImageSource(index){
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Camera Roll', 'Facebook', 'Cancel'],
      cancelButtonIndex: 2,
    },
    (buttonIndex) => {
      if(buttonIndex != 2) {
        const selection = buttonIndex === 0 ? 'camera' : 'facebook'
        this.setState({
          modalVisible: true,
          imageIndex: index,
          selection
        })
      }
    });
  }
}

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
  activityBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'grey'
  },
  imageBorder: {
    borderWidth: 1,
    borderColor: 'grey',
    overflow: 'hidden'
  },
  deselect: {
    position: 'absolute',
    height: 32,
    width: 32,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent'
  },
  deselectContainer: {
    height: 32,
    width: 32,
    backgroundColor: Colors.beige,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

module.exports = ProfileImagePicker
