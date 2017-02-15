import React, {
  Component,
  StyleSheet,
  Text,
  Image,
  View,
  ActivityIndicatorIOS,
  Dimensions
} from 'react-native'

import _ from 'underscore'
import Colors from '../styles/Colors'


var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height

class ProfileBackground extends Component {

  constructor(props) {
    super(props)
    this.state = {
      profileImages: ["","","","",""],
      image1layout: {height: 50, width: 50},
      image2layout: {height: 50, width: 50},
      image3layout: {height: 50, width: 50},
      image4layout: {height: 50, width: 50},
      image5layout: {height: 50, width: 50},
    }
  }

  componentDidMount() {
    if(this.props.uidToRender) {
      this.props.firebaseRef.child('userImages').child(this.props.uidToRender).once('value', (imageData) => {
        var profileImages = _.values(imageData.val())
        this.setState({
          profileImages: profileImages
        })
      }, (error) => {
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if(!_.isEmpty(nextProps.uidToRender) && _(this.props.uidToRender != nextProps.uidToRender)) {
      this.props.firebaseRef.child('userImages').child(nextProps.uidToRender).once('value', (imageData) => {
        var profileImages = _.values(imageData.val())
        this.setState({
          profileImages: profileImages
        })
      }, (error) => {
      })
    }
  }

  componentWillUnmount() {
    if(this.props.uidToRender)
      this.props.firebaseRef.child('userImages').child(this.props.uidToRender).off()
  }

  render() {
    var uris = _.map(this.state.profileImages, (imageData) => {
      return `data:image/jpeg;base64, ${imageData}`
    })
    var content =
    <View style={{position: 'absolute', height: deviceHeight - 48 - 66, top: 0, left: 0, width: deviceWidth}}>
      <View
        onLayout={(event) => this.setState({image1layout: event.nativeEvent.layout})}
        style={{flex: 1}}>
        <View style={[styles.activityBackground, {height: this.state.image1layout.height, width: this.state.image1layout.width}]}>
          <ActivityIndicatorIOS animating={true} />
        </View>
        <Image
          resizeMode='cover'
          style={[styles.imageBorder, {height: this.state.image1layout.height, width: this.state.image1layout.width}]}
          source={{uri: uris[0]}}/>
      </View>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View
          onLayout={(event) => this.setState({image2layout: event.nativeEvent.layout})}
          style={{flex: 3}}>
          <View style={[styles.activityBackground, {height: this.state.image2layout.height, width: this.state.image2layout.width}]}>
            <ActivityIndicatorIOS animating={true} />
          </View>
          <Image
            resizeMode='cover'
            style={[styles.imageBorder, {height: this.state.image2layout.height, width: this.state.image2layout.width}]}
            source={{uri: uris[1]}}/>
        </View>
        <View
          onLayout={(event) => this.setState({image3layout: event.nativeEvent.layout})}
          style={{flex: 4}}>
          <View style={[styles.activityBackground, {height: this.state.image3layout.height, width: this.state.image3layout.width}]}>
            <ActivityIndicatorIOS animating={true} />
          </View>
          <Image
            resizeMode='cover'
            style={[styles.imageBorder, {height: this.state.image3layout.height, width: this.state.image3layout.width}]}
            source={{uri: uris[2]}}/>
        </View>
      </View>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View
          onLayout={(event) => this.setState({image4layout: event.nativeEvent.layout})}
          style={{flex: 4}}>
          <View style={[styles.activityBackground, {height: this.state.image4layout.height, width: this.state.image4layout.width}]}>
            <ActivityIndicatorIOS animating={true} />
          </View>
          <Image
            resizeMode='cover'
            style={[styles.imageBorder, {height: this.state.image4layout.height, width: this.state.image4layout.width}]}
            source={{uri: uris[3]}}/>
        </View>
        <View
          onLayout={(event) => this.setState({image5layout: event.nativeEvent.layout})}
          style={{flex: 3}}>
          <View style={[styles.activityBackground, {height: this.state.image5layout.height, width: this.state.image5layout.width}]}>
            <ActivityIndicatorIOS animating={true} />
          </View>
          <Image
            resizeMode='cover'
            style={[styles.imageBorder, {height: this.state.image5layout.height, width: this.state.image5layout.width}]}
            source={{uri: uris[4]}}/>
        </View>
      </View>
      <View
        style={{position: 'absolute', top: 0, left: 0, height: deviceHeight - 48, width: deviceWidth, backgroundColor: 'rgba(0,0,0,0.4)'}}/>
    </View>
    return content
  }
}

const styles = StyleSheet.create({
  imageBorder: {
    borderWidth: 1,
    borderColor: Colors.beige
  },
  activityBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

module.exports = ProfileBackground
