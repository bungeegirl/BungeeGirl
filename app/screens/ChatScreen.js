import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicatorIOS,
  View,
  Picker,
  ListView,
} from 'react-native'

import ViewContainer from '../components/ViewContainer'
import Colors from '../styles/Colors'
import NavigationBar from 'react-native-navbar'
import Chat from '../components/Chat'
import _ from 'underscore'

class ChatScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingData: true
    }
  }

  render() {
    let title = <Text style={[styles.titleText, {marginBottom: 4, color: Colors.darkGrey}]}>Chat With {this.props.userName}</Text>
    var leftButton =
    <TouchableOpacity
      onPress={() => this.props.navigator.pop()}
      style={styles.backButton}>
      <Image
        source={require('../assets/Nav-Back.png')}/>
     </TouchableOpacity>
    let content =
    <ViewContainer backgroundColor='transparent'>
      <NavigationBar
        leftButton={leftButton}
        title={title}
        style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}} />
      <Chat
        {...this.props}
        userUid={this.props.userUid}/>
    </ViewContainer>
    return content
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
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

module.exports = ChatScreen
