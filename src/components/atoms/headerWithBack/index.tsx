import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import {ARROW_DARK, ARROW_HEADER, IC_CROSS} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';
import {IHeaderWithBackProps} from './types';
import {fonts} from '@utils/common.styles';
import {useNavigation} from '@react-navigation/native';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Row} from '../Row';

const HeaderWithBack: React.FC<IHeaderWithBackProps> = ({
  headerTitle,
  headerTitleStyles,
  headerStyles,
  icon,
  onPressCross,
  withCross,
  withArrow = true,
  onPressRightIcon,
  renderRightIcon,
  isDark,
}) => {
  const navigation = useNavigation();
  const styles = useThemeAwareObject(createStyles);
  const Icon = icon;

  return (
    <Row alignCenter style={[headerStyles]} spaceBetween>
      {withArrow && !withCross && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.container}>
          {withArrow && (
            <>
              {isDark && (
                <ARROW_DARK
                  width={verticalScale(24)}
                  height={verticalScale(24)}
                />
              )}
              {!isDark && (
                <ARROW_HEADER
                  width={verticalScale(24)}
                  height={verticalScale(24)}
                />
              )}
            </>
          )}

          <Text
            style={[
              styles.headerTitle,
              isDark && styles.headerTitleDark,
              !withArrow && {marginLeft: 0},
              headerTitleStyles,
            ]}>
            {headerTitle}
          </Text>
        </TouchableOpacity>
      )}
      {withCross && !withArrow && (
        <Row alignCenter style={styles.main}>
          <TouchableOpacity onPress={onPressCross} style={styles.icon}>
            <IC_CROSS width={verticalScale(24)} height={verticalScale(24)} />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              isDark && styles.headerTitleDark,
              !withArrow && {marginLeft: 0},
              headerTitleStyles,
            ]}>
            {headerTitle}
          </Text>
        </Row>
      )}
      {!withCross && !withArrow && (
        <Text
          style={[
            styles.headerTitle,
            isDark && styles.headerTitleDark,
            !withArrow && {marginLeft: 0},
            headerTitleStyles,
          ]}>
          {headerTitle}
        </Text>
      )}

      {renderRightIcon && Icon && (
        <TouchableOpacity onPress={onPressRightIcon}>
          <Icon width={verticalScale(24)} height={verticalScale(24)} />
        </TouchableOpacity>
      )}
    </Row>
  );
};

export default memo(HeaderWithBack);

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      marginLeft: 16,
      color: theme.color.textPrimary,
      ...fonts.heading,
    },
    main: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: verticalScale(14),
      borderBottomWidth: 1,
      borderColor: theme.color.grey,
    },
    headerTitleDark: {
      marginLeft: 16,
      color: theme.color.textPrimary,
      ...fonts.heading,
    },
    icon: {
      position: 'absolute',
      left: verticalScale(24),
    },
  });
  return styles;
};
