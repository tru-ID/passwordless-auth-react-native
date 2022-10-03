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
  Image,
} from 'react-native';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import TruSdkReactNative from '@tru_id/tru-sdk-react-native'

import axios from 'axios'
axios.defaults.baseURL = 'https://{subdomain}.loca.lt'

const App = () => {
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [data, setData] = React.useState(null)

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

          })
    }
  }, [data])

  React.useEffect(() => {
    if (error) {
      showMessage({
        message: error,
        type: 'danger',
        style: styles.toastContainer,
      })
    }
  }, [error])

  // we'll handle SubscriberCheck in the function below
  const onPressHandler = async () => {
    setLoading(true)
    const body = {
      phone_number: phoneNumber,
    }
    console.log(body)

    try {
      const response = await axios.post('/v0.2/subscriber-check', body)
      console.log(response.data)

      const checkResponse = await TruSdkReactNative.openWithDataCellular(
        response.data.check_url
      );
  
      console.log('check_url request compeleted')

      if ('error' in checkResponse) {
        console.log(`Error in openWithDataCellular: ${checkResponse.error_description}`)
        setLoading(false)
        showMessage({
          message: 'Verification failed',
          type: 'danger',
          style: styles.toastContainer,
        })
      } else if ('http_status' in checkResponse) {
        const httpStatus = checkResponse.http_status
      
        if (httpStatus === 200 && checkResponse.response_body !== undefined) {
          console.log(`Requesting PhoneCheck URL`)
      
          if ('error' in checkResponse.response_body) {
            const body = checkResponse.response_body
            console.log(`Error: ${body.error_description}`)
            showMessage({
              message: `Verification failed: ${body.error_description}`,
              type: 'danger',
              style: styles.toastContainer,
            })
          } else {
            const body = checkResponse.response_body
      
            try {
              const checkStatusRes = await axios.post('/v0.2/subscriber-check/exchange-code', { check_id: body.check_id, code: body.code })
      
              console.log('[CHECK RESULT]:', checkStatusRes.data)
      
              setData(checkStatusRes.data)
              setLoading(false)
            } catch (error) {
              showMessage({
                message: `Error retrieving check result: ${error.message}`,
                type: 'danger',
                style: styles.toastContainer,
              })
      
              return;
            }
          }
        } else {
          const body = resp.response_body;
          showMessage({
            message: `Error: ${body.detail}`,
            type: 'danger',
            style: styles.toastContainer,
          })
        }
      }
    } catch (e) {
      setLoading(false)
      setError(e.message)
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <Image style={styles.logo} source={require('./images/tru-logo.png')} />
        <Text style={styles.heading}>Enter your phone number</Text>
        <Text style={styles.paragraph}>and we'll handle the rest</Text>
        <View style={styles.center}>
          <TextInput
            style={styles.textInput}
            keyboardType="phone-pad"
            placeholder="ex. (415) 555-0100"
            placeholderTextColor="#d3d3d3"
            onChangeText={(text) => setPhoneNumber(text)}
            value={phoneNumber}
          />

          {loading ? (
            <ActivityIndicator
              style={styles.spinner}
              size="large"
              color="#00ff00"
            />
          ) : (
            <TouchableOpacity onPress={onPressHandler} style={styles.button}>
              <Text style={styles.buttonText}>Authenticate</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
      <FlashMessage />
    </>
  )
}

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
