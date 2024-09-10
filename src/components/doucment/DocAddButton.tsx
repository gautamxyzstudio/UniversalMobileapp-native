import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import {ADD_ICON} from '@assets/exporter';
import {Row} from '@components/atoms/Row';
import {STRINGS} from 'src/locales/english';
import {Theme, useThemeAwareObject} from '@theme/index';
import {verticalScale} from '@utils/metrics';
import {fonts} from '@utils/common.styles';

type DocAddButtonProps = {
  onPress: () => void;
};

const DocAddButton: React.FC<DocAddButtonProps> = ({onPress}) => {
  const styles = useThemeAwareObject(getStyles);
  return (
    <TouchableOpacity onPress={onPress}>
      <Row style={styles.plusView}>
        <ADD_ICON />
        <Text style={styles.addText}>{STRINGS.add}</Text>
      </Row>
    </TouchableOpacity>
  );
};

export default memo(DocAddButton);

const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    plusView: {
      paddingVertical: verticalScale(4),
      paddingHorizontal: verticalScale(7),
      borderRadius: 40,
      alignSelf: 'center',
      backgroundColor: theme.color.backgroundWhite,
    },
    addText: {
      color: theme.color.textPrimary,
      ...fonts.small,
    },
  });
  return styles;
};
