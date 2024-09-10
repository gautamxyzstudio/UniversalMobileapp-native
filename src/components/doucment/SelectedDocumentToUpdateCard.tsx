import {StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {Theme, useThemeAwareObject} from '@theme/index';
import RadioButton from '@components/molecules/RadioButton';
import {verticalScale} from '@utils/metrics';
import {useTheme} from '@theme/Theme.context';

type ISelectedDocumentToUpdateCardProps = {
  title: string;
  isSelected: boolean;
  onPressCard: () => void;
};

const SelectedDocumentToUpdateCard: React.FC<
  ISelectedDocumentToUpdateCardProps
> = ({title, isSelected, onPressCard}) => {
  const {theme} = useTheme();
  const styles = useThemeAwareObject(createStyles);

  return (
    <RadioButton
      containerStyle={[
        styles.item,
        isSelected && {
          backgroundColor: theme.color.ternary,
        },
      ]}
      currentValue={isSelected}
      radioButtonClickHandler={onPressCard}
      text={title}
    />
  );
};

export default memo(SelectedDocumentToUpdateCard);

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    main: {
      height: '100%',
    },
    container: {
      gap: 12,
    },
    item: {
      backgroundColor: theme.color.backgroundWhite,
      alignItems: 'center',
      borderRadius: 8,
      paddingHorizontal: verticalScale(16),
      height: verticalScale(48),
      overflow: 'hidden',
    },
  });
