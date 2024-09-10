import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  InputAccessoryView,
  Keyboard,
} from 'react-native';
import React from 'react';
import {useTheme} from '@theme/Theme.context';
import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {STRINGS} from 'src/locales/english';

type IInputAccessoryViewProps = {
  title: string;
};

const InputAccessoryViewComp: React.FC<IInputAccessoryViewProps> = ({
  title,
}) => {
  const styles = useThemeAwareObject(createStyles);
  const theme = useTheme();

  const doneButtonAction = () => {
    Keyboard.dismiss();
  };
  return (
    <InputAccessoryView
      nativeID={'ID' + title}
      backgroundColor={theme.theme.color.ternary}
      style={styles.inputAccessoryContainerOuter}>
      <View style={styles.inputAccessoryContainerView}>
        {/* <Text style={styles.accessoryPlaceholderText}></Text> */}
        <TouchableOpacity
          style={styles.accessoryDoneButton}
          onPress={doneButtonAction}>
          <Text style={styles.doneText}>{STRINGS.done}</Text>
        </TouchableOpacity>
      </View>
    </InputAccessoryView>
  );
};

export default InputAccessoryViewComp;
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    inputAccessoryContainerView: {
      height: '100%',
      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    accessoryPlaceholderText: {
      marginLeft: 16,
      color: theme.color.textPrimary,
      ...fonts.regular,
    },
    accessoryDoneButton: {
      height: '70%',
      marginRight: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    doneText: {
      color: '#121212',
      ...fonts.regular,
    },
    inputAccessoryContainerOuter: {
      height: 50,
      width: '100%',
    },
  });
