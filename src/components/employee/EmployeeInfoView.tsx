import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Row} from '@components/atoms/Row';
import UploadProfilePhoto from '@components/molecules/uploadProfilePhoto';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/index';
import {verticalScale} from '@utils/metrics';
import {fontFamily, fonts} from '@utils/common.styles';
import {EDIT_PROFILE} from '@assets/exporter';
import {IDoc} from '@api/features/user/types';

type IEmployeeInfoViewProps = {
  name: string;
  email: string;
  profilePicture: IDoc | undefined | null;
  onPressEdit?: () => void;
};

const EmployeeInfoView: React.FC<IEmployeeInfoViewProps> = ({
  name,
  email,
  profilePicture,
  onPressEdit,
}) => {
  const styles = useThemeAwareObject(getStyles);

  console.log(profilePicture, 'pp');
  return (
    <Row style={styles.mainView} spaceBetween>
      <Row style={styles.innerContainer} alignCenter>
        <UploadProfilePhoto
          isEditable={false}
          // getUploadedImageIds={function (ids: Array<number>): void {
          //   throw new Error('Function not implemented.');
          // }}
          initialImage={profilePicture}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </Row>
      <TouchableOpacity onPress={onPressEdit}>
        <EDIT_PROFILE />
      </TouchableOpacity>
    </Row>
  );
};

export default EmployeeInfoView;

const getStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    mainView: {
      borderBottomWidth: 1,
      borderColor: color.strokeLight,
      paddingBottom: verticalScale(16),
      paddingHorizontal: verticalScale(24),
    },
    innerContainer: {
      gap: verticalScale(12),
    },
    userDetails: {
      gap: verticalScale(4),
    },
    userName: {
      color: color.textPrimary,
      ...fonts.headingSmall,
      fontFamily: fontFamily.regular,
    },
    email: {
      color: color.disabled,
      ...fonts.medium,
    },
  });
  return styles;
};
