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

import {
  Hoshi
} from 'react-native-textinput-effects'

class PostcardScreen extends Component {

  constructor(props) {
    super(props)

    if(props.model)
      this.model = props.model.val()

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
        <Hoshi
          label='Where did you travel to?'
          onChangeText={location => this.setState({location})}
          value={this.state.location} />

        <Hoshi
          label='When did you go?'
          onChangeText={date => this.setState({date})}
          value={this.state.date} />

        <View style={styles.row}>
          <View style={styles.col0}>
          </View>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={{flex: 1}}>
              <Text>Share up to 4 of your best pics from this trip:</Text>
            </View>
            <View style={{flex: 1}}>
              <TouchableOpacity
                onPress={ _ => this._selectImage('image0') }>
                <Image
                  style={{
                    height: 50,
                    width: 50,
                    backgroundColor: '#000'
                  }}
                  source={this.state.image0} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Hoshi
          label='Say a few words about your trip'
          onChangeText={description => this.setState({description})}
          value={this.state.description} />

        <Hoshi
          label='Where did you stay?'
          onChangeText={stayedAt => this.setState({stayedAt})}
          value={this.state.stayedAt} />

        <View style={{marginTop: 20}}>
          <Text style={{
            fontSize: 15,
            fontWeight: 'bold'
          }}>What did you eat?</Text>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Resturant #1'
                onChangeText={food1 => this.setState({food1})}
                value={this.state.food1} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Resturant #2'
                onChangeText={food2 => this.setState({food2})}
                value={this.state.food2} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Resturant #3'
                onChangeText={food3 => this.setState({food3})}
                value={this.state.food3} />
            </View>
          </View>
        </View>

        <View style={{marginTop: 20}}>
          <Text style={{
            fontSize: 15,
            fontWeight: 'bold'
          }}>What activities did you participate in?</Text>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Activity #1'
                onChangeText={activity1 => this.setState({activity1})}
                value={this.state.activity1} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Activity #2'
                onChangeText={activity2 => this.setState({activity2})}
                value={this.state.activity2} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Activity #3'
                onChangeText={activity3 => this.setState({activity3})}
                value={this.state.activity3} />
            </View>
          </View>
        </View>

        <View style={{marginTop: 20}}>
          <Text style={{
            fontSize: 15,
            fontWeight: 'bold'
          }}>What events did you attend?</Text>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Event #1'
                onChangeText={event1 => this.setState({event1})}
                value={this.state.event1} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Event #2'
                onChangeText={event2 => this.setState({event2})}
                value={this.state.event2} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Event #3'
                onChangeText={event3 => this.setState({event3})}
                value={this.state.event3} />
            </View>
          </View>
        </View>

        <View style={{marginTop: 20}}>
          <Text style={{
            fontSize: 15,
            fontWeight: 'bold'
          }}>Share your top Dos from this trip</Text>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Do #1'
                onChangeText={do1 => this.setState({do1})}
                value={this.state.do1} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Do #2'
                onChangeText={do2 => this.setState({do2})}
                value={this.state.do2} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Do #3'
                onChangeText={do3 => this.setState({do3})}
                value={this.state.do3} />
            </View>
          </View>
        </View>

        <View style={{marginTop: 20}}>
          <Text style={{
            fontSize: 15,
            fontWeight: 'bold'
          }}>Share your top Don'ts from this trip</Text>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label="Don't #1"
                onChangeText={dont1 => this.setState({dont1})}
                value={this.state.dont1} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label="Don't #2"
                onChangeText={dont2 => this.setState({dont2})}
                value={this.state.dont2} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label="Don't #3"
                onChangeText={dont3 => this.setState({dont3})}
                value={this.state.dont3} />
            </View>
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

  _selectImage(key) {
    this.props.navigator.push({
      ident: 'CameraImagePicker',
      onBack: _ => this.props.navigator.pop(),
      onFinishLoad:{ }
    })
  }

  _submit() {
    let state = this.state
    let props = this.props
    if(props.model) {
      props.firebaseRef.child(`trips/${props.model.key()}`).set(state).then( _ => {
        props.onSubmit(state)
        props.navigator.pop()
      })
    } else {
      props.firebaseRef.child('trips').push(state).then( _ => {
        props.navigator.pop()
      })
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
  },
  column: {
    flexDirection: 'column'
  },
  textInput: {
    flex: 1
  }
})

module.exports = PostcardScreen
