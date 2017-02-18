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
import OneSignal from 'react-native-onesignal'

export default class PostcardScreen extends Component {

  constructor(props) {
    super(props)

    this.displayUser = this.props.userDisplayData
    this.isOwner = this.props.userData.uid === this.displayUser.uid

    this.state = {
      loadingData: true,
      trips: 0,
      followers: 0,
      following: false,
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    }
  }

  componentDidMount() {
    this.followersRef = this.props.firebaseRef.child(`users-followers/${this.displayUser.uid}`)
    this.followersRef.on('value', snap => {
      this.setState({
        followers: snap.numChildren(),
        following: snap.child(this.props.uid).exists()
      })
    })
    this.tripsRef = this.props.firebaseRef.child(`trips/${this.displayUser.uid}`)
    this.tripsRef.on('value', snap => {
      let trips = []
      snap.forEach( trip => {
        trips.push(trip)
      })
      this.setState({
        loadingData: false,
        dataSource: this.state.dataSource.cloneWithRows(trips),
        trips: trips.length
      })
    })
  }

  componentWillUnmount() {
    this.followersRef.off('value')
    this.tripsRef.off('value')
  }

  render() {
    let title, leftBtn, rightBtn, createPostcardBtn

    title = (this.isOwner) ?
      'My Postcards' : `${this.displayUser.name}'s Postcards`

    if(this.isOwner) {
      createPostcardBtn =
        <TouchableOpacity
          style={[styles.text,{position: 'absolute', right: 10, alignItems: 'center'}]}
          onPress={() => {
            this.props.navigator.push({
              ident: 'NewPostcardScreen'
            })
          }}>
          <Text style={styles.text}>Create Postcard</Text>
          <Image source={require('../../assets/postcard-icon.png')} />
        </TouchableOpacity>
    } else {
      leftBtn =
        <TouchableOpacity
          onPress={ _ => this.props.navigator.pop() }>
          <Image
            style={styles.followButtonImage}
            source={require('../../assets/Nav-Back.png')} />
        </TouchableOpacity>

      rightBtn =
        <TouchableOpacity
          onPress={this._follow.bind(this)}>
          <Image
            style={styles.followButtonImage}
            source={require('../../assets/follow-icon.png')} />
        </TouchableOpacity>
    }

    return (
      <ViewContainer
        overlayColor='#0002'>
        <Spinner visible={this.state.loadingData} textContent='Loading postcards...' />
        <NavigationBar
          title={<Text style={styles.titleText}>{title}</Text>}
          rightButton={rightBtn}
          leftButton={leftBtn}
          style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}} />

        <View style={styles.header}>
          <Image
            source={{uri: `data:image/jpeg;base64, ${this.displayUser.imageData}`}}
            style={styles.avatarImage}/>
          <Text style={[styles.text, {margin: 10}]}>{`(${this.state.trips})\nTrips`}</Text>
          <Text style={[styles.text, {margin: 10}]}>{`(${this.state.followers})\nFollowers`}</Text>
          {createPostcardBtn}
        </View>
        <ListView
          initialListSize={3}
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionID, rowID) => this._renderRow(rowData, sectionID, rowID)}/>
      </ViewContainer>
    )
  }

  _follow() {
    let val = this.state.following ? null : true
    this.props.firebaseRef.child(`users-followers/${this.displayUser.uid}/${this.props.uid}`).set(val).then( _ => {
      if(val) {
        const contents = {
            'en': `${this.props.userData.name} has started following you!`
        }
        OneSignal.postNotification(contents, {
          type: 'follow',
          userId: this.props.uid
        }, this.displayUser.pushToken)
      }
    })
  }

  _renderRow(data) {
    return (
      <Postcard
        {...this.props}
        trip={data}/>
    )
  }

}

const fullWidth = Dimensions.get('window').width
const containerTopMargin = 20, titleHeight = 40, headerHeight = 80

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontFamily: "ArchitectsDaughter",
  },
  header: {
    flexDirection: 'row',
    height: headerHeight,
    width: fullWidth,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#888',
    backgroundColor: Colors.beige
  },
  followButton: {
    position: 'absolute',
    left: 10
  },
  followButtonImage: {
    width: 50,
    resizeMode: 'contain'
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 5
  },
  text: {
    textAlign: 'center',
    fontFamily: 'ArchitectsDaughter'
  },
  list: {
    flex: 1,
    width: fullWidth,
    height: Dimensions.get('window').height - containerTopMargin - titleHeight - headerHeight - 48
  },
  listContainer: {
    alignItems: 'flex-end'
  }
})
