import {Theme, ColorTheme} from './Theme.type';

const DEFAULT_DARK_COLOR_THEME: ColorTheme = {
  primary: '#fff',
  black: '#000',
  blueLight: '#182452',
  darkBlue: '#0A1233',
  accent: '#FF7312',
  secondary: '#CCD4F2',
  grey: '#DBDBDB',
  greyText: '#D9D9D9',
  strokeLight: '#EDEDED',
  orange_light: '#FFF2E8',
  lightGrey: '#F2F2F2',
  backgroundWhite: '#FAFAFA',
  disabled: '#868686',
  accentLighter: '#FFF6EF',
  red: '#C11919',
  green: '#469C73',
  greenLight: '#E7FFF4',
  redLight: '#FFF4F4',
  skelton: '#e7f0f4',
  ternary: '#F1F4FF',
  yellowLight: '#FFFAEA',
  disabledLight: '#F4F4F4',
  blue: '#1985C1',
  skyBlueLight: '#F6FCFF',
  yellow: '#FBC505',
  purple: '#E6EBFF',
  textPrimary: '#121212',
  shadow: 'rgba(18, 18, 18, 0.12)',
};

export const DEFAULT_DARK_THEME_ID = 'default-dark';

export const DEFAULT_DARK_THEME: Theme = {
  id: DEFAULT_DARK_THEME_ID,
  color: DEFAULT_DARK_COLOR_THEME,
};
