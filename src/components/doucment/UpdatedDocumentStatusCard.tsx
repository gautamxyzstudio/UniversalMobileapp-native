import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import PreUploadedDocCardWithView, {
  getStatusAttributesFromStatus,
} from './PreUploadedDocCardWithView';
import {fonts} from '@utils/common.styles';
import Spacers from '@components/atoms/Spacers';
import {Row} from '@components/atoms/Row';
import {MEAT_BALL} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {IDocumentStatus, IEmployeeDocument} from '@api/features/user/types';
import {useTheme} from '@theme/Theme.context';
import CustomText, {textSizeEnum} from '@components/atoms/CustomText';

type IUpdatedDocumentStatusCard = {
  status: IDocumentStatus;
  title?: string;
  onPressThreeDots: (doc: IEmployeeDocument) => void;
  asset: IEmployeeDocument;
};

const UpdatedDocumentStatusCard: React.FC<IUpdatedDocumentStatusCard> = ({
  title,
  status,
  onPressThreeDots,
  asset,
}) => {
  const styles = useThemeAwareObject(createStyles);
  const navigation = useNavigation<NavigationProps>();
  const {theme} = useTheme();

  return (
    <View style={styles.container}>
      {title && (
        <>
          <Row alignCenter spaceBetween>
            <CustomText
              value={asset.docName}
              color="disabled"
              size={textSizeEnum.medium}
            />

            <Row alignCenter>
              <Text
                style={[
                  styles.status,
                  {color: getStatusAttributesFromStatus(status, theme).color},
                ]}>
                {getStatusAttributesFromStatus(status, theme).title}
              </Text>
              <TouchableOpacity onPress={() => onPressThreeDots(asset)}>
                <MEAT_BALL
                  style={styles.dot}
                  width={verticalScale(12)}
                  height={verticalScale(12)}
                />
              </TouchableOpacity>
            </Row>
          </Row>
          <Spacers type="vertical" size={8} />
        </>
      )}
      <PreUploadedDocCardWithView
        withTitle={false}
        hideStatus
        document={asset}
        navigation={navigation}
      />
    </View>
  );
};

export default UpdatedDocumentStatusCard;

const createStyles = () =>
  StyleSheet.create({
    container: {
      padding: verticalScale(12),
      backgroundColor: '#fff',
      shadowColor: 'rgba(18, 18, 18, 0.08)',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 1,
      shadowRadius: 4,
      borderRadius: 8,
      elevation: 1,
    },
    status: {
      ...fonts.medium,
    },
    dot: {
      marginLeft: verticalScale(4),
    },
  });
