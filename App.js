/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TextInput,
  Button,
} from 'react-native';
import { Dimensions } from 'react-native';
import FlashMessage, { showMessage } from 'react-native-flash-message';

const App = () => {
  // we'll handle SubscriberCheck in the function below
  const onPressHandler = () => {};

  return (
    <>
      <StatusBar barStyle='light-content' />
      <SafeAreaView style={styles.container}>
        <FlashMessage />
      </SafeAreaView>
    </>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10,
  },
  heading: {
    fontSize: 0.1 * Dimensions.get('window').width,
    fontFamily: 'NotoSansJP-Bold',
  },
  paragraph: {
    fontSize: 20,
    fontFamily: 'NotoSansJP-Regular',
  },
  form: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  textInput: {
    padding: 15,
    borderColor: '#20232a',
    borderWidth: 3,
    elevation: 7,
    height: 50,
    backgroundColor: '#fff',
    fontFamily: 'inherit',
  },
});

export default App;
