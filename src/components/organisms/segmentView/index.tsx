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
import React, {useEffect, useRef} from 'react';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {Theme, useThemeAwareObject} from '@theme/index';
import {verticalScale, windowWidth} from '@utils/metrics';
import {fonts} from '@utils/common.styles';
import {useTheme} from '@theme/Theme.context';

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

const SegmentView: React.FC<ISegmentProps> = ({
  outerContainerStyles,
  segmentTextStyles,
  segmentHeight,
  segmentWidth,
  segmentContent,
  currentIndex,
  marginHorizontal,
  segmentActiveTextStyles,
  onClick,
  tabs,
  segmentViewStyles,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const viewRef = useRef<View | null>(null);
  const width = segmentWidth ?? (windowWidth * 90) / 100;
  const height = segmentHeight ?? 45;
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

  useEffect(() => {
    animationValue.value = withSpring(currentIndex * translateValue, {
      stiffness: 180,
      damping: 20,
      mass: 1,
    });
  }, [currentIndex]);

  const memoizedTabPressCallback = React.useCallback((index: number) => {
    onClick && onClick(index);
  }, []);

  return (
    <View
      ref={viewRef}
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
        ]}></Animated.View>
      {tabs.map((tab, index) => {
        const isCurrentIndex = currentIndex === index;
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
      })}
    </View>
  );
};

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
      elevation: 9,
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
