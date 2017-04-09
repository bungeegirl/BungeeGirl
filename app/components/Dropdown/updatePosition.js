
import React from 'react';
import ReactNative, { UIManager } from 'react-native';

module.exports = function (ref, debug) {
  const handle = ReactNative.findNodeHandle(ref);
  setTimeout(() => {
    UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
      if (debug) {
      }
      ref._currentPosition(pageX, pageY);
    });
  }, 0);
};
