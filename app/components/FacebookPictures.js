
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

import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../styles/Colors'
import CameraRollView from '../components/CameraRollView'
import moment from 'moment'
import _ from 'underscore'
import Spinner from 'react-native-loading-spinner-overlay';
import FBSDK from 'react-native-fbsdk'
import RNInstagramOAuth from 'react-native-instagram-oauth'
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;
var ImagePickerManager = require('NativeModules').ImagePickerManager

var { FBLoginManager } = require('react-native-facebook-login')

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height
var instagram =  {
    client_id: '9bae332d7bc84d64919166553dca161e',
    redirect_url: 'https://swish.io'  // e.g.: 'test://init'
};

function getInstagramByMyself (access_token) {
  fetch('`https://api.instagram.com/v1/media/search?yoyo&client_id='+instagram.client_id)
  .then((response) =>
  {
     console.log(response)
      response.json()
      .then((responseData) => {
        console.log(responseData)
      } )
      .catch(error => console.log('nested error', error))
  })
  .catch(error => console.log(error))

  // response.json()).then((responseData) => {
  //         console.log(responseData);
  //     });
  //  fetch('https://api.instagram.com/v1/users/self/?access_token='+access_token)
  //      .then((response) => response.json()).then((responseData) => {
  //          console.log(responseData);
  //      });
}

class FacebookPictures extends Component {
  componentDidMount() {
    const infoRequest = new GraphRequest(
      '/me/photos',
      null,
      this._responseInfoCallback,
    );
    // FBLoginManager.loginWithPermissions(["user_photos"], function(error, data) {
    //   if(error) {
    //     console.log(error, 'error')
    //   } else {
    //     console.log(data, 'success')
    //   }
    // })
    // new GraphRequestManager().addRequest(infoRequest).start()
    // new GraphRequestManager().addRequest(infoRequest).start();
    getInstagramByMyself(1);
    // RNInstagramOAuth(instagram.client_id, instagram.redirect_url, (err, access_token) => {
    //    if (err) { console.log(err) }
    //    if (access_token !== undefined) {
    //        console.log(access_token);
    //
    //        getInstagramByMyself(access_token);
    //
    //    }
    // });
  }

  _responseInfoCallback(error: ?Object, result: ?Object) {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      console.log(result)
    }
  }
  render() {
    console.log('rendering pics')
    return (
      <View style={{height: 200, width: 300, backgroundColor: 'red'}}/>
    )
  }
}

module.exports = FacebookPictures
