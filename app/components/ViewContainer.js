'use strict';

var React = require("react-native")
var { View, Dimensions, Image } = React

var deviceWidth = Dimensions.get('window').width
var deviceHeight = Dimensions.get('window').height

var ViewContainer = React.createClass({

  componentDidMount: function() {
  },

  render: function() {
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
          resizeMode='contain'
          style={styles.backgroundImage}/>
        <View style={{
          height: (this.props.hidden ? 0 : 20),
          backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : 'white'}} />
        {this.props.children}
      </View>
    )
  },

  componentWillUnmount: function() {
  },

})

var styles = React.StyleSheet.create({
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

module.exports = ViewContainer
