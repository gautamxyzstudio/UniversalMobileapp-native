import {StyleSheet, View} from 'react-native';
import React from 'react';
import {verticalScale, windowHeight, windowWidth} from '@utils/metrics';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {BaseBottomSheet} from '@components/molecules/bottomsheet';
import CandidateProfilePictureView from '@components/client/CandidateProfilePictureView';
import {Theme} from '@theme/Theme.type';
import CustomText, {textSizeEnum} from '@components/atoms/CustomText';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import TextWithIcon from '@components/molecules/TextWithIcon';

import CandidatesContactDetails from '@components/client/CandidatesContactDetails';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import Spacers from '@components/atoms/Spacers';
import SectionHeader from '@components/molecules/SectionHeader';
import {STRINGS} from 'src/locales/english';
import CandidatesGeneralDetailsView from '@components/client/CandidatesGeneralDetailsView';
import PreUploadedDocCardWithView from '@components/doucment/PreUploadedDocCardWithView';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {ICandidateStatusEnum} from '@utils/enums';
import BottomButtonView from '@components/organisms/bottomButtonView';
import {ICandidateTypes} from '@api/features/client/types';
import {IDocumentStatus, IEmployeeDocsApiKeys} from '@api/features/user/types';
import {LOCATION_TERNARY} from '@assets/exporter';

interface ICandidateDetailsBottomSheet {
  details: ICandidateTypes | undefined;
  jobStatus: ICandidateStatusEnum;
  onPressApprove: () => void;
  onPressDecline: () => void;
}

const CandidateDetailsBottomSheet = React.forwardRef<
  BottomSheetModalMethods,
  ICandidateDetailsBottomSheet
>(({details, jobStatus, onPressApprove, onPressDecline}, ref) => {
  const height = windowHeight * 0.75;
  const snapPoints = [0.1, height];
  const navigation = useNavigation<NavigationProps>();

  const onClose = () => {
    //@ts-ignore
    ref.current?.snapToIndex(0);
  };

  const styles = useThemeAwareObject(createStyles);

  console.log(jobStatus, 'josn ');

  return (
    <BaseBottomSheet
      modalStyles={styles.modal}
      snapPoints={snapPoints}
      ref={ref}
      onClose={onClose}>
      <BottomSheetScrollView>
        {details && (
          <View style={styles.container}>
            <View style={styles.topView}>
              <CandidateProfilePictureView
                name={details?.employeeDetails.name}
                url={details?.employeeDetails.selfie?.url ?? null}
                status={jobStatus}
              />
              <CustomText
                value={details.employeeDetails.name}
                marginVertical={verticalScale(8)}
                size={textSizeEnum.mediumBold}
              />
              <CustomText
                value={`job ID- ${details.jobId}`}
                size={textSizeEnum.small}
                customTextStyles={styles.text}
              />
              <TextWithIcon
                icon={LOCATION_TERNARY}
                value={details.jobLocation}
                size={textSizeEnum.small}
                customTextStyles={styles.text}
                marginTop={verticalScale(8)}
              />
            </View>
            <Spacers type="vertical" size={24} scalable />
            <View style={styles.midContainer}>
              <CandidatesContactDetails
                email={details.employeeDetails.email}
                phoneNumber={details.employeeDetails.phone}
              />
            </View>
            <Spacers type="vertical" size={24} scalable />
            <SectionHeader
              value={STRINGS.general}
              size={textSizeEnum.mediumBold}
            />
            <CandidatesGeneralDetailsView />
            <Spacers type="vertical" size={24} scalable />
            {details.employeeDetails.resume && (
              <>
                <SectionHeader
                  value={STRINGS.documents}
                  size={textSizeEnum.mediumBold}
                />
                <View style={styles.midContainer}>
                  <Spacers type="vertical" size={24} scalable />
                  <PreUploadedDocCardWithView
                    hideStatus
                    document={{
                      apiKey: IEmployeeDocsApiKeys.RESUME,
                      docName: 'resume',
                      docId: details.employeeDetails.resume?.id ?? 0,
                      docStatus: IDocumentStatus.APPROVED,
                      doc: details.employeeDetails.resume,
                    }}
                    withTitle={true}
                    navigation={navigation}
                  />
                  <Spacers type="vertical" size={24} scalable />
                </View>
              </>
            )}
          </View>
        )}
      </BottomSheetScrollView>
      {jobStatus === ICandidateStatusEnum.pending && (
        <BottomButtonView
          isMultiple
          secondaryButtonStyles={styles.secondaryButton}
          disabled={false}
          primaryButtonStyles={styles.primaryButton}
          secondaryButtonTitleStyles={styles.secondaryButtonTitle}
          secondaryButtonTitles="Deny"
          title={STRINGS.approve}
          onButtonPress={onPressApprove}
          onPressSecondaryButton={onPressDecline}
        />
      )}
    </BaseBottomSheet>
  );
});

export default CandidateDetailsBottomSheet;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    text: {
      letterSpacing: 0.12,
    },
    topView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
    },
    midContainer: {
      paddingHorizontal: verticalScale(24),
    },
    modal: {marginHorizontal: 0},
    secondaryButton: {
      borderColor: theme.color.red,
      color: theme.color.red,
    },
    secondaryButtonTitle: {
      color: theme.color.red,
    },
    primaryButton: {
      backgroundColor: theme.color.green,
    },
    mainView: {
      width: windowWidth,
      paddingHorizontal: verticalScale(24),
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      gap: verticalScale(16),
      paddingTop: verticalScale(16),
      borderTopWidth: 1,
      borderTopColor: theme.color.grey,
    },
  });
