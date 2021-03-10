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
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { Dimensions } from 'react-native';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import useCountryCodes from './libs/hooks/useCountryCodes';
const App = () => {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [countryCode, setCountryCode] = React.useState('');
  const [data, setData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const callingCode = useCountryCodes();

  // we'll handle SubscriberCheck in the function below
  const onPressHandler = () => {};
  return (
    <>
      <StatusBar barStyle='light-content' />
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Enter your phone number</Text>
        <Text style={styles.paragraph}>and we'll handle the rest</Text>
        <View style={styles.form}>
          <Picker
            selectedValue={countryCode}
            style={{ height: 50, width: 100, fontFamily: 'noto-reg' }}
            onValueChange={(itemValue) => setCountryCode(itemValue)}
          >
            <Picker.Item label='Select Country Code' value='' />
            {callingCode.map((el, i) => (
              <Picker.Item
                key={i}
                label={`${el.country_code} ${el.calling_code}`}
                value={el.calling_code}
              />
            ))}
          </Picker>
          <TextInput
            style={styles.textInput}
            keyboardType='phone-pad'
            placeholder='ex. (415) 555-0100'
            placeholderTextColor='#d3d3d3'
            onChangeText={(text) => setPhoneNumber(text)}
            value={phoneNumber}
          />
        </View>
        <TouchableWithoutFeedback
          style={{ alignItems: 'center' }}
          onPress={onPressHandler}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>Authenticate</Text>
          </View>
        </TouchableWithoutFeedback>
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
    flexDirection: 'row',
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

  button: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#e67e22',
    borderRadius: 8,
    width: 0.6 * Dimensions.get('window').width,
    // cursor: 'pointer',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'NotoSansJP-Regular',
  },
});

export default App;
