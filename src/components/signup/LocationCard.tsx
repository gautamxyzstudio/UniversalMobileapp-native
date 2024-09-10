import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {LOCATION_ICON} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {fonts} from '@utils/common.styles';
import {Theme} from '@theme/Theme.type';

const LocationCard = () => {
  const styles = useThemeAwareObject(createStyles);
  return (
    <TouchableOpacity style={styles.mainView}>
      <LOCATION_ICON width={verticalScale(24)} height={verticalScale(24)} />
      <View style={styles.locationCard}>
        <Text style={styles.title}>CP-67 Unity Homeland</Text>
        <Text style={styles.description}>
          International Airport Road, Sector 67, Sahibzada Ajit Sing Nagar,
          Punjab, India
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default LocationCard;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    mainView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationCard: {
      marginLeft: verticalScale(12),
    },
    title: {
      ...fonts.regular,
      color: theme.color.textPrimary,
    },
    description: {
      marginTop: verticalScale(4),
      ...fonts.small,
      color: theme.color.disabled,
    },
  });
  return styles;
};
