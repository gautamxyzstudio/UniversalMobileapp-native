import {Theme, ColorTheme} from './Theme.type';

const DEFAULT_DARK_COLOR_THEME: ColorTheme = {
  primary: '#fff',
  black: '#000',
  blueLight: '#FF7312',
  darkBlue: '#FF7312',
  accent: '#182452',
  secondary: 'rgba(255, 246, 240, 1)',
  grey: '#DBDBDB',
  greyText: '#D9D9D9',
  strokeLight: '#EDEDED',
  orange_light: '#FFF2E8',
  lightGrey: '#F2F2F2',
  backgroundWhite: '#FAFAFA',
  disabled: '#868686',
  accentLighter: '#F5F7FF',
  red: '#C11919',
  green: '#469C73',
  greenLight: '#E7FFF4',
  redLight: '#FFF4F4',
  skelton: '#e7f0f4',
  ternary: '#FFF6F0',
  yellowLight: '#FFFAEA',
  disabledLight: '#F4F4F4',
  blue: '#1985C1',
  skyBlueLight: '#F6FCFF',
  yellow: '#FBC505',
  purple: '#FFF6F0',
  textPrimary: '#121212',
  shadow: 'rgba(18, 18, 18, 0.12)',
};

export const DEFAULT_DARK_THEME_ID = 'default-dark';

export const DEFAULT_DARK_THEME: Theme = {
  id: DEFAULT_DARK_THEME_ID,
  color: DEFAULT_DARK_COLOR_THEME,
};
