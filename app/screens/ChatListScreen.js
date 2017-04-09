import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, Alert, TouchableOpacity, Image, Dimensions, ActivityIndicator, View, Picker, ListView } from 'react-native';

import ViewContainer from '../components/ViewContainer'
import Colors from '../styles/Colors'
import NavigationBar from 'react-native-navbar'
import _ from 'underscore'
import cityData from '../local_data/cityData'


var deviceWidth = Dimensions.get('window').width

class ChatRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userData: {},
      loadingData: true
    }
  }

  componentDidMount() {
    this._isMounted = true
    this.props.firebaseRef.child(`users/${this.props.rowData[0]}`).once('value', (userData) => {
      if(this._isMounted)
        this.setState({ userData: userData.val(), loadingData: false })
    })
  }

  render() {
    var city = _.findWhere(cityData, {ident: this.state.userData.city})
    let content =
    <TouchableOpacity
      onPress={() => this.props.navigator.push({
        ident: "ChatScreen",
        userPushToken: this.state.userData.pushToken,
        userName: this.state.userData.name,
        otherUserImage: this.state.userData.imageData,
        userUid: this.props.rowData[0]
      })}
      style={{height: 64, width: deviceWidth, alignItems: 'center', flexDirection: 'row', borderBottomWidth: 0.5, borderColor: 'grey'}}>
      { this.state.loadingData && <Text style={styles.titleText}>"..."</Text>}
      { !this.state.loadingData &&
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Image
            resizeMode='cover'
            style={[styles.avatar, {marginLeft: 10}]}
            source={{uri: `data:image/jpeg;base64, ${this.state.userData.imageData}`}}/>
          <View style={{flex: 1, height: 54, justifyContent: 'center'}}>
            <Text style={[styles.titleText, {marginLeft: 10, color: Colors.darkGrey, fontWeight: '500' }]}>{this.state.userData.name} from {city.name}</Text>
            <Text
              numberOfLines={1}
              style={[styles.titleText, {marginLeft: 10, color: Colors.darkGrey, fontWeight: '400' }]}>{this.props.rowData[1].lastMessage}</Text>
          </View>
        </View>
      }
    </TouchableOpacity>

    return content
  }

}

class ChatListScreen extends Component {

  constructor(props) {
    super(props)
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows([]),
      loadingData: true
    }
  }

  componentDidMount() {
    this.props.firebaseRef.child('chats').child(this.props.uid).on('value', (chatData) => { this._syncMessages(chatData.val()) })
  }

  render() {
    let title = <Text style={[styles.titleText, {marginBottom: 4, color: Colors.darkGrey}]}>Connections</Text>
    let content =
    <ViewContainer>
      <NavigationBar
        title={title}
        style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}} />
      { this.state.loadingData &&
        <ActivityIndicator
          style={{alignItems: 'center', justifyContent: 'center', height: 80}}
          animating={this.state.loadingData}/> }
      { !this.state.loadingData &&
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this._renderRow(rowData)}/>}
    </ViewContainer>
    return content
  }

  _renderRow(rowData) {
    var row =
    <ChatRow
      {...this.props}
      rowData={rowData}/>

    return row
  }

  _syncMessages(chatData) {
    this.setState({loadingData: false, dataSource: this.state.dataSource.cloneWithRows(_.pairs(chatData))})
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
    color: Colors.beige,
    fontFamily: "ArchitectsDaughter"
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
})

module.exports = ChatListScreen
