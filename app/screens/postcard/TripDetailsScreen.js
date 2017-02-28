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
  ScrollView,
  ListView,
} from 'react-native'

import ViewContainer from '../../components/ViewContainer'
import Postcard from '../../components/Postcard'
import NavigationBar from 'react-native-navbar'
import Lightbox from 'react-native-lightbox'
import Colors from '../../styles/Colors'
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/FontAwesome'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import _ from 'lodash'
import moment from 'moment'

export default class TripDetailsScreen extends Component {

  constructor(props) {
    super(props)

    this.trip = props.trip
    this.state = {
      foods: [],
      activities: [],
      events: [],
      images: [],
      dos: [],
      donts: [],
      ...this.trip.val()
    }
  }

  componentDidMount() {
    this.trip.ref().on('value', snap => {
      this.trip = snap
      this.setState(snap.val())
    })
  }

  componentWillUnmount() {
    this.trip.ref().off('value')
  }

  render() {
    let rightBtn, deleteBtn
    if(this.props.uid === this.trip.ref().parent().key()) {
      rightBtn =
        <TouchableOpacity
          style={{margin: 10}}
          onPress={ _ => this._edit() }>
          <Icon
            name='pencil-square-o'
            size={30}/>
        </TouchableOpacity>

      deleteBtn =
        <TouchableOpacity
          style={{
            flex:1,
            flexDirection: 'row',
            margin: 5,
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            backgroundColor: '#f11'
          }}
          onPress={ _ => this._delete() }>
          <Icon
            name='trash'
            size={30}/>
          <Text>Delete</Text>
        </TouchableOpacity>
    }

    return (
      <ViewContainer
        overlayColor='#0002'>
        <NavigationBar
          title={<Text style={[styles.text, styles.titleText]}>{this.state.location}</Text>}
          leftButton={
            <TouchableOpacity
              style={{margin: 10}}
              onPress={ _ => this.props.navigator.pop() }>
              <Icon
                name='angle-left'
                size={30}/>
            </TouchableOpacity>
          }
          rightButton={rightBtn}
          style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}} />

        <ScrollView style={styles.content}>
          <View>
            <View style={styles.row}>
              <View style={styles.rowHeader}>
                <Icon
                  style={[styles.icon, {left: 10, color: '#36f'}]}
                  size={35}
                  name='info' />
                <Text style={[styles.text, styles.headerText]}>About</Text>
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.text, styles.contentText]}>{this.state.description}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowHeader}>
                <Image
                  style={styles.icon}
                  resizeMode='contain'
                  source={require('../../assets/location-pin.png')} />
                <Text style={[styles.text, styles.headerText]}>Stayed at</Text>
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.text, styles.contentText]}>{this.state.stayedAt}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowHeader}>
                <Image
                  style={styles.icon}
                  resizeMode='contain'
                  source={require('../../assets/cutlery.png')} />
                <Text style={[styles.text, styles.headerText]}>Ate at</Text>
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.text, styles.contentText]}>{this.state.foods.join(', ')}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowHeader}>
                <MIcon
                  name='directions-walk'
                  size={30}
                  style={styles.icon} />
                <Text style={[styles.text, styles.headerText]}>Visited</Text>
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.text, styles.contentText]}>{this.state.activities.join(', ')}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowHeader}>
                <Image
                  style={styles.icon}
                  resizeMode='contain'
                  source={require('../../assets/ticket.png')} />
                <Text style={[styles.text, styles.headerText]}>Events attended</Text>
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.text, styles.contentText]}>{this.state.events.join(', ')}</Text>
              </View>
            </View>
          </View>

          <View style={{
            flexDirection: 'column',
            margin: 10
          }}>
            {this._buildImages()}
          </View>

          <View>
            <View>
              <Text style={[styles.text]}>According to {this.state.name}...</Text>
            </View>
            <View style={styles.topWrapper}>
              <View style={styles.topContainer}>
                <Text style={[styles.text, styles.topHeaderText]}>Top Dos</Text>
                {this._buildTopList(this.state.dos)}
              </View>
              <View style={styles.topContainer}>
                <Text style={[styles.text, styles.topHeaderText]}>Top Donts</Text>
                {this._buildTopList(this.state.donts)}
              </View>
            </View>
          </View>

          {deleteBtn}
        </ScrollView>
      </ViewContainer>
    )
  }

  _wrapInLightbox(image) {
    return (
      <Lightbox>
        {image}
      </Lightbox>
    )
  }
  _buildImages() {
    let images = []
    for(let i = 0; i < 4; i++) {
      let imageData = this.state[`image${i}`]
      if(imageData)
        images.push(
          <Lightbox
            key={`image-box-${i}`}
            style={{
              margin: 5
            }}
            renderContent={ _ => {
              return (
                <Image
                  resizeMode='contain'
                  style={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height
                  }}
                  source={{uri: imageData}} />
              )
            }}>

            <Image
              style={styles.userImage}
              resizeMode='contain'
              source={{uri: imageData}} />
          </Lightbox>
        )
    }
    return images
  }

  _buildTopList(top) {
    let arr = []
    for(let i = 0; i < top.length; i++) {
      arr.push(
        <Text>• <Text style={[styles.text]}>{top[i]}</Text></Text>
      )
    }
    return arr
  }

  _edit() {
    if(this.props.uid !== this.trip.ref().parent().key()) return false

    this.props.navigator.push({
      ident: 'NewPostcardScreen',
      trip: this.trip,
    })
  }

  _delete() {
    if(this.props.uid !== this.trip.ref().parent().key()) return false

    this.trip.ref().remove().then( err => {
      if(!err)
        this.props.navigator.pop()
    })
  }

}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 25,
  },
  container: {
    flex: 1,
    backgroundColor: '#0002'
  },
  content: {
    padding: 10,
  },
  text: {
    fontFamily: "ArchitectsDaughter",
  },
  headerText: {
    flex: 1,
    fontSize: 25,
    textAlign: 'center'
  },
  row: {
    marginTop: 5,
    marginBottom: 10,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 25,
    textDecorationLine: 'underline'
  },
  rowContent: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  contentText: {
    fontSize: 20,
    width: Dimensions.get('window').width - 10
  },
  icon: {
    width: 35,
    height: 35,
    marginRight: 10
  },
  topWrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  topContainer: {
    flex: 1,
    margin: 10
  },
  topHeaderText: {
    fontSize: 25,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  userImage: {
    height: 100
  }
})
