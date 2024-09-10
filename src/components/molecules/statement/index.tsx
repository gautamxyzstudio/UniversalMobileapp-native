import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import SmallText from '@components/atoms/greyText';
import FocusedText from '@components/atoms/focusedText';
import {IStatementProps} from './types';
import CheckBox from '@components/atoms/checkbox';

const Statement: React.FC<IStatementProps> = ({
  containerStyles,
  withCheckbox,
  checkboxCurrentValue,
  normalText,
  isDisabled,
  checkBoxClickHandler,
  onTextPress,
  focusedText,
}) => {
  return (
    <View>
      <View style={[styles.flex, containerStyles]}>
        {withCheckbox && (
          <CheckBox
            checkBoxClickHandler={checkBoxClickHandler}
            currentValue={checkboxCurrentValue}
          />
        )}
        <View style={styles.container}>
          <SmallText text={normalText} />
          <FocusedText
            isDisabled={isDisabled}
            onPress={onTextPress}
            textStyle={styles.spacer}
            text={focusedText}
          />
        </View>
      </View>
    </View>
  );
};

export default Statement;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'android' ? 5 : 0,
  },
  spacer: {
    marginLeft: 4,
  },
  //   checkbox: {
  //     marginRight: 12,
  //   },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
