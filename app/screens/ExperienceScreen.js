import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
  View,
  Picker,
  ListView,
} from 'react-native'

import ViewContainer from '../components/ViewContainer'
import Colors from '../styles/Colors'
import NavigationBar from 'react-native-navbar'
import cityData from '../local_data/cityData'
import _ from 'underscore'

var deviceWidth = Dimensions.get('window').width

class ExperienceScreen extends Component {
  constructor(props) {
    super(props)
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(cityData)
    }
  }

  render() {
    var title = <Text style={[styles.titleText, {marginBottom: 4}]}>Find me and experience in:</Text>
    var content =
    <ViewContainer backgroundColor={Colors.beige}>
      <NavigationBar
        style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}}
        title={title}/>
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => this._renderRow(rowData)}/>
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
        this.props.navigator.push({
          ident: 'CityBrowserScreen',
          cityIdent: cityIdent
        })
      }}>
        <Image
          source={rowData.asset}
          resizeMode='contain'
          style={{width: imageWidth, height: imageHeight}}/>
    </TouchableOpacity>
    return row
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
  }
})
