import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomImageComponent from '@components/atoms/customImage';
import {ICONS} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {ICandidateStatusEnum} from '@utils/enums';
import {useTheme} from '@theme/Theme.context';
import {capitalizeAndReturnFirstLetter} from '@utils/utils.common';
import {fonts} from '@utils/common.styles';

type ICandidateProfilePictureViewProps = {
  name: string;
  url: string | null;
  size?: number;
  textSize?: 'small' | 'medium' | 'large';
  status: ICandidateStatusEnum;
};

const CandidateProfilePictureView: React.FC<
  ICandidateProfilePictureViewProps
> = ({name, url, status, size, textSize = 'medium'}) => {
  const styles = useThemeAwareObject(createStyles);
  const {theme} = useTheme();
  const profilePictureAttributes = getProfileStylesFromSelectionStatus(
    status,
    theme,
  );
  return (
    <View>
      {url ? (
        <CustomImageComponent
          defaultSource={ICONS.imagePlaceholder}
          image={url}
          resizeMode="cover"
          customStyle={[
            styles.image,
            size ? {width: size, height: size} : null,
            {...profilePictureAttributes},
          ]}
        />
      ) : (
        <View
          style={[
            styles.image,
            size ? {width: size, height: size} : null,
            {...profilePictureAttributes},
          ]}>
          <Text
            style={[
              textSize === 'small' && styles.nameSmall,
              textSize === 'medium' && styles.name,
              textSize === 'large' && styles.nameLarge,
            ]}>
            {capitalizeAndReturnFirstLetter(name)}
          </Text>
        </View>
      )}
    </View>
  );
};

export default CandidateProfilePictureView;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    image: {
      width: verticalScale(48),
      height: verticalScale(48),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      borderWidth: 1,
      borderColor: theme.color.lightGrey,
    },
    name: {
      color: theme.color.textPrimary,
      ...fonts.mediumBold,
    },
    nameSmall: {
      color: theme.color.textPrimary,
      ...fonts.small,
    },
    nameLarge: {
      color: theme.color.textPrimary,
      ...fonts.heading,
    },
  });

const getProfileStylesFromSelectionStatus = (
  status: ICandidateStatusEnum,
  theme: Theme,
) => {
  switch (status) {
    case ICandidateStatusEnum.pending:
      return {
        borderColor: theme.color.strokeLight,
        backgroundColor: theme.color.primary,
      };
    case ICandidateStatusEnum.declined:
      return {
        borderColor: theme.color.red,
        backgroundColor: theme.color.redLight,
      };
    case ICandidateStatusEnum.selected:
      return {
        borderColor: theme.color.green,
        backgroundColor: theme.color.greenLight,
      };
    default:
      return {
        borderColor: theme.color.strokeLight,
        backgroundColor: theme.color.primary,
      };
  }
};
