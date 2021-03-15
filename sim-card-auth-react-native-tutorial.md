# SIM Card Based Mobile Authentication with React Native

In this tutorial you're going to learn how to authenticate your React Native applications using the [tru.ID SubscriberCheck API](https://developer.tru.id/docs/subscriber-check). Before we begin let's talk about why you would want to secure your applications with the **tru.ID** SubscriberCheck API.

## The **tru.ID** SubscriberCheck API

The **tru.ID** SubscriberCheck API confirms the ownership of a mobile phone number by verifying the possession of an active SIM card with the same number. It also provides a flag that indicates if the SIM card associated with the mobile phone number has changed within the last seven days.

All your a user needs to do is provide a phone number and the API will verify that number is associated with their device. It can be used as a primary user verification mechanism or as an added layer of security against SIM swapping / theft within existing 2FA workflows. In this tutorial we'll use SubscriberCheck as a standalone authentication mechanism.

The SubscriberCheck workflow is as follows:

1. Get the User's Phone Number on the Mobile Device
2. Send the Phone Number the Application Server
3. Create a SubscriberCheck using the SubscriberCheck API
4. Return the SubscriberCheck URL to the Mobile Device
5. Request the SubscriberCheck URL on the Mobile Device over Mobile Data
6. Mobile Device requests the SubscriberCheck Result via the Application Server
7. Application Server gets the SubscriberCheck Result from SubscriberCheck API
8. Application Server returns the SubscriberCheck Result, including SIM changed status, to the Mobile Device

In this tutorial we'll use a ready-made server and focus on the steps involving the React Native application.

## Before you begin

Before you begin, there are a few requirements that have to be met:

- An Android / Apple Phone with a SIM card and mobile data connection
- For iOS: XCode >12
- For Android:
  - JDK 14 (Java version 14.02 / Gradle v6.3).
  - Android Studio or Android SDK manager via [Android developer downloads](https://developer.android.com/studio). VS Code would work as you aren't using a virtual device.
  - Set up the [React Native Environment](https://reactnative.dev/docs/environment-setup)
- For metro bundler, Node.js version > 10

## Get setup with **tru.ID**

Sign up for a [**tru.ID** account](https://developer.tru.id/signup) which comes with some free credit. Then install the [**tru.ID** CLI](https://github.com/tru-ID/cli):

```bash
$ npm install -g @tru_id/cli
```

Run `tru setup:credentials` using the credentials from the [**tru.ID** console](https://developer.tru.id/console):

```bash
$ tru setup:credentials {client_id} {client_secret} {data_residency}
```

Install the CLI [development server plugin](https://github.com/tru-ID/cli-plugin-dev-server):

```bash
$ tru plugins:install @tru_id/cli-plugin-dev-server@canary
```

Create a new **tru.ID** project:

```bash
$ tru projects:create rn-auth
```

This will save a `tru.json` **tru.ID** project configuration to `./rn-auth/tru.json`.

Run the development server, pointing it to the directly containing the newly created project configuration. This will also open up a localtunnel to your development server making it publicly accessible to the Internet so that your mobile phone can access it when only connected to mobile data.

```bash
$ tru server -t --project-dir ./rn-auth
```

Open up the URL that is shown in the terminal, which will be in the format `https://{subdomain}.loca.lt`, in your desktop web browser to check that it is accessible.

With the development server setup we can move on to building the React Native application.

## Getting Started

In order to follow along with this tutorial headover to the [SIM Card Based Authentication With React Native repo](https://github.com/tru-ID/sim-card-auth-react-native) and clone the starter-files branch via:

```bash
git clone -b starter-files --single-branch https://github.com/tru-ID/sim-card-auth-react-native.git
```

To install dependencies, open a new terminal, `cd sim-card-auth-react-native` and run:

**TODO: feels like this should just be `npm install` now since we only have one application. I've moved the contents of `mobile` up. Let's see how it goes.**

```bash
npm install
```

Once you've finished that step, start the development server via:

```bash
npm run android
#or
npm run ios
```

Your app should look like this:

![alt text](./images/starter.jpg 'Starter App')

## Get the user's phone number on Mobile Device

Let's start by adding the UI and statement management required for the user to input (`TextInput`) and submit their phone number (`Button`). We'll also add UI and state for checking if any work is in progress via a `loading` variable or if an error has occurred via `error`.

```js
const App = () => {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

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
  const onPressHandler = () => {};

  return (
    <>
     <StatusBar barStyle='light-content' />
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Enter your phone number</Text>
        <Text style={styles.paragraph}>and we'll handle the rest</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.textInput}
            keyboardType='phone-pad'
            placeholder='ex. (415) 555-0100'
            placeholderTextColor='#d3d3d3'
            onChangeText={(text) => setPhoneNumber(text)}
            value={phoneNumber}
          />
        </View>
        {loading ? (
          <ActivityIndicator size='large' color='#00ff00' />
        ) : (
          <Button
            title='Authenticate'
            color='#e67e22'
            onPress={onPressHandler}
          />
        )}

        <FlashMessage />
      </SafeAreaView>
    </>
  )
};
```

Your app should now look like this:

![alt text](./images/step1.jpg 'Step1')

The user will being the SubscriberCheck Authentication by clicking the `Button`. So, we need to set the loading state and create the payload to submit to the server. We do this within the `onPressHandler` function:

```
const onPressHandler = () => {
  setLoading(true);
  const body = {
    phone_number:  phoneNumber,
  };
  console.log(body);
};
```

The loading state to `true` to give the user a visual cue that work (a HTTP network request) is in progress via our loading indicator. Next, we construct the body object setting the `phone_number` field to the `phoneNumber`.

## Create a SubscriberCheck using the SubscriberCheck API

With our body request payload ready we're ready to make requests to our server. First, let's import and setup Axios to know where our development server is:

```js
import FlashMessage, { showMessage } from 'react-native-flash-message';

import axios from 'axios';
axios.defaults.baseURL = 'https://jolly-dolphin-30.loca.lt';
```

Then update the `onPressHandler` to make a request to create a SubscriberCheck:

```js
const onPressHandler = () => {
  setLoading(true);
  const body = {
    phone_number: phoneNumber,
  };
  console.log(body);
  
  try {
    const response = await axios.post('/subscriber-check', body);
    console.log(response.data);
  }
  catch (e) {
    setLoading(false);
    setError(e.message);
  }
}
```

Here, we make a network request to the SubscriberCheck endpoint in order to get back the SubscriberCheck URL (`check_url`) and the `check_id` which we'll use in a future step.

**TODO: <----------------reviewed to here -------------->**

## Request the SubscriberCheck URL on the Mobile Device over Mobile Data

The next step is requesting the SubscriberCheck URL on mobile device over mobile data and for this we'll use the **tru-ID** [React Native SDK](https://github.com/tru-ID/tru-sdk-react-native).

The first step is to install it via:

```
npm install tru-sdk-react-native
```

Afterwards we add it to our list of imports at the top:

```
...
import TruSDK from 'tru-sdk-react-native'
```

The **tru-ID** React Native SDK forces mobile data connection and makes a get request to the SubscriberCheck URL (`check_url`) and readies a result.
Add the following lines in `onPressHandler` below `console.log(response.data)`

```
const onPressHandler = () => {
...
//pass the check url into the Tru SDK and perform the GET request to the SubscriberCheck check url
await TruSDK.openCheckUrl(response.data.check_url);
}
```

The code in the `onPressHandler` thus far is:

```
const onPressHandler = () => {
   setLoading(true);
    const body = {
      phone_number:  phoneNumber,
    };
    console.log(body);
    //make a request to the SubscriberCheck endpoint to get back the check_url
    try {
      const response = await axios.post('/subscriber-check', body);
      console.log(response.data);
      //pass the check url into the Tru SDK and perform the GET request to the SubscriberCheck check url
await TruSDK.openCheckUrl(response.data.check_url);

    } catch (e) {
      setLoading(false);
      setError(e.message);
    }
}
```

## Mobile Device requests SubscriberCheck Result via the Application Server

We can now make a request to `subscriber-check/{check_id}` and get that result and save it to state and set loading to `false`. Add the following lines to `onPressHandler` below `await TruSDK.openCheckUrl(response.data.check_url)`

```
const onPressHandler = () => {
  ...
     // make request to subscriber check endpoint to get the SubscriberCheck result
      const resp = await axios.get(
        `/subscriber-check/${response.data.check_id}`
      );
      console.log(resp.data);
      setData(resp.data);
      setLoading(false);
}
```

The final code in the `onPressHandler` should be:

```
const onPressHandler = () => {
setLoading(true);
const body = {
phone_number: phoneNumber,
};
console.log(body);
//make a request to the SubscriberCheck endpoint to get back the check_url
try {
const response = await axios.post('/subscriber-check', body);
console.log(response.data);
//pass the check url into the Tru SDK and perform the GET request to the SubscriberCheck check url
await TruSDK.openCheckUrl(response.data.check_url);
//make request to subscriber check endpoint to get the SubscriberCheck result
const resp = await axios.get(
`/subscriber-check/${response.data.check_id}`
);
console.log(resp.data);
setData(resp.data);
setLoading(false);
} catch (e) {
setLoading(false);
setError(e.message);
}
}
```

Your app UI while initiating the SubscriberCheck, using the **tru-ID** React Native SDK and requesting results will look like this:

![alt text](./images/loading.jpg 'loading state')

# Updating the UI with the result

The last thing we need to do is inform users whether or not there is a match i.e. the phone number is verified and if the SIM has not changed recently. We also need to take care of any errors and let the user know. For that we'll use toast notifications. Paste the following code into `app.js` before `onPressHandler`

```

//check if there is a match i.e. phone number has been verified and no_sim_change and render toast UI
React.useEffect(() => {
  if (data) {
    data.match && data.no_sim_change
    ? showMessage({
      message: 'Phone Verified',
      type: 'success',
      style: styles.toastContainer,
    })
    : showMessage({
        message: 'Verification failed. Please Try Again Later',
        type: 'danger',
        style: styles.toastContainer,
      });
    }
  }, [data]);

//render toast UI if there's an error
React.useEffect(() => {
  if (error) {
    showMessage({
      message: error,
      type: 'danger',
      style: styles.toastContainer,
    });
  }
}, [error]);

```

Above we have two `React.useEffect` functions. In the first function, we add `data` as a dependency so whenever `data` changes the effect re-runs. Inside the effect we check if we have data and subsequently check if we have a match and if the SIM has not changed. If that's true we render a toast UI with a `Phone Verfied` message (this can be anything you want). Else, we render a toast UI with a `Verification failed. Please Try Again Later` message.

In the second function we add `error` as a dependency so whenever `error` changes the effect re-runs. Inside the effect we check if we have an error and render a toast UI with the error message.

Your UI if the SubscriberCheck is successful should look like this:

![alt text](./images/success.jpg 'Successful authentication')

## Wrapping Up

There you have it, you have successfully integrated **tru-ID's** SubscriberCheck API with your React Native Application.

If you have any questions get in touch via help@tru.id

## Resources

[SubscriberCheck Integration](https://developer.tru.id/docs/subscriber-check/integration)

```

```
