# SIM Card Based Mobile Authentication With React Native

In today's tutorial you're going to learn how to authenticate your React Native applications with the [tru-ID SubscriberCheck API](https://developer.tru.id/docs/subscriber-check). Before we begin let's talk about why you would want to secure your applications with the **tru-ID** SubscriberCheck API.

## The tru-ID SubscriberCheck API

The **tru-ID** SubscriberCheck API confirms the ownership of a mobile phone number by verifying the possession of an active SIM card with the same number. It also provides a flag that indicates if the SIM card associated with the mobile phone number has changed within the last seven days.

All your users need to do is provide a phone number and the API will authenticate against that number.

It's perfect for your applications as it adds an extra layer of security against SIM swapping / theft and can be used to augment existing 2FA workflows or as standalone authentication as we'll use in this tutorial.

The SubscriberCheck workflow is as follows:

1. Get the User's Phone Number on Mobile Device
2. Send the Phone Number the Application Server
3. Create a SubscriberCheck using the SubscriberCheck API
4. Return the SubscriberCheck URL to the Mobile Device
5. Request the SubscriberCheck URL on the Mobile Device over Mobile Data
6. Mobile Device requests SubscriberCheck Result via the Application Server
7. Application Server gets SubscriberCheck Result from SubscriberCheck API
8. Application Server returns the SubscriberCheck Result, including SIM changed status, to the Mobile Device

## Before you begin

Before you begin, there are a few requirements that have to be met:

- An Android / Apple Phone with a SIM card and mobile data connection
- For iOS: Require XCode >12
- For Android:
  - Require JDK 14 (Java version 14.02 / Gradle v6.3).
  - Android Studio or Android SDK manager via [Android developer downloads](https://developer.android.com/studio). VS Code would work as you aren't using a virtual device.
  - Set up the [React Native Environment](https://reactnative.dev/docs/environment-setup)
- For metro bundler, require node version > 10

## Get setup with tru-ID

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

To restore dependencies, open a new terminal and run:

```
npm run restore-mobile
```

Once you've finished that step, start the development server via:

```bash
npm run android
#or
npm run ios
```

Throughout this tutorial we'll be working in `mobile/app.js`.

Your app should look like this:

![alt text](./images/starter.jpg 'Starter App')

## Get the user's phone number on Mobile Device

Before we perform any action we need to setup Axios to know where our development server is running. Set this up in `mobile/App.js` before the `onPressHandler`.

```
import axios from 'axios';

const App = () => {

    axios.defaults.baseURL = 'https://{subdomain}.loca.lt';
    // where {subdomain} is the subdomain of the localtunnel URL

    const onPressHandler = () => {};
};
```

This helper helps keep things DRY so we don't rewrite the same Base URL repeatedly.

The next step is to keep track of state we'll need throughout this application. We'll do this above our utility.

```
const App = () => {
const [phoneNumber, setPhoneNumber] = React.useState('');
  const [data, setData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  axios.defaults.baseURL = 'https://{subdomain}.loca.lt';

    const onPressHandler = () => {};
};
```

After that we have to update the mobile UI to include the `TextInput` where the user inputs an E.164 formatted phone number e.g. `447700900000` or `14155550100` , `Button` components and inform the user there is an ongoing background process.
Paste the following code:

```
const App = ()=> {
  ...
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
}
```

Your app should now look like this:

![alt text](./images/step1.jpg 'Step1 App')

In order to perform the SubscriberCheck Authentication, in the `onPressHandler` function and paste the following lines of code:

```
const onPressHandler = () => {
   setLoading(true);
    const body = {
      phone_number: transformPhoneNumber(callingCode, phoneNumber),
    };
    console.log(body);
}
```

First off we set our loading state to `true` and this is necessary so we give the user a visual cue that something (a HTTP network request) is happening via our loading indicator. Next, we set construct the body object setting the `phone_number` field to the `phoneNumber`

## Create a SubscriberCheck using the SubscriberCheck API

In order to do this, in our `onPressHandler` under our `console.log` statement we paste the following code:

```
const onPressHandler = () => {
  ...
    //make a request to the SubscriberCheck endpoint to get back the check_url
    try {
      const response = await axios.post('/subscriber-check', body);
      console.log(response.data);

    } catch (e) {
      setLoading(false);
      setError(e.message);
    }
}
```

The code in the `onPressHandler` thus far is:

```
const onPressHandler = () => {
   setLoading(true);
    const body = {
      phone_number: transformPhoneNumber(callingCode, phoneNumber),
    };
    console.log(body);
    //make a request to the SubscriberCheck endpoint to get back the check_url
    try {
      const response = await axios.post('/subscriber-check', body);
      console.log(response.data);

    } catch (e) {
      setLoading(false);
      setError(e.message);
    }
}
```

Here, we make a network request to the SubscriberCheck endpoint in order to get back the SubscriberCheck URL (`check_url`) and the `check_id` which we'll use in a future step.

## Request the SubscriberCheck URL on the Mobile Device over Mobile Data

The next step is requesting the SubscriberCheck URL on mobile device over mobile data and for this we'll use the **tru-ID** [React Native SDK](https://github.com/tru-ID/tru-sdk-react-native).

The first step is to install it via:

```
npm install tru-sdk-react-native
```

Afterwards we add it to our list of imports at the top:

```
...
import TruSDK from 'tru-sdk-react-native
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
      phone_number: transformPhoneNumber(callingCode, phoneNumber),
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
phone_number: transformPhoneNumber(callingCode, phoneNumber),
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

## Wrapping Up

There you have it, you have successfully integrated **tru-ID's** SubscriberCheck API with your React Native Application.

If you have any questions get in touch via help@tru.id

## Resources

[SubscriberCheck Integration](https://developer.tru.id/docs/subscriber-check/integration)

```

```
