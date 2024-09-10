import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {BaseBottomSheet} from '../bottomsheet';
import {verticalScale} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {CROSS, PLUS_CIRCLE} from '@assets/exporter';
import {Row} from '@components/atoms/Row';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {useKeyboardHeight} from 'src/hooks/useKeyboardHeight';
import CustomButton from '../customButton';
import {useToast} from 'react-native-toast-notifications';
import {useTheme} from '@theme/Theme.context';

type IAddCertificatePopupProps = {
  getAddedCertificate: (array: string[]) => void;
  addedCertificate: string[];
};

const AddCertificatePopup = React.forwardRef<
  BottomSheetModal,
  IAddCertificatePopupProps
>(({getAddedCertificate, addedCertificate}, ref) => {
  const modalHeight = verticalScale(470);
  const styles = useThemeAwareObject(getStyles);
  const [input, setInput] = useState<string>('');
  const toast = useToast();
  const theme = useTheme();
  const [certificates, setCertificates] = useState<string[]>([]);
  const keyboardHeight = useKeyboardHeight();
  const snapPoints = useMemo(
    () => [0.01, modalHeight, modalHeight + keyboardHeight / 2],
    [modalHeight, keyboardHeight],
  );

  useEffect(() => {
    setCertificates(addedCertificate);
  }, [addedCertificate]);

  const onPressAdd = () => {
    if (input.trim()) {
      if (certificates.includes(input.trim())) {
        toast.hideAll();
        toast.show('Certificate is already added', {type: 'error'});
      } else {
        setCertificates([...certificates, input.trim()]);
        setInput('');
      }
    }
  };

  const onPressDone = () => {
    getAddedCertificate(certificates);
    onClose();
  };

  const onPressItem = (name: string) => {
    setCertificates(certificates.filter(c => c !== name));
  };

  const onClose = () => {
    // @ts-ignore
    ref.current?.snapToIndex(0);
  };
  return (
    <BaseBottomSheet
      ref={ref}
      headerTitle={STRINGS.add_required_certificates}
      snapPoints={snapPoints}
      onClose={onClose}>
      <View style={styles.container}>
        <Row style={styles.textInputContainer}>
          <TextInput
            value={input}
            placeholderTextColor={theme.theme.color.greyText}
            maxLength={30}
            onChangeText={e => setInput(e)}
            placeholder={STRINGS.add_required_certificates}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={onPressAdd}>
            <PLUS_CIRCLE />
          </TouchableOpacity>
        </Row>
        <Row wrap style={styles.certificates}>
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
      </View>
      <Row style={styles.bottomView} spaceBetween>
        <CustomButton
          type="outline"
          buttonStyle={styles.button}
          title={STRINGS.cancel}
          onButtonPress={onClose}
          disabled={false}
        />
        <CustomButton
          buttonStyle={styles.button}
          title={STRINGS.add}
          onButtonPress={onPressDone}
          disabled={false}
        />
      </Row>
    </BaseBottomSheet>
  );
});

export default AddCertificatePopup;
const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: verticalScale(24),
      paddingTop: verticalScale(24),
    },
    textInputContainer: {
      borderBottomWidth: 1,
      paddingBottom: verticalScale(1),
      width: '100%',
      borderColor: theme.color.grey,
    },
    textInput: {
      ...fonts.regular,
      flex: 1,
      color: theme.color.textPrimary,
    },
    certificates: {
      marginTop: verticalScale(24),
      gap: verticalScale(8),
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
    button: {
      width: verticalScale(164),
      height: verticalScale(48),
      paddingVertical: 0,
    },
    bottomView: {
      marginHorizontal: verticalScale(24),
    },
  });
  return styles;
};
