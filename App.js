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
import LinearGradient from 'react-native-linear-gradient'
 import FlashMessage, {showMessage} from 'react-native-flash-message';
 import axios from 'axios';
 import TruSDK from '@tru_id/tru-sdk-react-native';
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
 
     setData({match: true, no_sim_change: true})
    
    //  const body = {
    //    phone_number: phoneNumber,
    //  };
    //  console.log(body);
    //  // make a request to the SubscriberCheck endpoint to get back the check_url
    //  try {
    //    const response = await axios.post('/subscriber-check', body);
    //    console.log(response.data);
    //    // pass the check url into the Tru SDK and perform the GET request to the SubscriberCheck check url
    //    await TruSDK.openCheckUrl(response.data.check_url);
    //    // make request to subscriber check endpoint to get the SubscriberCheck result
    //    const resp = await axios.get(
    //      `/subscriber-check/${response.data.check_id}`,
    //    );
    //    console.log(resp.data);
    //    setData(resp.data);
    //    setLoading(false);
    //  } catch (e) {
    //    setLoading(false);
    //    setError(e.message);
    //  }
   };
   return (
     <>
       <StatusBar barStyle="light-content" />
       <LinearGradient
      colors={['rgba(25, 85, 255, 40)', 'rgba(10, 10, 50, 66)']}
      useAngle={true}
      angle={0}
      style={{
        flex: 1,
      }}
    >
       <SafeAreaView style={styles.container}>
       <View style={styles.box}>

    
         <Text style={styles.heading}>Enter your phone number</Text>
         <Text style={styles.paragraph}>and we'll handle the rest</Text>
      
           <TextInput
             style={styles.textInput}
             keyboardType="phone-pad"
             placeholder="ex. (415) 555-0100"
             placeholderTextColor="#d3d3d3"
             onChangeText={text => setPhoneNumber(text)}
             value={phoneNumber}
           />
       
         {loading ? (
           <ActivityIndicator style={styles.spinner} size="large" color="#00ff00" />
         ) : (
           <TouchableOpacity onPress={onPressHandler} style={styles.button}>
             <Text style={styles.buttonText}>Authenticate</Text>
           </TouchableOpacity>
         )}
 
         </View>
       </SafeAreaView>
         <FlashMessage />
       </LinearGradient>
     </>
   );
 };
 
 const styles = StyleSheet.create({
   container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   },
   box: {
    width: '90%',
    borderRadius: 3,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0.5, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 0.7 * Dimensions.get('window').height,
    padding: 15,
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
    marginBottom: 15
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
    shadowOffset: { width: 0.5, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    color: '#000',
    width: 0.7 * Dimensions.get('window').width,
   },
 });
 
 export default App;
 