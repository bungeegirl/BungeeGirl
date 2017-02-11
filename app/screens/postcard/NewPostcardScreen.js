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
import Icon from 'react-native-vector-icons/FontAwesome'
import _ from 'underscore'
import moment from 'moment'

import {
  Hoshi
} from 'react-native-textinput-effects'

class PostcardScreen extends Component {

  constructor(props) {
    super(props)

    let value
    if(props.model) {
      this.model = props.model
      value = this.model.val()
    }

    this.state = {}
    _.extend(this.state, {
      userId: props.uid,
      name: props.userData.name
    }, value)
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
        <View style={styles.padding}>
          <Icon
            size={32}
            style={styles.icon}
            name='map' />
          <Hoshi
            style={{flex: 1}}
            label='Where did you travel to?'
            labelStyle={{fontWeight: 'bold'}}
            borderColor='#8db4dd'
            onChangeText={location => this.setState({location})}
            value={this.state.location} />
        </View>

        <View style={styles.padding}>
          <Icon
            size={32}
            style={styles.icon}
            name='calendar' />
          <Hoshi
            style={{flex: 1}}
            label='When did you go?'
            labelStyle={{fontWeight: 'bold'}}
            borderColor='#8db4dd'
            onChangeText={date => this.setState({date})}
            value={this.state.date} />
        </View>

        <View style={styles.padding}>
          <View style={styles.col0}>
          </View>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 20}}>Share up to 4 of your best pics from this trip:</Text>
              <Text style={{fontSize: 15}}>First will appear as stamp image.</Text>
            </View>
            <View style={{flex: 1,flexDirection: 'row'}}>
              <TouchableOpacity
                style={{margin: 5}}
                onPress={ _ => this._selectImage('image0') }>
                <Image
                  style={{
                    height: 70,
                    width: 70,
                    backgroundColor: '#000'
                  }}
                  source={{uri: `data:image/jpeg;base64, ${this.state.image0}`}} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{margin: 5}}
                onPress={ _ => this._selectImage('image1') }>
                <Image
                  style={{
                    height: 70,
                    width: 70,
                    backgroundColor: '#000'
                  }}
                  source={{uri: `data:image/jpeg;base64, ${this.state.image1}`}} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{margin: 5}}
                onPress={ _ => this._selectImage('image2') }>
                <Image
                  style={{
                    height: 70,
                    width: 70,
                    backgroundColor: '#000'
                  }}
                  source={{uri: `data:image/jpeg;base64, ${this.state.image2}`}} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{margin: 5}}
                onPress={ _ => this._selectImage('image3') }>
                <Image
                  style={{
                    height: 70,
                    width: 70,
                    backgroundColor: '#000'
                  }}
                  source={{uri: `data:image/jpeg;base64, ${this.state.image3}`}} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.padding}>
          <Icon
            size={32}
            style={styles.icon}
            name='pencil' />
          <Hoshi
            style={{flex: 1}}
            label='Say a few words about your trip'
            labelStyle={{fontWeight: 'bold'}}
            borderColor='#8db4dd'
            onChangeText={description => this.setState({description})}
            value={this.state.description} />
        </View>

        <View style={styles.padding}>
          <Icon
            size={32}
            style={styles.icon}
            name='hotel' />
          <Hoshi
            style={{flex: 1}}
            label='Where did you stay?'
            labelStyle={{fontWeight: 'bold'}}
            borderColor='#8db4dd'
            onChangeText={stayedAt => this.setState({stayedAt})}
            value={this.state.stayedAt} />
        </View>

        <View style={{marginTop: 20}}>
          <View style={{flexDirection: 'row'}}>
            <Icon
              size={32}
              style={styles.icon}
              name='cutlery' />
            <Text style={{
              marginLeft: 5,
              fontSize: 15,
              fontWeight: 'bold'
            }}>Where did you eat?</Text>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Resturant #1'
                labelStyle={{fontWeight: 'bold'}}
                borderColor='#8db4dd'
                onChangeText={food1 => this.setState({food1})}
                value={this.state.food1} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Resturant #2'
                labelStyle={{fontWeight: 'bold'}}
                borderColor='#8db4dd'
                onChangeText={food2 => this.setState({food2})}
                value={this.state.food2} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Resturant #3'
                labelStyle={{fontWeight: 'bold'}}
                borderColor='#8db4dd'
                onChangeText={food3 => this.setState({food3})}
                value={this.state.food3} />
            </View>
          </View>
        </View>

        <View style={{marginTop: 20}}>
          <View style={{flexDirection: 'row'}}>
            <Icon
              size={32}
              style={styles.icon}
              name='futbol-o' />
            <Text style={{
              fontSize: 15,
              fontWeight: 'bold'
            }}>What activities did you participate in?</Text>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Activity #1'
                labelStyle={{fontWeight: 'bold'}}
                borderColor='#8db4dd'
                onChangeText={activity1 => this.setState({activity1})}
                value={this.state.activity1} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Activity #2'
                labelStyle={{fontWeight: 'bold'}}
                borderColor='#8db4dd'
                onChangeText={activity2 => this.setState({activity2})}
                value={this.state.activity2} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Activity #3'
                labelStyle={{fontWeight: 'bold'}}
                borderColor='#8db4dd'
                onChangeText={activity3 => this.setState({activity3})}
                value={this.state.activity3} />
            </View>
          </View>
        </View>

        <View style={{marginTop: 20}}>
          <View style={{flexDirection: 'row'}}>
            <Icon
              size={32}
              style={styles.icon}
              name='ticket' />
            <Text style={{
              fontSize: 15,
              fontWeight: 'bold'
            }}>What events did you attend?</Text>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Event #1'
                labelStyle={{fontWeight: 'bold'}}
                borderColor='#8db4dd'
                onChangeText={event1 => this.setState({event1})}
                value={this.state.event1} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Event #2'
                labelStyle={{fontWeight: 'bold'}}
                borderColor='#8db4dd'
                onChangeText={event2 => this.setState({event2})}
                value={this.state.event2} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Event #3'
                labelStyle={{fontWeight: 'bold'}}
                borderColor='#8db4dd'
                onChangeText={event3 => this.setState({event3})}
                value={this.state.event3} />
            </View>
          </View>
        </View>

        <View style={{marginTop: 20}}>
          <View style={{flexDirection: 'row'}}>
            <Icon
              size={32}
              style={styles.icon}
              name='smile-o' />
            <Text style={{
              fontSize: 15,
              fontWeight: 'bold'
            }}>Share your top Dos from this trip</Text>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Do #1'
                labelStyle={{fontWeight: 'bold'}}
                borderColor='#8db4dd'
                onChangeText={do1 => this.setState({do1})}
                value={this.state.do1} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Do #2'
                labelStyle={{fontWeight: 'bold'}}
                borderColor='#8db4dd'
                onChangeText={do2 => this.setState({do2})}
                value={this.state.do2} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label='Do #3'
                labelStyle={{fontWeight: 'bold'}}
                borderColor='#8db4dd'
                onChangeText={do3 => this.setState({do3})}
                value={this.state.do3} />
            </View>
          </View>
        </View>

        <View style={{marginTop: 20}}>
          <View style={{flexDirection: 'row'}}>
            <Icon
              size={32}
              style={styles.icon}
              name='frown-o' />
            <Text style={{
              fontSize: 15,
              fontWeight: 'bold'
            }}>Share your top Don'ts from this trip</Text>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label="Don't #1"
                labelStyle={{fontWeight: 'bold'}}
                borderColor='#8db4dd'
                onChangeText={dont1 => this.setState({dont1})}
                value={this.state.dont1} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label="Don't #2"
                labelStyle={{fontWeight: 'bold'}}
                borderColor='#8db4dd'
                onChangeText={dont2 => this.setState({dont2})}
                value={this.state.dont2} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 10}}>
              <Hoshi
                label="Don't #3"
                labelStyle={{fontWeight: 'bold'}}
                borderColor='#8db4dd'
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
      onFinishLoad: data => {
        let state = {}
        state[key] = data
        this.setState({...state})
      }
    })
  }

  _submit() {
    let state = this.state
    let props = this.props
    if(props.model) {
      let changed = {}, value = this.model.val()
      _.each(state, (val, key) => {
        if(value[key] !== val)
          changed[key] = val
      })
      props.firebaseRef.child(`trips/${props.model.key()}`).update(changed).then( _ => {
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
  padding: {
    flexDirection:'row',
    padding: 5,
    alignItems: 'center'
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
  },
  icon: {
    width: 40,
    height: 40
  }
})

module.exports = PostcardScreen
