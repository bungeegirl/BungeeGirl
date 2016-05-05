
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

import ViewContainer from '../components/ViewContainer'
import Colors from '../styles/Colors'
import NavigationBar from 'react-native-navbar'

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height

class QuestionScreen extends Component {
  render() {
    var content =
    <ViewContainer backgroundColor={Colors.beige}>
      <NavigationBar
        style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}}
        title='Questionaire'/>
      <TouchableOpacity
        style={{height: 100, width: 300, justifyContent: 'center', alignItems: 'center', border: 1}}
        onPress={() => this.props.navigator.push({
          ident: "LoginScreen"
        })}>
        <Text>Back to login screen</Text>
      </TouchableOpacity>
    </ViewContainer>
    return content
  }
}

module.exports = QuestionScreen
