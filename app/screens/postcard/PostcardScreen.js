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
      loadingData: false,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }
  }

  componentDidMount() {
    this.props.firebaseRef.child('postcards').orderByChild('uid').equalTo(this.props.uid).on('value', data => {
      this.setState({dataSource: this.state.dataSource.cloneWithRows(_.values(data.val()))})
    })
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

    return (
      <ViewContainer backgroundColor={Colors.beige}>
        <NavigationBar
          title={title}
          leftButton={leftButton}
          style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}} />
        <View style={{flex: 0}}>
          <View style={styles.header}>
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
          <ListView
            initialListSize={3}
            style={{height: 450, marginTop: 10}}
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={(rowData, sectionID, rowID) => this._renderRow(rowData, sectionID, rowID)}/>
        </View>
      </ViewContainer>
    )
  }

  _follow() {
  }

  _renderRow(data) {
    return (
      <Postcard
        {...this.props}
        model={data}/>
    )
  }

}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
    color: Colors.beige,
    fontFamily: "ArchitectsDaughter"
  },
  container: {
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
  },
  list: {
    // flex: 1,
    // flexDirection: 'column',
    // height: Dimensions.get('window').height - 200,
    // backgroundColor: '#000'
  }
})

module.exports = PostcardScreen
