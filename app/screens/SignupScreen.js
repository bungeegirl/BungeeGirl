
import React, {
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native'

import ViewContainer from '../components/ViewContainer'

class SignupScreen extends Component {

  render() {
    return (
      <ViewContainer>
        <View style={{flex:1, backgroundColor: 'red'}}/>
      </ViewContainer>
    )
  }
}

module.exports = SignupScreen
