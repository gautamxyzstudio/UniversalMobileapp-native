import {Pressable, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {Theme, useThemeAwareObject} from '@theme/index';
import {verticalScale} from '@utils/metrics';
import {Row} from '@components/atoms/Row';
import {fonts} from '@utils/common.styles';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ICONS} from '@assets/exporter';
import CustomText, {textSizeEnum} from '@components/atoms/CustomText';

type IFaqCardProps = {
  title: string;
  description: string;
};

const FaqCard: React.FC<IFaqCardProps> = ({title, description}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = useThemeAwareObject(createStyles);
  const animatedValue = useSharedValue(0);

  const onPress = () => {
    setIsExpanded(!isExpanded);
    animatedValue.value = withTiming(isExpanded ? 0 : 1);
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: animatedValue.value,
    };
  });
  const animatedIconStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {rotate: `${interpolate(animatedValue.value, [0, 1], [0, 180])}deg`},
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <Row alignCenter spaceBetween>
          <CustomText value={title} size={textSizeEnum.medium} />
          <Animated.Image style={animatedIconStyles} source={ICONS.dropDown} />
        </Row>
        <Animated.Text
          style={[
            styles.description,
            {display: isExpanded ? 'flex' : 'none'},
            animatedStyles,
          ]}>
          {description}
        </Animated.Text>
      </Pressable>
    </View>
  );
};

export default FaqCard;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: theme.color.grey,
      paddingVertical: verticalScale(16),
      paddingHorizontal: verticalScale(12),
      borderRadius: 8,
    },
    title: {
      ...fonts.medium,
      color: theme.color.textPrimary,
    },
    description: {
      ...fonts.medium,
      color: theme.color.disabled,
    },
  });
