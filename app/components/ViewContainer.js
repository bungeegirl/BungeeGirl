import React, {
  Component,
  View,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native'

import Colors from '../styles/Colors'

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height

export default class ViewContainer extends Component {

  componentDidMount() {
  }

  render() {
    React.StatusBar.setBarStyle('default')
    if(this.props.statusBarOptions) {
      React.StatusBar.setHidden(true, 'none')
    } else {
      React.StatusBar.setHidden(false, 'slide')
    }

    return (
      <View
        ref="Container"
        style={styles.container}>
        <Image
          source={require('../assets/container-background.png')}
          resizeMode='cover'
          style={styles.backgroundImage}/>
        <View style={{
          height: (this.props.hidden ? 0 : 20),
          backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : Colors.beige}} />
        {this.props.children}
      </View>
    )
  }

  componentWillUnmount() {
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  backgroundImage: {
    position: 'absolute',
    height: deviceHeight,
    width: deviceWidth,
    top: 0,
    left: 0
  }
})
