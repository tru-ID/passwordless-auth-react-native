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

## Getting Started

In order to follow along with this tutorial headover to the [SIM Card Based Authentication With React Native repo](https://github.com/tru-ID/sim-card-auth-react-native) and follow the detailed steps and head back over here once you're done setting everything up. Your app UI should look like this:

![alt text](./images/ui.jpg 'Starter App')

## Performing the SubscriberCheck Authentication - I

Before we perform any action we need to copy this utility line `axios.defaults.baseURL = 'https://{subdomain}.loca.lt';` into our `app.js` before the `onPressHandlerFunction`, where `{subdomain}` is the local tunnel subdomain created when we run the server in the previous section.

This helper helps keep things DRY so we don't rewrite the same Base URL repeatedly,

Alternatively you could write:

```
axios.create({
    baseURL: 'https://{subdomain}.loca.lt'
})
```

In order to perform the SubscriberCheck Authentication, head over to `app.js` and in the `onPressHandler` function and paste the following lines of code:

```
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
```

First off we set our loading state to `true` and this is necessary so we give the user a visual cue that something (a HTTP network request) is happening. Next, we set construct the body object setting the `phone_number` field to a helper function that helps transform phone numbers by appending the calling code, trimming white-space, handling copy-paste phone numbers etc.

Then, we make a network request to the SubscriberCheck endpoint in order to get back the SubscriberCheck URL (`check_url`) and the `check_id` which we'll use in a future step.

## Updating UI to inform user of an ongoing process

Next, we have to update the UI while `loading` is true in order to let the user know something is happening in the background and also disable the button.
Replace:

```
<Button
            title='Authenticate'
            color='#e67e22'
            onPress={onPressHandler}
          />
```

with:

```
{loading ? (
          <ActivityIndicator size='large' color='#00ff00' />
        ) : (
          <Button
            title='Authenticate'
            color='#e67e22'
            onPress={onPressHandler}
          />
        )}
```

## Performing the SubscriberCheck Authentication - II

The next step is to use the **tru-ID** React Native SDK to perform the `GET` SubscriberCheck request.
The SDK forces mobile data connection and makes a get request to the SubscriberCheck URL (`check_url`) and readies a result. Afterwards you can now make a request to `subscriber-check/{check_id}` and get that result and set loading to false. Add the following lines to `onPressHandler`:

```
//pass the check url into the Tru SDK and perform the GET request to the SubscriberCheck check url
      await TruSDK.openCheckUrl(response.data.check_url);
      //make request to subscriber check endpoint to get the SubscriberCheck result
      const resp = await axios.get(
        `/subscriber-check/${response.data.check_id}`
      );
      console.log(resp.data);
      setData(resp.data);
      setLoading(false);
```

The final code in the `onPressHandler` should be:

```
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
```

# Updating the UI with the result

The last thing we need to do is inform users whether or not there is a match i.e. the phone number is verified and if the SIM has not changed recently. We also need to take care of any errors and let the user know. For that we'll use toast notifications. Paste the following code into `app.js`

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

## Wrapping Up

There you have it, you have successfully integrated **tru-ID's** SubscriberCheck API with your React Native Application.

If you have any questions get in touch via help@tru.id

## Resources

[SubscriberCheck Integration](https://developer.tru.id/docs/subscriber-check/integration)
