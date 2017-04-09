import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, Alert, TouchableOpacity, Image, Dimensions, View, Picker, ListView } from 'react-native';

import ViewContainer from '../components/ViewContainer'
import Colors from '../styles/Colors'
import NavigationBar from 'react-native-navbar'
import cityData from '../local_data/cityData'
import _ from 'underscore'

var deviceWidth = Dimensions.get('window').width
let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class ExperienceScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: ds.cloneWithRows(_.reject(cityData, (city) => {
        return city.ident == props.userData.city
      }))
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.userData.city !== this.props.userData.city) {
      this.setState({
        dataSource: ds.cloneWithRows(_.reject(cityData, (city) => {
          return city.ident == nextProps.userData.city
        }))
      })
    }
  }

  render() {
    var title = <Text style={[styles.titleText, {marginBottom: 4}]}>Meet solo travelers from...</Text>
    var content =
    <ViewContainer backgroundColor={Colors.beige}>
      <NavigationBar
        style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}}
        title={title}/>
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => this._renderRow(rowData)}
        renderFooter={() => this.renderFooter()}/>
    </ViewContainer>

    return content
  }

  _renderRow(rowData) {
    var imageWidth = deviceWidth - 20
    var imageHeight = (240 / imageWidth) * imageWidth
    var cityIdent = rowData.ident
    var row =
    <TouchableOpacity
      style={styles.rowContainer}
      onPress={() => {
        var successCallBack = () => this.props.navigator.push({
          ident: 'CityBrowserScreen',
          cityIdent: cityIdent,
        })
        this.props.eventEmitter.emit('browsedCity',cityIdent,successCallBack)
      }}>
        <Image
          source={rowData.asset}
          resizeMode='contain'
          style={{width: imageWidth, height: imageHeight}}/>
    </TouchableOpacity>
    return row
  }

  renderFooter() {
    var homeCity = _.filter(cityData, (city) => { return city.ident == this.props.userData.city })[0]
    var imageWidth = deviceWidth - 20
    var imageHeight = (240 / imageWidth) * imageWidth
    var cityIdent = homeCity.ident
    return (
      <View>
        <View style={{flex: 1, padding: 20}}>
          <Text style={[styles.titleText, {textAlign: 'center'}]}>or find a travel buddy in your home city</Text>
        </View>
        <TouchableOpacity
          style={styles.rowContainer}
          onPress={() => {
            var successCallBack = () => this.props.navigator.push({
              ident: 'CityBrowserScreen',
              cityIdent: cityIdent,
              homeCity: true
            })
            this.props.eventEmitter.emit('browsedCity',cityIdent,successCallBack)
          }}>
            <Image
              source={homeCity.asset}
              resizeMode='contain'
              style={{width: imageWidth, height: imageHeight}}/>
        </TouchableOpacity>
      </View>
    )
  }
}

module.exports = ExperienceScreen

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
    fontFamily: "ArchitectsDaughter",
  },
  rowContainer: {
    width: deviceWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
})
