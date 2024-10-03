import React from 'react';
import {ICustomErrorResponse} from '@api/types';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {ImageSourcePropType, Text, View} from 'react-native';
import {STRINGS} from 'src/locales/english';
import {getStyles} from './styles';
import {EMPTY, NO_INTERNET} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';
import {SvgProps} from 'react-native-svg';
import CustomButton from '@components/molecules/customButton';

type IEmptyStateProps<T> = {
  errorObj: ICustomErrorResponse | null | undefined;
  refreshHandler?: () => void;
  data?: T[];
  errorHeader?: string;
  image?: ImageSourcePropType;
  errorMsg?: string;
  withRefetch?: boolean;
  emptyListMessage?: string;
  emptyListIllustration?: React.FC<SvgProps>;
  emptyListSubTitle?: string;
};

const EmptyState: React.FC<IEmptyStateProps<any>> = ({
  errorObj,
  data,
  errorHeader,
  emptyListMessage,
  emptyListIllustration,
  emptyListSubTitle,
  errorMsg,
  withRefetch,
  refreshHandler,
}) => {
  const styles = useThemeAwareObject(getStyles);

  const error = errorHeader ?? 'OOPS !!';
  const errorMessage = errorMsg ?? STRINGS.someting_went_wrong;
  const internetError = STRINGS.your_internet_is_a_little_wonky_right_now;
  const internetErrorMsg = STRINGS.internet_error_msg;
  const EmptyListIcon = emptyListIllustration ?? EMPTY;
  return (
    <View style={styles.container}>
      {!errorObj && data?.length === 0 && (
        <>
          <EmptyListIcon
            width={verticalScale(230)}
            height={verticalScale(163)}
          />
          <Text style={styles.errorHeader}>{emptyListMessage}</Text>
          <Text style={styles.errorDescription}>{emptyListSubTitle}</Text>
          {withRefetch && (
            <CustomButton
              title={STRINGS.refetch}
              onButtonPress={refreshHandler}
              disabled={false}
            />
          )}
        </>
      )}
      {errorObj && errorObj.statusCode === 'FETCH_ERROR' && (
        <>
          <NO_INTERNET />
          <Text style={styles.errorHeader}>{internetError}</Text>
          <Text style={styles.errorDescription}>{internetErrorMsg}</Text>
          {withRefetch && (
            <CustomButton
              title={STRINGS.refetch}
              onButtonPress={refreshHandler}
              disabled={false}
            />
          )}
        </>
      )}
      {errorObj && errorObj?.statusCode !== 'FETCH_ERROR' && (
        <>
          <EmptyListIcon
            width={verticalScale(230)}
            height={verticalScale(163)}
          />
          <Text style={styles.errorHeader}>{error}</Text>
          <Text style={styles.errorDescription}>{errorMessage}</Text>
          <CustomButton
            title={STRINGS.retry}
            onButtonPress={refreshHandler}
            disabled={false}
          />
        </>
      )}
    </View>
  );
};

export default EmptyState;
