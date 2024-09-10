import {ColorTheme, Theme} from './Theme.type';

const DEFAULT_LIGHT_COLOR_THEME: ColorTheme = {
  primary: '#fff',
  black: '#000',
  blueLight: '#182452',
  darkBlue: '#0A1233',
  accent: '#FF7312',
  secondary: '#CCD4F2',
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
  purple: '#E6EBFF',
  blue: '#1985C1',
  greenLight: '#E7FFF4',
  skelton: '#e7f0f4',
  redLight: '#FFF4F4',
  yellowLight: '#FFFAEA',
  ternary: '#F1F4FF',
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
