import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  View,
  ListView,
} from 'react-native'

var deviceWidth = Dimensions.get('window').width

class EditListView extends Component {
  constructor(props) {
    super(props)
    var rows = [{
      title: 'Name',
      onPress: () => props.editName()
    }, {
      title: 'Birthdate',
      onPress: () => props.editBirthdate()
    }, {
      title: 'Home City',
      onPress: () => props.editHometown()
    }, {
      title: 'Bio',
      onPress: () => props.editBio()
    }, {
      title: 'Traveler Type',
      onPress: () => props.editTravelType()
    }, {
      title: 'Profile Picture',
      onPress: () => props.editProfilePicture()
    }, {
      title: 'Background Pictures',
      onPress: () => props.editProfileBackgroundPictures()
    }, {
      title: 'Verify with Facebook',
      onPress: () => props.validateFacebookInfo()
    }]
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows(rows)
    }
  }

  render() {
    var content
    content =
    <View style={{flex: 1}}>
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => this._renderRow(rowData)}/>
    </View>

    return content
  }

  _renderRow(rowData) {
    var row =
    <TouchableOpacity
      onPress={() => rowData.onPress()}
      style={styles.rowContainer}>
      <Text style={styles.rowText}>{rowData.title}</Text>
      <Image
        resizeMode='contain'
        source={require('../assets/selection-arrow-dark.png')}
        style={{width: 48, height: 14, marginLeft: 10}}/>
    </TouchableOpacity>

    return row
  }

}

module.exports = EditListView

const styles = StyleSheet.create({
  rowContainer: {
    height: 48,
    width: deviceWidth,
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  rowText: {
    fontSize: 18,
    fontFamily: "ArchitectsDaughter",
  }
})
