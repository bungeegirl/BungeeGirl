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
  ListView,
} from 'react-native'

import ViewContainer from '../components/ViewContainer'
import Colors from '../styles/Colors'
import NavigationBar from 'react-native-navbar'
import _ from 'underscore'

var deviceWidth = Dimensions.get('window').width

class CityPickerScreen extends Component {
  constructor(props) {
    super(props)
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(cityData)
    }
  }

  render() {
    var title = <Text style={[styles.titleText, {marginBottom: 4}]}>What's your home city?</Text>
    var content =
    <ViewContainer backgroundColor={Colors.beige}>
      <NavigationBar
        title={title}
        style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}} />
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
        var successCallBack = () => this.props.navigator.resetTo({ ident: "HomeScreen" })
        this.props.eventEmitter.emit('citySelected', cityIdent, successCallBack)
      }}>
        <Image
          source={rowData.asset}
          resizeMode='contain'
          style={{width: imageWidth, height: imageHeight}}/>
    </TouchableOpacity>
    return row
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
    fontFamily: "SueEllenFrancisco",
  },
  rowContainer: {
    width: deviceWidth,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

// put in another file
var cityData = [
  {
    ident: 'new-york',
    name: 'New York',
    asset: require('../assets/new-york.png')
  },
  {
    ident: 'san-francisco',
    name: 'San Francisco',
    asset: require('../assets/san-francisco.png')
  },
  {
    ident: 'london',
    name: 'London',
    asset: require('../assets/london.png')
  },
  {
    ident: 'paris',
    name: 'Paris',
    asset: require('../assets/paris.png')
  },
  {
    ident: 'copenhagen',
    name: 'Copenhagen',
    asset: require('../assets/copenhagen.png')
  },
  {
    ident: 'sydney',
    name: 'Sydney',
    asset: require('../assets/sydney.png')
  }
]

module.exports = CityPickerScreen
