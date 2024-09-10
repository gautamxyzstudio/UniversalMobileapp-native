import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Theme, useThemeAwareObject} from '@theme/index';
import {verticalScale} from '@utils/metrics';
import {DROPDOWN_SECONDARY} from '@assets/exporter';
import {Row} from '@components/atoms/Row';
import {fonts} from '@utils/common.styles';

const FaqCard = () => {
  const styles = useThemeAwareObject(createStyles);
  return (
    <View style={styles.container}>
      <Row alignCenter spaceBetween>
        <Text style={styles.title}>FaqCard</Text>
        <DROPDOWN_SECONDARY
          width={verticalScale(24)}
          height={verticalScale(24)}
        />
      </Row>
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
  });
