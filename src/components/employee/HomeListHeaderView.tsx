import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {verticalScale} from '@utils/metrics';
import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import LottieView from 'lottie-react-native';
import {ANIMATIONS} from '@assets/exporter';
import {useTheme} from '@theme/Theme.context';

type IHomeListHeaderViewProps = {
  title: string;
  isLoading?: boolean;
  displayRightArrow: boolean;
};

const HomeListHeaderView: React.FC<IHomeListHeaderViewProps> = ({
  title,
  isLoading,
  displayRightArrow,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const {theme} = useTheme();
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.heading,
          isLoading && {
            backgroundColor: theme.color.skelton,
            color: theme.color.skelton,
            borderRadius: 8,
            overflow: 'hidden',
          },
        ]}>
        {title}
      </Text>
      {displayRightArrow && (
        <LottieView
          autoPlay
          style={styles.lottie}
          source={ANIMATIONS.rightArrow}
        />
      )}

      {/* <TouchableOpacity onPress={onPressViewAll}>
        <Text style={styles.viewAll}>View all</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default HomeListHeaderView;

const getStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginHorizontal: verticalScale(24),
      justifyContent: 'space-between',
      marginTop: verticalScale(24),
      marginBottom: verticalScale(16),
      alignItems: 'center',
    },
    heading: {
      color: color.textPrimary,
      ...fonts.mediumBold,
    },
    viewAll: {
      color: color.textPrimary,
      ...fonts.regular,
    },
    lottie: {
      width: verticalScale(45),
      position: 'absolute',
      right: 0,
      height: verticalScale(45),
      transform: [
        {
          rotate: '270deg',
        },
      ],
    },
  });
  return styles;
};
