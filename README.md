# SIM Card Based Mobile Authentication With React Native

## Requirements

- An Android / Apple Phone with a SIM card and mobile data connection
- For iOS: Require XCode >12
- For Android:
  - Require JDK 14 (Java version 14.02 / Gradle v6.3).
  - Android Studio or Android SDK manager via [Android developer downloads](https://developer.android.com/studio). VS Code would work as you aren't using a virtual device.
  - Set up the [React Native Environment](https://reactnative.dev/docs/environment-setup)
- For metro bundler, require node version > 10

## Getting Started

Clone the `starter-files` branch via:

```
git clone -b starter-files --single-branch https://github.com/tru-ID/sim-card-auth-react-native.git
```

To restore dependencies for server, open a new terminal and run:

```bash
yarn yrrs #this also starts the dev server
#or
npm run nrrs #this also starts the dev server
```

To restore dependencies for mobile (React Native), open a new terminal and run:

```bash
yarn yrrm
#or
npm run nrrm
```

Create a [tru.ID Account](https://tru.id)

Install the tru.ID CLI via:

```bash
npm i -g @tru_id/cli
#or
yarn add global @tru_id/cli
```

Input your **tru.ID** credentials which can be found within the tru.ID [console](https://developer.tru.id/console)

Create a new **tru.ID** project within the server directory via:

```
tru projects:create rn-auth
```

This will create a new directory `rn-auth` with a `tru.json` file containing `client_secret` and `client_id` values.

Still in the server directory, run the command `cp .env.example .env` and update the values of `TRU_ID_SECRET` and `TRU_ID_CLIENT` with the `client_secret` and `client_id` values found in the `tru.json` file.

## Starting Project

To start the project, ensure you have a physical device connected (see [Running React Native on a physical device guide](https://reactnative.dev/docs/running-on-device) ) then run:

```bash
yarn android
#or
npm run android
#or
yarn ios
#or
npm run ios
```

## Troubleshooting

While trying to run on Android, you might run into `Could not find or load main class org.gradle.wrapper.GradleWrapperMain` error. To resolve it:

- [Install Gradle](https://gradle.org/install/)
- Navigate to the Android directory and run `gradle wrapper`
- Run `yarn android` or `npm run android`

## References

- [**tru.ID** docs](https://developer.tru.id/docs)
- [Running React Native on a physical device guide](https://reactnative.dev/docs/running-on-device)
- [React Native Environment guide](https://reactnative.dev/docs/environment-setup)

## Meta

Distributed under the MIT License. See [LICENSE](https://github.com/tru-ID/sim-card-auth-react-native/blob/main/LICENSE.md)

[**tru.ID**](https://tru.id)
