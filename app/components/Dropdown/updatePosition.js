const React = require('react-native');

const {
  NativeModules: {
    UIManager
  }
} = React;

module.exports = function (ref, debug) {
  const handle = React.findNodeHandle(ref);
  setTimeout(() => {
    UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
      if (debug) {
      }
      ref._currentPosition(pageX, pageY);
    });
  }, 0);
};
