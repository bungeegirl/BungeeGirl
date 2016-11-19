import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
  View,
  ActivityIndicatorIOS,
  Picker,
  ListView,
} from 'react-native'

import Colors from '../styles/Colors'
import GiftedMessenger from '../../react-native-gifted-messenger'
import _ from 'underscore'
var ImagePickerManager = require('NativeModules').ImagePickerManager
import Icon from 'react-native-vector-icons/Ionicons'

var deviceWidth = Dimensions.get('window').width

const STATUS = {
  accepted: 'accepted',
  declined: 'declined',
  requested: 'requested'
}

class ChatContainer extends Component {

  constructor(props) {
    super(props)
    this._messages = []
    this.state = {
      messages: this._messages,
      typingMessage: '',
      loadingData: true,
      myVerificationState: null,
      herVerificationState: null,
      mySelfie: null,
      herSelfie: null,
      myVerifiedLoaded: false,
      herVerifiedLoaded: false,
    }
  }

  componentDidMount() {
    this.props.firebaseRef.child('chats').child(this.props.uid).child(this.props.userUid).child('messages').on('child_added', (child) => {
      const val = child.val()
      this.handleReceive({
        text: val.text,
        name: val.name,
        image: val.uid == this.props.uid && {uri: `data:image/jpeg;base64, ${this.props.userData.imageData}`} || {uri: `data:image/jpeg;base64, ${this.props.otherUserImage}`},
        position: val.uid == this.props.uid && 'right' || 'left',
        date: new Date(val.date),
        userData: val.userData,
        uniqueId: child.key(),
        uid: val.uid
      })
    })
    this.props.firebaseRef.child('chats').child(this.props.uid).child(this.props.userUid).child('verified').on('value', (verified) => {
      this.setState({
        myVerifiedLoaded: true,
        myVerificationState: verified.val()
      })
    })
    this.props.firebaseRef.child('chats').child(this.props.userUid).child(this.props.uid).child('verified').on('value', (verified) => {
      this.setState({
        herVerifiedLoaded: true,
        herVerificationState: verified.val()
      })
    })
    this.props.firebaseRef.child('chats').child(this.props.uid).child(this.props.userUid).child('selfie').on('value', (selfie) => {
      this.setState({mySelfie: selfie.val()})
    })
    this.props.firebaseRef.child('chats').child(this.props.userUid).child(this.props.uid).child('selfie').on('value', (selfie) => {
      this.setState({herSelfie: selfie.val()})
    })
  }

  componentWillUnmount() {
    this.props.firebaseRef.child('chats').child(this.props.uid).child(this.props.userUid).child('messages').off()
    this.props.firebaseRef.child('chats').child(this.props.userUid).child(this.props.uid).child('selfie').off()
    this.props.firebaseRef.child('chats').child(this.props.uid).child(this.props.userUid).child('selfie').off()
    this.props.firebaseRef.child('chats').child(this.props.userUid).child(this.props.uid).child('verified').off()
    this.props.firebaseRef.child('chats').child(this.props.uid).child(this.props.userUid).child('verified').off()
  }

  setMessages(messages) {
    this._messages = messages
    this.setState({messages: messages})
  }

  handleSend(message = {}){
    if(!this.state.myVerificationState) {
      this.requestSelfie(message)
    } else {
      switch (this.state.herVerificationState) {
        case STATUS.declined:
          Alert.alert('Oops sorry ' + this.props.userName + ' doesn’t feel like chatting')
          break;
        case STATUS.accepted:
          this.sendMessage(message)
          break;
        default:
          Alert.alert('Opps sorry ' + this.props.userName +  ' hasn’t responded to your request yet')
      }
    }
  }

  requestSelfie(message) {
    const renderContext = this
    Alert.alert(
      'Selfie Verification',
      ' Before we can get that message over to ' + this.props.userName +  ', we need you to take a quick step to confirm your identity. Send ' + this.props.userName +  ' a selfie so she knows it’s really you. Can we take this selfie now?',
      [
        {text: 'OK', onPress: () => renderContext.verifySelfie(message)},
        {text: 'Not Now', onPress: () => {}},
      ]
    )
  }

  verifySelfie(message) {
    ImagePickerManager.launchCamera({cameraType: 'front'}, (response) => {
      if(response.error) {
        Alert.alert(response.error)
      } else if(response){
        const requestText = 'You have a request from ' + this.props.userData.name
        this.setState({
          mySelfie: response.data
        })
        this.props.firebaseRef.child('chats').child(this.props.userUid).child(this.props.uid).update({
          lastMessage: requestText,
        })
        this.props.firebaseRef.child('chats').child(this.props.uid).child(this.props.userUid).update({
          verified: STATUS.requested,
          selfie: response.data
        })
        this.props.firebaseRef.child('chats').child(this.props.uid).child(this.props.userUid).child('messages').push({
          text: message.text,
          name: this.props.userData.name,
          uid: this.props.uid,
          userData: this.props.userData,
          date: new Date().getTime()
        })
        this.props.firebaseRef.child('chats').child(this.props.userUid).child(this.props.uid).child('messages').push({
          text: message.text,
          name: this.props.userData.name,
          uid: this.props.uid,
          userData: this.props.userData,
          date: new Date().getTime()
        })
        this.props.eventEmitter.emit('sendPushWithMessage', {uid: this.props.userUid, name: this.props.userData.name, text: requestText})
        // this.
        // send selfie to other userName
        // send message to other user/
        // send push to other user
        // send status to other user
        // send status to self
      }
    })
  }

  sendMessage(message = {}) {
    this.props.firebaseRef.child('chats').child(this.props.uid).child(this.props.userUid).child('messages').push({
      text: message.text,
      name: this.props.userData.name,
      uid: this.props.uid,
      userData: this.props.userData,
      date: new Date().getTime()
    })
    this.props.firebaseRef.child('chats').child(this.props.userUid).child(this.props.uid).update({
      lastMessage: message.text
    })
    this.props.firebaseRef.child('chats').child(this.props.userUid).child(this.props.uid).child('messages').push({
      text: message.text,
      name: this.props.userData.name,
      uid: this.props.uid,
      userData: this.props.userData,
      date: new Date().getTime()
    })
    this.props.eventEmitter.emit('sendPushWithMessage', {uid: this.props.userUid, name: this.props.userData.name, text: message.text})
  }

  handleReceive(message = {}) {
    this.setMessages(this._messages.concat(message))
    if(this.props.uid != message.uid) {
      this.props.firebaseRef.child('chats').child(this.props.userUid).child(this.props.uid).update({
        lastMessageSeen: message.text
      })
    }
  }

  render() {
    if(!this.state.herVerifiedLoaded || !this.state.myVerifiedLoaded) {
      return <ActivityIndicatorIOS animating={true}/>
    }
    let mySelfieHeight = 0
    let herSelfieHeight = 0
    let mySelfie = <View />
    let herSelfie = <View />
    let displayMessages = []
    if(this.state.herVerificationState !== STATUS.accepted) {
      if(this.state.mySelfie) {
        mySelfie = this.renderMySelfie()
        mySelfieHeight = mySelfieContainerHeight + 44
      }
    }
    if(this.state.myVerificationState !== STATUS.accepted) {
      if(this.state.herSelfie) {
        herSelfie = this.renderHerSelfie()
        herSelfieHeight = mySelfieContainerHeight + 44
      }
    }
    if(this.state.myVerificationState === STATUS.accepted && this.state.herVerificationState === STATUS.accepted) {
      displayMessages = this.state.messages
    }
    let content =
    <View>
      {mySelfie}
      {herSelfie}
      <GiftedMessenger
        styles={{
          bubbleRight: {
            marginLeft: 70,
            backgroundColor: Colors.blue,
          },
        }}
        onImagePress={(rowData) => { this._navigateToProfile(rowData) }}
        messages={displayMessages}
        handleSend={this.handleSend.bind(this)}
        maxHeight={Dimensions.get('window').height - 20 - 48 - mySelfieHeight - herSelfieHeight - 48}
      />
    </View>

    return content
  }

  renderMySelfie() {
    let text
    switch (this.state.herVerificationState) {
      case STATUS.accepted:
        text = this.props.userName + ' has accepted your chat request!'
        break;
      case STATUS.declined:
        text = this.props.userName + ' has declined your chat request'
        break
      default:
        text = 'We are still waiting for ' + this.props.userName + ' to approve your chat request'
    }
    return (
      <View
        style={styles.mySelfieContainer}>
        <Image
          resizeMode='contain'
          style={styles.mySelfie}
          source={{uri: `data:image/jpeg;base64, ${this.state.mySelfie}`}}/>
        <Text style={styles.approvalText} numberOfLines={2}>{text}</Text>
      </View>
    )
  }

  renderHerSelfie() {
    switch (this.state.myVerificationState) {
      case STATUS.declined:
        text = 'You declined her chat request'
        break;
      default:
        text = this.state.messages[0] && this.state.messages[0].text
    }
    return (
      <View
        style={styles.herSelfieContainer}>
        <Image
          resizeMode='contain'
          style={styles.mySelfie}
          source={{uri: `data:image/jpeg;base64, ${this.state.herSelfie}`}}/>
        <Text style={styles.approvalText} numberOfLines={2}>{text}</Text>
        <View style={styles.approvalButtonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.approveRequest.bind(this)}>
            <Icon
              size={48}
              name="ios-checkmark-circle"
              color='green'/>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.denyRequest.bind(this)}>
            <Icon
              size={48}
              name='ios-close-circle'
              color='red'/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  approveRequest() {
    if(!this.state.mySelfie) {
      const renderContext = this
      Alert.alert(
        'Selfie Verification',
        'Now its your turn to confirm your identity. Send ' + this.props.userName +  ' a selfie so she knows it’s really you',
        [
          {text: 'OK', onPress: () => renderContext.approveWithSelfie()},
          {text: 'Not Now', onPress: () => {}},
        ]
      )
    } else {
      this.approveRequest()
    }
  }

  approveWithSelfie() {
    const renderContext = this
    ImagePickerManager.launchCamera({cameraType: 'front'}, (response) => {
      if(response.error) {
        Alert.alert(response.error)
      } else if(response){
        this.setState({
          mySelfie: response.data
        })
        this.props.firebaseRef.child('chats').child(this.props.uid).child(this.props.userUid).update({
          selfie: response.data
        })
        renderContext.approveRequest()
      }
    })
  }

  approveRequest() {
    const requestText = this.props.userData.name + ' has approved your chat request!'
    this.props.firebaseRef.child('chats').child(this.props.userUid).child(this.props.uid).update({
      lastMessage: requestText,
    })
    this.props.firebaseRef.child('chats').child(this.props.uid).child(this.props.userUid).update({
      verified: STATUS.accepted,
    })
    this.props.eventEmitter.emit('sendPushWithMessage', {uid: this.props.userUid, name: this.props.userData.name, text: requestText})
  }

  denyRequest() {
    const renderContext = this
    Alert.alert(
      'Block user',
      'Are you sure you want to decline this chat request?',
      [
        {text: 'Block user', onPress: () => renderContext.confirmDenial()},
        {text: 'Nevermind', onPress: () => {}},
      ]
    )
  }

  confirmDenial() {
    const denyText = this.props.userData.name + ' has declined your chat request!'
    this.props.firebaseRef.child('chats').child(this.props.userUid).child(this.props.uid).update({
      lastMessage: denyText,
    })
    this.props.firebaseRef.child('chats').child(this.props.uid).child(this.props.userUid).update({
      verified: STATUS.declined,
    })
    this.props.eventEmitter.emit('sendPushWithMessage', {uid: this.props.userUid, name: this.props.userData.name, text: denyText})
  }

  _navigateToProfile(rowData) {
    this.props.navigator.push({
      ident: "UserProfileScreen",
      userDisplayData: rowData.userData,
      uidToRender: rowData.uid
    })
  }
}

const mySelfieContainerHeight = 200
const herSelfieContainerHeight = 200

const styles = StyleSheet.create({
  mySelfie: {
    width: 125,
    height: 125,
  },
  mySelfieContainer: {
    height: mySelfieContainerHeight,
    width: 200,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderColor: Colors.fadedGrey,
    borderWidth: 1,
  },
  herSelfieContainer: {
    height: herSelfieContainerHeight,
    width: 250,
    backgroundColor: 'transparent',
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10,
    borderColor: Colors.fadedGrey,
    borderWidth: 1,
  },
  approvalText: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: "ArchitectsDaughter",
  },
  approvalButtonsContainer: {
    flexDirection: 'row',
    padding: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  button: {
    height: 72,
    width: 72,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

module.exports = ChatContainer
