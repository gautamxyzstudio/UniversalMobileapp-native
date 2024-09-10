/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import {enGB, registerTranslation} from 'react-native-paper-dates';
registerTranslation('en', enGB);
AppRegistry.registerComponent(appName, () => App);
