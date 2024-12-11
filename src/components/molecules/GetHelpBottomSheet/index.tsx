import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {BaseBottomSheet} from '../bottomsheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {verticalScale} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {fonts} from '@utils/common.styles';
import Spacers from '@components/atoms/Spacers';
import {useKeyboardHeight} from 'src/hooks/useKeyboardHeight';
import CustomButton from '../customButton';
import {Row} from '@components/atoms/Row';
import {useTheme} from '@theme/Theme.context';
import CustomTextInput from '@components/atoms/customtextInput';

type IGetHelpBottomSheetProps = {
  onPressSend: (issue: string) => void;
};

const GetHelpBottomSheet = React.forwardRef<
  BottomSheetModal,
  IGetHelpBottomSheetProps
>(({onPressSend}, ref) => {
  const modalHeight = verticalScale(350);
  const styles = useThemeAwareObject(createStyles);
  const [issueDescription, setIssueDescription] = useState('');
  const [issueError, setIssueError] = useState('');
  const {theme} = useTheme();
  const keyboardHeight = useKeyboardHeight();
  const snapPoints = useMemo(
    () => [0.01, modalHeight, modalHeight + keyboardHeight],
    [modalHeight, keyboardHeight],
  );

  const onClose = () => {
    // @ts-ignore
    ref.current?.snapToIndex(0);
  };

  const onPressSubmit = () => {
    if (!issueDescription.trim().length) {
      setIssueError('Description is required');
      return;
    }
    onPressSend(issueDescription);
    setIssueDescription('');
    onClose();
  };

  const onChangeText = (e: React.SetStateAction<string>) => {
    setIssueDescription(e);
    setIssueError('');
  };

  const onPressCancel = () => {
    onClose();
    setIssueDescription('');
    setIssueError('');
  };

  return (
    <BaseBottomSheet snapPoints={snapPoints} ref={ref} onClose={onClose}>
      <View style={styles.mainView}>
        <View style={styles.container}>
          <Text style={styles.title}>{STRINGS.have_an_issue}</Text>
          <Spacers type="vertical" size={16} />
          <CustomTextInput
            placeholder="Describe"
            multiline
            autoCapitalize="none"
            maxLength={100}
            placeholderTextColor={theme.color.grey}
            defaultValue={issueDescription}
            onChangeText={onChangeText}
            title={''}
            isMultiline
            hideTitle
            errorMessage={issueError}
          />
        </View>
        <Row spaceBetween>
          <CustomButton
            type="outline"
            buttonStyle={styles.button}
            onButtonPress={onPressCancel}
            title={STRINGS.cancel}
            disabled={false}
          />
          <CustomButton
            buttonStyle={styles.button}
            onButtonPress={onPressSubmit}
            title={STRINGS.send}
            disabled={false}
          />
        </Row>
      </View>
    </BaseBottomSheet>
  );
});

export default GetHelpBottomSheet;

const createStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      marginTop: verticalScale(16),
    },
    title: {
      ...fonts.mediumBold,
      color: color.textPrimary,
    },
    button: {
      width: verticalScale(164),
      height: verticalScale(48),
      paddingVertical: 0,
    },
    mainView: {flex: 1, justifyContent: 'space-between'},
  });

  return styles;
};
