import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {moderateScale, verticalScale} from '@utils/metrics';
import {Theme} from '@theme/index';
import {fonts} from '@utils/common.styles';
import {useTheme} from '@theme/Theme.context';
import {STRINGS} from 'src/locales/english';
import {CROSS, PLUS_CIRCLE} from '@assets/exporter';
import {Row} from '@components/atoms/Row';

type ISelectCertificateInput = {
  error: string;
  onPressAdd: () => void;
  getUpdatedCertificate: (certificates: string[]) => void;
  initiallySelectedCertificates: string[];
};

const SelectCertificateInput: React.FC<ISelectCertificateInput> = ({
  error,
  onPressAdd,
  getUpdatedCertificate,
  initiallySelectedCertificates,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const [certificates, setCertificates] = useState(
    initiallySelectedCertificates,
  );

  useEffect(() => {
    if (initiallySelectedCertificates?.length > 0) {
      setCertificates(initiallySelectedCertificates);
    }
  }, [initiallySelectedCertificates]);

  const onPressItem = (certificate: string) => {
    const updatedCertificates = certificates.filter(
      item => item !== certificate,
    );
    setCertificates(updatedCertificates);
    getUpdatedCertificate(updatedCertificates);
  };

  const {theme} = useTheme();
  return (
    <View style={styles.container}>
      <Row alignCenter style={[styles.labelContainer]}>
        <Text
          style={[styles.labelText, error ? {color: theme.color.red} : null]}>
          {STRINGS.requiredCertificates}
        </Text>
      </Row>

      <Row wrap style={styles.row}>
        {certificates.map((certificate, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onPressItem(certificate)}>
            <Row alignCenter style={styles.itemContainer}>
              <Text style={styles.item}>{certificate}</Text>
              <CROSS />
            </Row>
          </TouchableOpacity>
        ))}
      </Row>
      <TouchableOpacity onPress={onPressAdd} style={styles.addContainer}>
        <PLUS_CIRCLE />
        <Text style={styles.title}>{STRINGS.add_required_certificates}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectCertificateInput;

const getStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      borderWidth: 1,
      borderRadius: 10,
      top: 0,
      left: 0,
      padding: verticalScale(16),
      borderColor: theme.color.grey,
      position: 'relative',
    },
    row: {
      gap: verticalScale(10),
    },
    labelContainer: {
      top: moderateScale(-11),
      flexDirection: 'row',
      paddingHorizontal: verticalScale(8),
      position: 'absolute',
      zIndex: 1,
      marginLeft: verticalScale(16),
      backgroundColor: '#fff',
      textAlign: 'center',
      pointerEvents: 'none',
    },
    labelText: {
      color: theme.color.disabled,
      ...fonts.medium,
      marginRight: verticalScale(4),
    },
    value: {
      ...fonts.medium,
      color: theme.color.textPrimary,
    },
    title: {
      color: theme.color.disabled,
      marginTop: verticalScale(8),
      ...fonts.regular,
    },
    addContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: verticalScale(10),
    },
    itemContainer: {
      borderRadius: 30,
      borderWidth: 1,
      gap: verticalScale(8),
      borderColor: theme.color.lightGrey,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    item: {
      ...fonts.small,
      color: theme.color.textPrimary,
    },
  });
};
