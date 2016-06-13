import React, {
  Component,
  StyleSheet,
  Text,
  Image,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native'

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height
import Colors from '../styles/Colors'


class BioEditor extends Component {
  render() {
    var uri = `data:image/jpeg;base64, ${this.props.imageData}`
    var content =
    <View style={[styles.container, {flex: 1}]}>
      <Image
        resizeMode='cover'
        source={{uri: uri}}
        style={styles.avatarImage}/>
      <Text style={[styles.formLabel, {marginTop: 16, marginBottom: 16}]}>Add a little about yourself...</Text>
      <TextInput
        style={styles.bioContainer}
        maxLength={140}
        placeholder='Enter a short bio, e.g. “I’m a commercial architect for a big studio, who likes to shop & dine abroad in between projects!'
        onChangeText={(text) => { this.props.onChangeText(text) }}
        multiline={true}/>
      <Text style={[styles.formLabel, {marginTop: 16, marginBottom: 16}]}>{this.props.bio.length}/180 Characters</Text>
    </View>
    return content
  }
}

module.exports = BioEditor

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  formLabel: {
    color: Colors.fadedGrey,
    fontFamily: "ArchitectsDaughter",
    fontSize: 18,
  },
  formInput: {
    fontSize: 32,
    fontFamily: "ArchitectsDaughter",
    height: 74,
  },
  inputContainer: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center'
  },
  formPretext: {
    fontSize: 32,
    fontFamily: "ArchitectsDaughter",
    marginRight: 8,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  bioContainer: {
    height: 150,
    fontSize: 18,
    fontFamily: "ArchitectsDaughter",
  },
})
