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
  Picker,
  ListView,
} from 'react-native'

import Colors from '../styles/Colors'
import GiftedMessenger from '../../react-native-gifted-messenger'
import _ from 'underscore'
var ImagePickerManager = require('NativeModules').ImagePickerManager

var deviceWidth = Dimensions.get('window').width

class ChatContainer extends Component {

  constructor(props) {
    super(props)
    this._messages = []
    this.state = {
      messages: this._messages,
      typingMessage: '',
      loadingData: true
    }
  }

  componentDidMount() {
    this.props.firebaseRef.child('chats').child(this.props.uid).child(this.props.userUid).child('messages').on('child_added', (child) => {
      this.handleReceive({
        text: child.val().text,
        name: child.val().name,
        image: child.val().uid == this.props.uid && {uri: `data:image/jpeg;base64, ${this.props.userData.imageData}`} || {uri: `data:image/jpeg;base64, ${this.props.otherUserImage}`},
        position: child.val().uid == this.props.uid && 'right' || 'left',
        date: new Date(child.val().date),
        userData: child.val().userData,
        uniqueId: child.key(),
        uid: child.val().uid
      })
    })
  }

  componentWillUnmount() {
    this.props.firebaseRef.child('chats').child(this.props.uid).child(this.props.userUid).child('messages').off()
  }

  setMessages(messages) {
    this._messages = messages
    this.setState({messages: messages})
  }

  handleSend(message = {}){
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
    let content =
    <View >
    <GiftedMessenger
      styles={{
        bubbleRight: {
          marginLeft: 70,
          backgroundColor: Colors.blue,
        },
      }}
      onImagePress={(rowData) => { this._navigateToProfile(rowData) }}
      messages={this.state.messages}
      handleSend={this.handleSend.bind(this)}
      maxHeight={Dimensions.get('window').height - 20 - 48}
    />
    </View>

    return content
  }

  _navigateToProfile(rowData) {
    this.props.navigator.push({
      ident: "UserProfileScreen",
      userDisplayData: rowData.userData,
      uidToRender: rowData.uid
    })
  }

}

module.exports = ChatContainer
