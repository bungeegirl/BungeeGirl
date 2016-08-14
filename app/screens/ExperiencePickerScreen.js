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
  render() {
    var title = <Text style={[styles.titleText, {marginBottom: 4}]}>Find an experience</Text>

    var content =
    <ViewContainer backgroundColor={Colors.beige}>
      <NavigationBar
        style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}}
        title={title}/>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {

        }}>
        <Text style={styles.titleText}>{`Find other `}</Text>
      </TouchableOpacity>

    </ViewContainer>

    return content

  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
    fontFamily: "ArchitectsDaughter",
  },
  buttonContainer: {
    padding: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
