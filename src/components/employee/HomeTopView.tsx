import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {gradients} from 'src/constants/gradients';
import {verticalScale} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import {fonts} from '@utils/common.styles';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {BELL, LOCATION_SECONDARY} from '@assets/exporter';
import HomeSearch from './HomeSearch';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import IconWithBackground from '@components/atoms/IconWithbackground';
import {Row} from '@components/atoms/Row';
import {useSelector} from 'react-redux';
import {userAdvanceDetailsFromState} from '@api/features/user/userSlice';

const HomeTopView = ({
  height,
  onPress,
  withSearch = true,
  onPressFilters,
  isLocationApplied,
  isFilterApplied,
}: {
  height?: SharedValue<number>;
  onPress?: () => void;
  withSearch?: boolean;
  isLocationApplied: boolean;
  isFilterApplied?: boolean;
  onPressFilters: () => void;
}) => {
  const insetTop = useSafeAreaInsets().top;
  const top = verticalScale(insetTop) + verticalScale(8);
  const navigation = useNavigation<NavigationProps>();
  const MAX_HEIGHT = verticalScale(75);
  const MIN_HEIGHT = 0;
  const SCROLL_DISTANCE = MAX_HEIGHT - MIN_HEIGHT;
  const userDetails = useSelector(userAdvanceDetailsFromState);
  const styles = useThemeAwareObject(createStyles);

  const containerStyles = useAnimatedStyle(() => {
    return {
      height: interpolate(
        height?.value ?? 0,
        [0, SCROLL_DISTANCE + SCROLL_DISTANCE / 2],
        [MAX_HEIGHT, MIN_HEIGHT],
        Extrapolation.CLAMP,
      ),
      opacity: interpolate(
        height?.value ?? 0,
        [0, SCROLL_DISTANCE],
        [1, 0],
        Extrapolation.CLAMP,
      ),
    };
  });

  const onPressBell = () => {
    navigation.navigate('notifications');
  };

  return (
    <LinearGradient
      colors={gradients.defaultLinear}
      style={[styles.main, {paddingTop: top}]}>
      <Animated.View style={[styles.container, withSearch && containerStyles]}>
        <View>
          <Text
            numberOfLines={1}
            style={[
              fonts.heading,
              styles.heading,
            ]}>{`Hi ${userDetails?.name},`}</Text>
          <Text style={styles.subHeading}>{STRINGS.welcome_to_universal}</Text>
        </View>
        <TouchableOpacity onPress={onPressBell}>
          <BELL height={verticalScale(24)} width={verticalScale(24)} />
          <View style={styles.redDot} />
        </TouchableOpacity>
      </Animated.View>
      {withSearch && (
        <Row alignCenter style={styles.search}>
          <HomeSearch
            isFilterApplied={isFilterApplied}
            onPressFilters={onPressFilters}
          />
          <View>
            <IconWithBackground onPress={onPress} icon={LOCATION_SECONDARY} />
            {isLocationApplied && <View style={styles.redDotSec} />}
          </View>
        </Row>
      )}
    </LinearGradient>
  );
};

export default HomeTopView;
const createStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    heading: {
      color: color.textPrimary,
    },
    subHeading: {
      color: color.textPrimary,
      marginTop: verticalScale(4),
      ...fonts.medium,
    },
    container: {
      flexDirection: 'row',

      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    search: {
      width: 'auto',
      gap: verticalScale(8),
    },
    main: {
      paddingHorizontal: verticalScale(24),
      paddingBottom: verticalScale(24),
      borderBottomLeftRadius: 56,
    },
    redDot: {
      position: 'absolute',
      width: verticalScale(8),
      height: verticalScale(8),
      borderRadius: 100,
      backgroundColor: color.red,
      right: verticalScale(2),
      top: verticalScale(2),
    },
    redDotSec: {
      position: 'absolute',
      width: verticalScale(12),
      height: verticalScale(12),
      borderRadius: 100,
      backgroundColor: color.red,
      right: verticalScale(4),
      top: verticalScale(4),
    },
  });
  return styles;
};
