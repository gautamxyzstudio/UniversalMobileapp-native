/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {StatusBar, StyleProp, View, ViewStyle} from 'react-native';
import {getStyles} from './styles';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {useTheme} from '@theme/Theme.context';
import {useScreenInsets} from 'src/hooks/useScreenInsets';
import {verticalScale} from '@utils/metrics';

type ISafeAreaViewProps = {
  children: React.ReactNode;
  backgroundColor?: string;
  topBG?: string;
  paddingHorizontal?: boolean;
  statusBarColor?: string;
  hideSpaceFromTop?: boolean;
  hideBottomSpace?: boolean;
  bottomSpace?: number;
  style?: StyleProp<ViewStyle>;
  isTop?: boolean;
};

const SafeAreaView: React.FC<ISafeAreaViewProps> = props => {
  const {insetsTop, insetsBottom} = useScreenInsets();
  const {theme} = useTheme();

  const styles = useThemeAwareObject(getStyles);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: props.backgroundColor ?? theme.color.primary,

          // paddingTop: safeAreaInset,
          // paddingBottom: safeAreaInsetBottom,
        },
        props.paddingHorizontal && {paddingHorizontal: verticalScale(24)},
        props.style,
      ]}>
      <View
        style={{
          height: props.hideSpaceFromTop ? 0 : insetsTop,
          backgroundColor: props?.topBG ?? 'transparent',
        }}
      />

      {props.children}
      {!props.hideBottomSpace && (
        <View
          style={{
            height: insetsBottom,
          }}
        />
      )}
    </View>
  );
};

export default SafeAreaView;
