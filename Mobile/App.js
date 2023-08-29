import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MyStack from './src/Navigation/Stack';

const App = () => {
  return (
    <NavigationContainer>
     <MyStack />
    </NavigationContainer>
  );
};

export default App;