
import React, {
  Component,
  StyleSheet,
  Text,
  Image,
  TextInput,
  NativeModules,
  ScrollView,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions
} from 'react-native'

import ViewContainer from '../components/ViewContainer'
import Colors from '../styles/Colors'
import NavigationBar from 'react-native-navbar'
import questions from '../local_data/questions'
import _ from 'underscore'

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height

class QuestionScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      questionIndex: 0,
    }
    this.answers = []
  }

  render() {
    var leftButton
    var titleText
    if(this.state.questionIndex > 0) {
      leftButton =
      <TouchableOpacity
        onPress={() => this.setState({questionIndex: this.state.questionIndex - 1})}
        style={styles.backButton}>
        <Image
          source={require('../assets/Nav-Back.png')}/>
       </TouchableOpacity>
    } else {
      leftButton = <View />
    }
    var mainContent
    if(this.state.questionIndex < questions.questions.length) {
      mainContent = this._renderQuestions()
      titleText = questions.questions[this.state.questionIndex].theme
    } else {
      mainContent = this._renderProfile()
      titleText = 'Your Travel Profile'
    }
    var title = <Text style={[styles.titleText, {marginBottom: 4}]}>{titleText}</Text>
    var content =
    <ViewContainer backgroundColor={Colors.beige}>
      <NavigationBar
        style={{backgroundColor: Colors.beige, marginTop: -20, alignItems: 'center', borderBottomWidth: 1, borderColor: '#BEBEBE'}}
        leftButton={leftButton}
        title={title}/>
      {mainContent}
    </ViewContainer>
    return content
  }

  _renderQuestions() {
    var content
    var circles = []
    var buttons = []
    _.map(questions.questions, (question, index) => {
      var circle = this._renderProgressCircle(index)
      circles.push(circle)
    })
    _.map(questions.questions[this.state.questionIndex].answers, (question, index) => {
      var button = this._renderButton(index)
      buttons.push(button)
    })
    content =
    <View style={styles.contentContainer}>
      <View style={styles.circlesContainer}>
        {circles}
      </View>
      <Text style={{fontSize: 26}}>{questions.questions[this.state.questionIndex].question}</Text>
      <View style={{flex: 1}} />
      {buttons}
    </View>

    return content
  }

  _renderProgressCircle(index) {
    var circle
    var circleBackground
    var circleText
    if(this.state.questionIndex == index) {
      circleBackground = Colors.lightBlue
      circleText = Colors.beige
    } else {
      circleBackground = Colors.beige
      circleText = Colors.lightBlue
    }
    circle =
    <View
      key={`circle${index}`}
      style={[styles.circle, {backgroundColor: circleBackground}]}>
      <Text style={[styles.circleText, {color: circleText}]}>{index + 1}</Text>
    </View>
    return circle
  }

  _renderButton(answerIndex) {
    var content
    var questionIndex = this.state.questionIndex
    content =
    <TouchableOpacity
      key={`button${answerIndex}`}
      onPress={() => {
        this.answers[questionIndex] = answerIndex
        this.setState({questionIndex: questionIndex + 1})
      }}
      style={styles.buttonContainer}>
      <Text style={{fontSize: 16, color: Colors.beige}}>{questions.questions[questionIndex].answers[answerIndex]}</Text>
    </TouchableOpacity>
    return content
  }

  _renderProfile() {
    var frequencies =  _.pairs(_.countBy(this.answers, (answer) => { return answer}))
    var maxIndex = parseInt(_.max(frequencies, (touple) => { return touple[1] })[0])
    var content =
    <View style={styles.contentContainer}>
      <Text style={styles.profileHeader}>I'm a {questions.travelProfiles[maxIndex].title}</Text>
      <Text
        style={styles.profileText}>{questions.travelProfiles[maxIndex].text}</Text>
    </View>
    return content
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'stretch',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 4,
    backgroundColor: Colors.mediumBlue,
    marginBottom: 20,
  },
  circlesContainer: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle: {
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.lightBlue
  },
  circleText: {
    fontSize: 18,
    color: Colors.beige
  },
  profileHeader: {
    fontSize: 32,
    marginBottom: 20,
  },
  profileText: {
    fontSize: 18
  }
})

module.exports = QuestionScreen
