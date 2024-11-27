import {LogBox, StatusBar, StyleSheet, View} from 'react-native';
import React from 'react';

import {Provider} from 'react-redux';
import store, {persistor} from 'src/api/store';
import {PersistGate} from 'redux-persist/integration/react';
import {DefaultTheme, PaperProvider} from 'react-native-paper';
import {useTheme} from '@theme/Theme.context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import RootNavigator from 'src/navigator/rootNavigator';
import LoaderWrapper from '@wrappers/loaderWrapper';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {ToastProvider} from 'react-native-toast-notifications';
import CustomToast from '@components/organisms/customToast';
import {PortalProvider} from '@gorhom/portal';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {addEventListener} from '@react-native-community/netinfo';
const App = () => {
  const {theme} = useTheme();

  // Subscribe
  const unsubscribe = addEventListener(state => {
    console.log('Connection type', state.type);
    console.log('Is connected?', state.isConnected);
  });

  // Unsubscribe
  unsubscribe();

  console.log(process.env.BASE_URL);

  const paperTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      error: '#C11919',
      text: 'red',
      accent: 'blue',
      primary: theme.color.blueLight,
      backdrop: 'red',
      disabled: 'pink',
      surface: theme.color.primary,
      primaryContainer: theme.color.ternary,
      onPrimaryContainer: theme.color.blueLight,
      onSurface: theme.color.disabled,
      surfaceVariant: theme.color.lightGrey,
    },
    elevation: {
      level0: '0',
      level1: '1',
      level2: '2',
      level3: '3',
      level4: '4',
      level5: '5',
    },
  };

  LogBox.ignoreLogs([
    'Tried to modify key `reduceMotion` of an object which has been already passed to a worklet.',
  ]);

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <View style={styles.container}>
          <Provider store={store}>
            <PortalProvider>
              <KeyboardProvider>
                <PersistGate loading={null} persistor={persistor}>
                  <ToastProvider
                    placement="bottom"
                    duration={3000}
                    animationType="zoom-in"
                    renderToast={toast => <CustomToast toast={toast} />}
                    swipeEnabled>
                    <PaperProvider theme={paperTheme}>
                      <LoaderWrapper>
                        <RootNavigator />
                      </LoaderWrapper>
                    </PaperProvider>
                  </ToastProvider>
                </PersistGate>
              </KeyboardProvider>
            </PortalProvider>
          </Provider>
        </View>
        <StatusBar translucent={true} backgroundColor="transparent" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
