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


class BirthdatePicker extends Component {

  shouldComponentUpdate(props) {
    if(props.month.length == 2 && props.day.length == 0 && props.year.length == 0) {
      this.refs.DaysTextInput.focus()
    }
    if(props.day.length == 2 && props.month.length == 2 && props.year.length == 0) {
      this.refs.YearsTextInput.focus()
    }
    return true
  }
  render() {
    var content =

    <View style={[styles.container, {flex: 1}]}>
      { !this.props.excludeIntro &&
        <View style={[styles.inputContainer, {marginTop: -10}]}>
          <Text style={styles.formPretext}>I'm</Text>
          <Text style={styles.formPretext}>{this.props.name}</Text>
        </View>
      }
      <View style={{height: 10}} />
      <Text style={styles.formLabel}>What's your Birthdate?</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.formPretext}>Born</Text>
        <TextInput
          keyboardType='numeric'
          style={[styles.formInput, {width: 60}]}
          autoFocus={true}
          placeholder='MM'
          maxLength={2}
          onChangeText={(text) => this.props.onChangeMonth(text)}/>
        <Text style={[styles.formPretext, {marginRight: 8, color: Colors.fadedGrey}]}>-</Text>
        <TextInput
          keyboardType='numeric'
          ref="DaysTextInput"
          style={[styles.formInput, {width: 60}]}
          placeholder='DD'
          maxLength={2}
          onChangeText={(text) => this.props.onChangeDay(text)}/>
        <Text style={[styles.formPretext, {marginRight: 8, color: Colors.fadedGrey}]}>-</Text>
          <TextInput
            keyboardType='numeric'
            ref="YearsTextInput"
            style={[styles.formInput, {width: 120}]}
            placeholder='YYYY'
            maxLength={4}
            onSubmitEditing={() => this.props.onSubmitEditing()}
            onChangeText={(text) => this.props.onChangeYear(text)}/>
      </View>
    </View>

    return content
  }
}

module.exports = BirthdatePicker

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
})
