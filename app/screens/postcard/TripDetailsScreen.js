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

export default class TripDetailsScreen extends Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.text, styles.headerText]}>
        </View>
        <View style={styles.content}>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
  },
  header: {
  },
  content: {
  },
  text: {
  },
  headerText: {
  }
})
