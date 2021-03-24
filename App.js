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
  Dimensions,
} from 'react-native';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import axios from 'axios';
import TruSDK from 'tru-sdk-react-native';
const App = () => {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [data, setData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  // setup axios BaseURL in the format : https://{subdomain}.loca.lt
  axios.defaults.baseURL = 'https://{subdomain}.loca.lt';

  // check if there is a match i.e. phone number has been verified and no_sim_change and render toast UI
  React.useEffect(() => {
    if (data) {
      data.match && data.no_sim_change
        ? showMessage({
            message: 'Phone Verified',
            type: 'success',
            style: styles.toastContainer,
          })
        : showMessage({
            message: 'Verification failed',
            type: 'danger',
            style: styles.toastContainer,
          });
    }
  }, [data]);
  // render toast UI if there's an error
  React.useEffect(() => {
    if (error) {
      showMessage({
        message: error,
        type: 'danger',
        style: styles.toastContainer,
      });
    }
  }, [error]);
  // we'll handle SubscriberCheck in the function below
  const onPressHandler = async () => {
    setLoading(true);
    const body = {
      phone_number: phoneNumber,
    };
    console.log(body);
    // make a request to the SubscriberCheck endpoint to get back the check_url
    try {
      const response = await axios.post('/subscriber-check', body);
      console.log(response.data);
      // pass the check url into the Tru SDK and perform the GET request to the SubscriberCheck check url
      await TruSDK.openCheckUrl(response.data.check_url);
      // make request to subscriber check endpoint to get the SubscriberCheck result
      const resp = await axios.get(
        `/subscriber-check/${response.data.check_id}`,
      );
      console.log(resp.data);
      setData(resp.data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setError(e.message);
    }
  };
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Enter your phone number</Text>
        <Text style={styles.paragraph}>and we'll handle the rest</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.textInput}
            keyboardType="phone-pad"
            placeholder="ex. (415) 555-0100"
            placeholderTextColor="#d3d3d3"
            onChangeText={text => setPhoneNumber(text)}
            value={phoneNumber}
          />
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          <TouchableOpacity onPress={onPressHandler} style={styles.button}>
            <Text style={styles.buttonText}>Authenticate</Text>
          </TouchableOpacity>
        )}

        <FlashMessage />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#FFFFFF',
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
  },
  form: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e67e22',
    color: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: '#ffffff',
  },
  textInput: {
    padding: 15,
    borderColor: '#20232a',
    borderWidth: 3,
    elevation: 7,
    height: 50,
    backgroundColor: '#fff',
  },
});

export default App;
