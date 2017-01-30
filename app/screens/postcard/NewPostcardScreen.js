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
import NavigationBar from 'react-native-navbar'
import Colors from '../../styles/Colors'
import Icon from 'react-native-vector-icons/Ionicons'
import _ from 'underscore'
import moment from 'moment'

class PostcardScreen extends Component {

  constructor(props) {
    super(props)

    this.state = {}
    _.extend(this.state, {
      userId: props.uid,
      name: props.userData.name
    }, props.model)
  }

  render() {
    var title = <Text style={[styles.titleText, {marginBottom: 4, color: Colors.darkGrey}]}>Fill out your postcard:</Text>
    var leftButton =
      <TouchableOpacity
        style={[styles.backButton, {marginLeft: 8}]}
        onPress={() => this.props.navigator.pop()}>
        <Text style={[styles.buttonText, {color: Colors.black, fontSize: 14}]}>Cancel</Text>
      </TouchableOpacity>
    var rightButton =
      <TouchableOpacity
        style={[styles.backButton, {margin: 5}]}
        onPress={() => this._submit()}>
        <Text style={[styles.buttonText, {padding: 10, color: Colors.black, backgroundColor: Colors.fadedOrange, fontSize: 14}]}>Submit</Text>
      </TouchableOpacity>
    var content =
      <ScrollView style={styles.mainContent}>
        <View style={styles.row}>
          <View style={styles.col0}>
          </View>
          <View style={styles.col1}>
            <Text>Where did you travel to:</Text>
          </View>
          <View style={styles.col2}>
            <TextInput
              style={styles.textInput}
              onChangeText={location => this.setState({location})}
              value={this.state.location} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col0}>
          </View>
          <View style={styles.col1}>
            <Text>When did you go:</Text>
          </View>
          <View style={styles.col2}>
            <TextInput
              style={styles.textInput}
              onChangeText={date => this.setState({date})}
              value={this.state.date} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col0}>
          </View>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={{flex: 1}}>
              <Text>Share up to 4 of your best pics from this trip:</Text>
            </View>
            <View style={{flex: 1}}>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col0}>
          </View>
          <View style={styles.col1}>
            <Text>Say a few words about your trip:</Text>
          </View>
          <View style={styles.col2}>
            <TextInput
              style={styles.textInput}
              onChangeText={description => this.setState({description})}
              value={this.state.description} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col0}>
          </View>
          <View style={styles.col1}>
            <Text>Where did you stay:</Text>
          </View>
          <View style={styles.col2}>
            <TextInput
              style={styles.textInput}
              onChangeText={stayedAt => this.setState({stayedAt})}
              value={this.state.stayedAt} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col0}>
          </View>
          <View style={styles.col1}>
            <Text>What did you eat:</Text>
          </View>
          <View style={styles.col2}>
            <TextInput
              style={styles.textInput}
              onChangeText={food => this.setState({food})}
              value={this.state.food} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col0}>
          </View>
          <View style={styles.col1}>
            <Text>What did you do:</Text>
          </View>
          <View style={styles.col2}>
            <TextInput
              style={styles.textInput}
              onChangeText={activities => this.setState({activities})}
              value={this.state.activities} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col0}>
          </View>
          <View style={styles.col1}>
            <Text>What events did you attend:</Text>
          </View>
          <View style={styles.col2}>
            <TextInput
              style={styles.textInput}
              onChangeText={events => this.setState({events})}
              value={this.state.events} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col0}>
          </View>
          <View style={styles.col1}>
            <Text>Share your top Dos from this trip:</Text>
          </View>
          <View style={styles.col2}>
            <TextInput
              style={styles.textInput}
              onChangeText={dos => this.setState({dos})} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col0}>
          </View>
          <View style={styles.col1}>
            <Text>Share you top Don'ts from this trip:</Text>
          </View>
          <View style={styles.col2}>
            <TextInput
              style={styles.textInput}
              onChangeText={donts => this.setState({donts})} />
          </View>
        </View>
      </ScrollView>

    return (
      <ViewContainer backgroundColor='transparent'>
        <NavigationBar
          title={title}
          leftButton={leftButton}
          rightButton={rightButton}
          statusBar={{
            tintColor: '#8db4dd',
            hidden: true
          }}
          style={{backgroundColor: '#8db4dd', marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}} />
        {content}
      </ViewContainer>
    )
  }

  _submit() {
    let state = this.state
    let props = this.props
    if(state.location && state.date && state.description && state.stayedAt && state.food && state.activities && state.events && state.dos && state.donts) {
      if(props.model) {
        props.firebaseRef.child(`trips/${props.model.uid}`).set(state).then( _ => {
          props.onSubmit(state)
          props.navigator.pop()
        })
      } else {
        props.firebaseRef.child('trips').push(state).then( _ => {
          props.navigator.pop()
        })
      }
    } else {
      Alert.alert(
        'Incomplete Postcard',
        'Please make sure to fill out all the information to submit your postcard.'
      )
    }
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
    color: Colors.beige,
    fontFamily: "ArchitectsDaughter"
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    padding: 5
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    margin: 5
  },
  col0: {
    width: 40
  },
  col1: {
    width: 150,
    marginRight: 2,
    borderColor: Colors.darkOrange,
    justifyContent: 'center',
    borderWidth: 1
  },
  col2: {
    flex: 1,
    borderColor: Colors.darkOrange,
    borderWidth: 1
  },
  textInput: {
    flex: 1
  }
})

module.exports = PostcardScreen
