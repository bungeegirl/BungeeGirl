'use strict';

var React = require("react-native")
var { View } = React;

var TopNavBar = React.createClass({

  render: function() {
    return (
      <View
        ref="NavBar"
        style={styles.container}>
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
  }
})

module.exports = TopNavBar
