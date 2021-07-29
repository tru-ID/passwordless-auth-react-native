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
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FlashMessage, {showMessage} from 'react-native-flash-message';

const App = () => {
  // we'll handle SubscriberCheck in the function below
  const onPressHandler = () => {};

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}></SafeAreaView>
      <FlashMessage />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    marginTop: 10,
    width: 0.5 * Dimensions.get('window').width,
    height: 200,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 0.1 * Dimensions.get('window').width,
  },
  paragraph: {
    fontSize: 20,
    marginBottom: 15,
  },
  spinner: {
    marginTop: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1955ff',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#1955ff',
    marginTop: 17,
    width: '40%',
  },
  buttonText: {
    color: '#fff',
  },
  textInput: {
    padding: 15,
    borderRadius: 3,
    backgroundColor: '#fff',
    borderColor: '#858585',
    borderWidth: 0.4,
    elevation: 7,
    shadowColor: '#858585',
    shadowOffset: {width: 0.5, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
    color: '#000',
    width: 0.7 * Dimensions.get('window').width,
  },
});

export default App;
