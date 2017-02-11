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
import MIcon from 'react-native-vector-icons/MaterialIcons'
import _ from 'underscore'
import moment from 'moment'

export default class TripDetailsScreen extends Component {

  constructor(props) {
    super(props)

    this.model = props.model.val()
    this.state = {}
    _.extend(this.state, this.model)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={ _ => this.props.navigator.pop() }>
            <Icon
              name='ios-arrow-back'
              size={30}/>
          </TouchableOpacity>
          <Text style={[styles.text, styles.headerText]}>{this.state.location}</Text>
          <TouchableOpacity
            onPress={ _ => this._edit() }>
            <MIcon
              name='edit'
              size={30}/>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View>
            <View style={styles.row}>
              <Icon
                name=''
                size={20}
                style={styles.icon} />
              <Text style={[styles.text]}>Stayed at: {this.state.stayedAt}</Text>
            </View>
            <View style={styles.row}>
              <Icon
                name='food'
                size={20}
                style={styles.icon} />
              <Text style={[styles.text]}>Ate at: {[this.state.food1,this.state.food2,this.state.food3].filter(Boolean).join(', ')}</Text>
            </View>
            <View style={styles.row}>
              <Icon
                name=''
                size={20}
                style={styles.icon} />
              <Text style={[styles.text]}>Visited: {[this.state.activity1,this.state.activity2,this.state.activity3].filter(Boolean).join(', ')}</Text>
            </View>
            <View style={styles.row}>
              <Icon
                name=''
                size={20}
                style={styles.icon} />
              <Text style={[styles.text]}>Events attended: {[this.state.event1,this.state.event2,this.state.event3].filter(Boolean).join(', ')}</Text>
            </View>
          </View>
          <View>
            <View>
              <Text>According to {this.state.name}...</Text>
            </View>
            <View style={styles.topWrapper}>
              <View style={styles.topContainer}>
                <Text style={styles.topHeaderText}>Top Dos</Text>
                <Text>• {this.state.do1}</Text>
                <Text>• {this.state.do2}</Text>
                <Text>• {this.state.do3}</Text>
              </View>
              <View style={styles.topContainer}>
                <Text style={styles.topHeaderText}>Top Donts</Text>
                <Text>• {this.state.dont1}</Text>
                <Text>• {this.state.dont2}</Text>
                <Text>• {this.state.dont3}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }

  _edit() {
    if(this.props.uid !== this.model.userId) return false

    this.props.navigator.push({
      ident: 'NewPostcardScreen',
      model: this.props.model,
      onSubmit: val => {
        this.setState({...val})
        this.props.onSubmit(val)
      }
    })
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2
  },
  content: {
    padding: 10,
  },
  text: {
    fontSize: 15
  },
  headerText: {
    flex: 1,
    fontSize: 25,
    textAlign: 'center'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    padding: 10
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
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline'
  }
})
