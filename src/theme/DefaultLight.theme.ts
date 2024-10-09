import {ColorTheme, Theme} from './Theme.type';

const DEFAULT_LIGHT_COLOR_THEME: ColorTheme = {
  primary: '#fff',
  black: '#000',
  blueLight: '#FF7312',
  darkBlue: '#FF7312',
  accent: '#182452',
  secondary: 'rgba(255, 246, 240, 1)',
  grey: '#DBDBDB',
  disabled: '#868686',
  greyText: '#D9D9D9',
  red: '#C11919',
  backgroundWhite: '#FAFAFA',
  lightGrey: '#F2F2F2',
  strokeLight: '#EDEDED',
  orange_light: '#FFF2E8',
  accentLighter: '#FFF6EF',
  green: '#469C73',
  purple: '#FFF6F0',
  blue: '#1985C1',
  greenLight: '#E7FFF4',
  skelton: '#e7f0f4',
  redLight: '#FFF4F4',
  yellowLight: '#FFFAEA',
  ternary: '#FFF6F0',
  skyBlueLight: '#F6FCFF',
  disabledLight: '#F4F4F4',
  yellow: '#FBC505',
  shadow: 'rgba(18, 18, 18, 0.12)',
  textPrimary: '#121212',
};
export const DEFAULT_LIGHT_THEME_ID = 'default-light';

export const DEFAULT_LIGHT_THEME: Theme = {
  id: DEFAULT_LIGHT_THEME_ID,
  color: DEFAULT_LIGHT_COLOR_THEME,
};
