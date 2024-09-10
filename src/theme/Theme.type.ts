export interface ColorTheme {
  primary: string;
  blueLight: string;
  black: string;
  darkBlue: string;
  accent: string;
  secondary: string;
  grey: string;
  disabled: string;
  red: string;
  green: string;
  textPrimary: string;
  lightGrey: string;
  skelton: string;
  backgroundWhite: string;
  greyText: string;
  purple: string;
  strokeLight: string;
  orange_light: string;
  accentLighter: string;
  shadow: string;
  greenLight: string;
  blue: string;
  skyBlueLight: string;
  redLight: string;
  yellowLight: string;
  ternary: string;
  disabledLight: string;
  yellow: string;
}

export interface SpacingTheme {
  base: number;
  double: number;
}

export interface Theme {
  id: string;
  color: ColorTheme;
}
