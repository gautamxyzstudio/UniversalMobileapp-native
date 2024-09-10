import {ImageStyle, StyleProp} from 'react-native';
import {ResizeMode} from 'react-native-fast-image';

export type ICustomImageComponentProps = {
  defaultSource: number | undefined;
  image: string | undefined | null;
  customStyle: StyleProp<ImageStyle>;
  resizeMode?: ResizeMode;
  loaderSize?: number | 'small' | 'large';
  //   source?: number | Source | undefined;
};

export type IImageComponentState = 'loading' | 'error' | 'success';
