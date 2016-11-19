
import React, {
  Component,
  StyleSheet,
  Text,
  Image,
  NativeModules,
  ScrollView,
  View,
  ListView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  ActivityIndicatorIOS,
  ActionSheetIOS
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../styles/Colors'
import FBSDK from 'react-native-fbsdk'
import _ from 'underscore'
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;
let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var FBLoginManager = NativeModules.FBLoginManager

class FacebookAlbumList extends Component {
  constructor() {
    super()
    this._responseInfoCallback = this._responseInfoCallback.bind(this)
    this._imageCallBack = this._imageCallBack.bind(this)
    this.state = {
      albumsData: ds.cloneWithRows([]),
      loading: true,
      albums: []
    }
  }
  componentDidMount() {
    FBLoginManager.loginWithPermissions(['user_photos'], function(error, result) {
        if(error) {
          alert('Login fail with error: ' + error);
        } else {
          if (result.isCancelled) {
            alert('Login cancelled');
          } else {
            // alert('Login success with permissions: ')
          }
        }
      })
    const infoRequest = new GraphRequest(
      '/me/albums?fields=cover_photo,photo_count,name&limit=40',
      null,
      this._responseInfoCallback,
    );
    new GraphRequestManager().addRequest(infoRequest).start()
  }

  _imageCallBack(error, result, index) {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      let albumsClone = _.clone(this.state.albums)
      const uri = result.images && result.images.length > 0 ? _.last(result.images).source : ''
      albumsClone[index] = {
        ...albumsClone[index],
        photoUri: uri
      }
      this.setState({
        albums: albumsClone,
        albumsData: ds.cloneWithRows(albumsClone)
      })
    }
  }

  _responseInfoCallback(error: ?Object, result: ?Object) {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      let albums = result.data
      _.each(albums, (album, index) => {
        if(album.cover_photo) {
          const id = '/' + album.cover_photo.id + '?fields=images'
          const infoRequest = new GraphRequest(
            id,
            null,
            (error, result) => this._imageCallBack(error, result, index),
          )
          new GraphRequestManager().addRequest(infoRequest).start()
        }
      })
      albums = _.map(albums, (album) => {
        return {...album, photoUri: ''}
      })
      this.setState({
        albumsData: ds.cloneWithRows(albums),
        albums: albums,
        loading: false
      })
    }
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor:Colors.beige}}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.onClose()}
            style={styles.item}>
            <Text style={{color: 'white', textAlign: 'center'}}>Cancel</Text>
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <Text style={{color: 'white', textAlign: 'center', fontSize: 16}}>Albums</Text>
          </View>
          <View style={styles.item}/>
        </View>
        { this.state.loading && <ActivityIndicatorIOS animating={true} size='large' style={{marginTop: 48}}/> }
        { !this.state.loading && (
          <ListView
            renderRow={(rowData) => this.renderRow(rowData)}
            dataSource={this.state.albumsData}/>
        )}
      </View>
    )
  }

  renderRow(rowData) {
    return (
      <TouchableOpacity
        onPress={() => this.props.onSelectAlbum(rowData.id)}
        style={styles.rowContainer}>
        {rowData.photoUri !== '' && (
          <Image
            resizeMode='cover'
            style={styles.previewStyle}
            source={{uri: rowData.photoUri}}/>)}
        {rowData.photoUri === '' && (
          <ActivityIndicatorIOS style={styles.previewStyle} animating={true}/>)}
        <View style={styles.rowTextContainer}>
          <Text style={{fontSize: 14, fontWeight: '500'}}>{rowData.name}</Text>
          <Text>{rowData.photo_count} Photos</Text>
        </View>
        <Icon
          style={{alignSelf: 'center'}}
          name='md-arrow-dropright'
          size={24}
          color='black'/>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    height: 68,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    flexDirection: 'row'
  },
  item: {
    width: 60,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rowContainer: {
    height: 72,
    flex: 1,
    flexDirection: 'row',
    paddingRight: 20,
  },
  previewStyle: {
    height: 72,
    width: 100
  },
  rowTextContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    flexDirection: 'column'
  }
})

module.exports = FacebookAlbumList
