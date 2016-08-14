import React, {
  AppRegistry,
  ActivityIndicatorIOS,
  Component,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
  View,
  Picker,
  ListView,
} from 'react-native'

import Colors from '../styles/Colors'
import cityData from '../local_data/cityData'
import _ from 'underscore'

var deviceWidth = Dimensions.get('window').width

class ProfileCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userData: {},
    }
  }

  componentDidMount() {
    this._isMounted = true
    this.props.firebaseRef.child(`users/${this.props.userUid}`).once('value', (userData) => {
      if(this._isMounted)
        this.setState({ userData: userData.val() })
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    var content
    var image, button
    if(!_.isEmpty(this.state.userData)){
      var uri = `data:image/jpeg;base64, ${this.state.userData.imageData}`
      image =
      <Image
        resizeMode='cover'
        style={styles.avatar}
        source={{uri: uri}}/>
      button =
      <TouchableOpacity
        onPress={() => {
          this.props.navigator.push({
            ident: 'UserProfileScreen',
            uidToRender: this.props.userUid,
            userDisplayData: userData,
          })
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>Connect</Text>
        <View style={{flex: 1}} />
        <Image
          resizeMode='contain'
          source={require('../assets/selection-arrow.png')}
          style={{width: 48, height: 14, marginRight: 10}}/>
      </TouchableOpacity>
    } else {
      image =
      <ActivityIndicatorIOS
        style={styles.avatar}
        animating={_.isEmpty(this.state.userData)}/>
      button = <View />
    }
    let { userData } = this.state
    content =
    <View style={styles.cardContainer}>
      <Image
        resizeMode='cover'
        style={styles.imageBackground}
        source={this.props.city.backgroundAsset}>
        {image}
        <Text style={styles.nameText}>I'm {this.props.name}, a {this.props.travelType}</Text>
        <Text style={styles.bioText}>{this.props.bio}</Text>
        {button}
      </Image>
    </View>
    // } else {
    //   content =
    //   <View style={styles.cardContainer}>
    //     <View style={{backgroundColor: Colors.lightBlue, flex: 1, alignSelf: 'stretch', borderRadius: 2, alignItems: "center", justifyContent: 'center'}}>
    //       <ActivityIndicatorIOS
    //         style={{alignItems: 'center', justifyContent: 'center', height: 80}}
    //         animating={_.isEmpty(this.state.userData)}/>
    //     </View>
    //
    //   </View>
    // }

    return content
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    height: 280,
    borderRadius: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    width: deviceWidth,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  imageBackground: {
    height: 280,
    padding: 16,
    overflow: 'hidden',
    width: deviceWidth - 20
  },
  nameText: {
    color: Colors.beige,
    fontFamily: 'ArchitectsDaughter',
    fontSize: 24,
    marginTop: 20
  },
  bioText: {
    color: Colors.darkGrey,
    fontFamily: 'ArchitectsDaughter',
    fontSize: 18,
  },
  button: {
    position: 'absolute',
    flexDirection: 'row',
    width: 200,
    height: 50,
    left: 0,
    bottom: 30,
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: Colors.darkGrey,
  },
  buttonText: {
    color: "white",
    marginLeft: 28,
    fontSize: 24,
    fontFamily: "ArchitectsDaughter",
  },
})

module.exports = ProfileCard
