import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, Alert, TouchableOpacity, Image, Dimensions, View, Picker, ListView } from 'react-native';

import ViewContainer from '../components/ViewContainer'
import Colors from '../styles/Colors'
import NavigationBar from 'react-native-navbar'
import cityData from '../local_data/cityData'
import DropDown from '../components/Dropdown/index.js'
import _ from 'underscore'
var Mailer = require('NativeModules').RNMail;


const {
  Select,
  Option,
  OptionList,
  updatePosition
} = DropDown;

var deviceWidth = Dimensions.get('window').width

class CityPickerScreen extends Component {
  constructor(props) {
    super(props)
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      selectedCity: '',
      dataSource: ds.cloneWithRows(cityData)
    }
  }

  componentDidMount() {
    updatePosition(this.refs['SELECT1']);
    updatePosition(this.refs['OPTIONLIST']);
  }

  _getOptionList() {
    return this.refs['OPTIONLIST'];
  }

  render() {
    var homeSelectText, selectText
    homeSelectText = "What's your home city"
    selectText = "Select your home city"
    var selectedCityObject = _.findWhere(cityData, {name: this.state.selectedCity})
    var title = <Text style={[styles.titleText, {marginBottom: 4}]}>{homeSelectText}</Text>
    var pickerValues = []
    _.each(cityData, (data) => {
        pickerValue = (
         <Option
           key={data.ident}
           styleText={{fontFamily: 'ArchitectsDaughter'}}>{data.name}</Option>)
        pickerValues.push(pickerValue)
      })
    pickerValues.push(
      <Option
        key='suggest'>Suggest a city...</Option>
    )
    var rightButton
    if(this.state.selectedCity != "") {
      let onPress = selectedCityObject ? () => this._selectCity(selectedCityObject) : () => this._suggestCity()
      rightButton =
      <Text
        onPress={() => onPress()}
        style={[styles.titleText, {color: Colors.red, marginRight: 8}]}> Next </Text>
    } else {
      rightButton = <Text style={[styles.titleText, {color: Colors.darkGrey, marginRight: 8}]}> Next </Text>
    }
    var content =
    <ViewContainer backgroundColor={Colors.beige}>
      <NavigationBar
        title={title}
        rightButton={rightButton}
        style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}} />
      <View style={{ flex: 1, marginTop: 20, alignItems: 'center' }}>
        <Select
          width={deviceWidth - 100}
          ref="SELECT1"
          optionListRef={this._getOptionList.bind(this)}
          defaultValue={selectText}
          onSelect={(selection) => this.setState({selectedCity: selection})}>
          {pickerValues}
        </Select>
        <OptionList ref="OPTIONLIST"/>
      </View>
    </ViewContainer>

    return content
  }

  _selectCity(cityObject) {
    var successCallBack
    successCallBack = () =>  {
      this.props.navigator.resetTo({ ident: "HomeScreen" })
    }
    this.props.eventEmitter.emit('citySelected', cityObject.ident, successCallBack)
  }

  _suggestCity() {
    Mailer.mail({
      subject: 'Suggest a city for Bungee Girl',
      recipients: ['support@bungeegirl.com'],
      body: 'I would love it if you added [ENTER CITY HERE] to Bungee Girl next!',
    }, (error) => {
      if(error) {
        Alert.alert('Error', 'Could not send mail.')
      }
    })
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
    fontFamily: "ArchitectsDaughter",
  },
  rowContainer: {
    width: deviceWidth,
    alignItems: 'center',
    justifyContent: 'center',
  }
})


module.exports = CityPickerScreen
