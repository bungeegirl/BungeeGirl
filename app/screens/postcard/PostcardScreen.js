import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  ActionSheetIOS,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Dimensions,
  View,
  ListView,
} from 'react-native'

import ViewContainer from '../../components/ViewContainer'
import Postcard from '../../components/Postcard'
import NavigationBar from 'react-native-navbar'
import Colors from '../../styles/Colors'
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/Ionicons'
import _ from 'underscore'
import moment from 'moment'

class PostcardScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loadingData: false
    }
  }

  render() {
    var title = <Text style={[styles.titleText, {marginBottom: 4, color: Colors.darkGrey}]}>My Postcards</Text>
    var leftButton =
      <TouchableOpacity
        style={[styles.backButton, {marginLeft: 8}]}
        onPress={() => this._follow()}>
        <Text style={[styles.buttonText, {color: Colors.blue, fontSize: 14}]}>Follow</Text>
      </TouchableOpacity>
    var rightButton =
      <TouchableOpacity
        style={[styles.backButton, {marginRight: 8}]}
        onPress={() => this}>
        <Text style={[styles.buttonText, {color: Colors.red, fontSize: 14}]}></Text>
      </TouchableOpacity>
    var content =
      <View>
        <View
          style={styles.header}>
          <Image
            source={{uri: `data:image/jpeg;base64, ${this.props.userData.imageData}`}}
            style={styles.avatarImage}/>
          <Text style={styles.headerText}>{`(8)\nTrips`}</Text>
          <Text style={styles.headerText}>{`(109)\nFollowers`}</Text>
          <TouchableOpacity
            style={[styles.headerText,{position: 'absolute', right: 10, alignItems: 'center'}]}
            onPress={() => {
              this.props.navigator.push({
                ident: 'NewPostcardScreen'
              })
            }}>
            <Text style={{fontSize: 14}}>Create Postcard</Text>
            <Icon
              style={{height: 36, width: 36}}
              name='ios-person-outline'
              size={40}
              color={Colors.darkGrey}/>
          </TouchableOpacity>
        </View>
        <View>
          <Postcard
            {...this.props}
            model={{
              date: 'Jul 15 - Aug 9',
              user: {
                name: 'Max'
              },
              description: 'Second time traveling to Italy. The culture and food there is amazing!!',
              location: 'Italy'
            }}/>
        </View>
      </View>

    return (
      <ViewContainer backgroundColor='transparent'>
        <NavigationBar
          title={title}
          leftButton={leftButton}
          rightButton={rightButton}
          style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}} />
        {content}
        <Spinner visible={this.state.loadingData}/>
      </ViewContainer>
    )
  }

  _follow() {
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
    color: Colors.beige,
    fontFamily: "ArchitectsDaughter"
  },
  container: {
    padding: 20,
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 5
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    padding: 10
  },
  headerText: {
    margin: 10,
    textAlign: 'center'
  }
})

module.exports = PostcardScreen
