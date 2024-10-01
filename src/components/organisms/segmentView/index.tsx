/* eslint-disable react-hooks/exhaustive-deps */
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {useImperativeHandle, useState} from 'react';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {Theme, useThemeAwareObject} from '@theme/index';
import {verticalScale, windowWidth} from '@utils/metrics';
import {fonts} from '@utils/common.styles';
import {useTheme} from '@theme/Theme.context';

export interface ISegmentViewRefMethods extends View {
  getIndex: (index: number) => void;
}

type ISegmentProps = {
  outerContainerStyles?: StyleProp<ViewStyle>;
  segmentViewStyles?: StyleProp<ViewStyle>;
  tabs: string[];
  marginHorizontal: number;
  segmentHeight?: number;
  segmentWidth?: number;
  currentIndex: number;
  segmentTextStyles?: StyleProp<TextStyle>;
  segmentActiveTextStyles?: StyleProp<TextStyle>;
  segmentContent?: (tabData: {tabs: string; index: number}) => React.ReactNode;
  onClick?: (index: number) => void;
};

const SegmentView = React.forwardRef<ISegmentViewRefMethods, ISegmentProps>(
  (
    {
      outerContainerStyles,
      segmentTextStyles,
      segmentHeight,
      segmentWidth,
      segmentContent,
      marginHorizontal,
      segmentActiveTextStyles,
      onClick,
      tabs,
      segmentViewStyles,
    },
    ref,
  ) => {
    const styles = useThemeAwareObject(getStyles);

    const width = segmentWidth ?? (windowWidth * 90) / 100;
    const height = segmentHeight ?? 45;
    const [currentI, setCurrentIndex] = useState(0);
    const translateValue = (width - marginHorizontal * 2) / tabs.length;
    const {theme} = useTheme();
    const animationValue = useSharedValue(0);

    const segmentTransformation = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: animationValue.value,
          },
        ],
      };
    });

    useImperativeHandle(
      ref,
      () =>
        ({
          getIndex: (index: number) => {
            console.log(index);
            animationValue.value = withSpring(index * translateValue, {
              stiffness: 180,
              damping: 20,
              mass: 1,
            });
            setCurrentIndex(index);
          },
        } as ISegmentViewRefMethods),
      [],
    );

    const memoizedTabPressCallback = React.useCallback((index: number) => {
      onClick && onClick(index);
    }, []);

    const tabsMemo = React.useMemo(() => {
      return tabs.map((tab, index) => {
        const isCurrentIndex = currentI === index;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.textWrapper]}
            onPress={() => memoizedTabPressCallback(index)}
            activeOpacity={0.7}>
            {segmentContent ? (
              segmentContent({tabs: tab, index: index})
            ) : (
              <Text
                numberOfLines={1}
                style={[
                  styles.textStyles,
                  segmentTextStyles,
                  {
                    color: isCurrentIndex
                      ? theme.color.primary
                      : theme.color.textPrimary,
                  },
                  isCurrentIndex && segmentActiveTextStyles,
                ]}>
                {tab}
              </Text>
            )}
          </TouchableOpacity>
        );
      });
    }, [tabs, currentI]);

    return (
      <View
        ref={ref}
        style={[
          styles.segmentContainer,
          {
            width: width,
            height: height,
          },
          outerContainerStyles,
        ]}>
        <Animated.View
          style={[
            styles.segment,
            {
              width: (width - marginHorizontal * 2) / tabs.length,
              marginHorizontal: marginHorizontal,
            },
            segmentViewStyles,
            segmentTransformation,
          ]}
        />
        {tabsMemo}
      </View>
    );
  },
);

export default SegmentView;

export const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    segmentContainer: {
      height: verticalScale(40),
      display: 'flex',
      flexDirection: 'row',
      elevation: 5,
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: theme.color.primary,
      borderRadius: 60,
    },
    segment: {
      ...StyleSheet.absoluteFillObject,
      position: 'absolute',
      top: 0,
      //   marginVertical: verticalScale(4),
      borderRadius: 40,
      backgroundColor: theme.color.darkBlue,
    },
    textWrapper: {
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    textStyles: {
      textAlign: 'center',
      color: theme.color.textPrimary,
      ...fonts.medium,
    },
  });
  return styles;
};
