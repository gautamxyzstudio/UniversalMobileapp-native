import {StyleSheet, View} from 'react-native';
import React, {useCallback} from 'react';
import SafeAreaView from '@components/safeArea';
import HeaderWithBack from '@components/atoms/headerWithBack';
import {STRINGS} from 'src/locales/english';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {verticalScale} from '@utils/metrics';
import CustomList from '@components/molecules/customList';
import UpdatedDocumentStatusCard from '@components/doucment/UpdatedDocumentStatusCard';
import {mockAsset} from '@api/mockData';
import {IEmployeeDocument} from '@api/features/user/types';

type IUpdatedDocumentStatusProps = {
  data: IEmployeeDocument[];
};

const UpdatedDocumentStatus: React.FC<IUpdatedDocumentStatusProps> = ({
  data,
}) => {
  const styles = useThemeAwareObject(createStyles);

  const renderItem = useCallback(() => {
    return (
      <UpdatedDocumentStatusCard
        title={STRINGS.sinDocument}
        status={'Pending'}
        asset={mockAsset}
      />
    );
  }, []);

  return (
    <SafeAreaView paddingHorizontal>
      <HeaderWithBack isDark headerTitle={STRINGS.updatedDocument} />
      <View style={styles.container}>
        <CustomList
          data={data}
          renderItem={renderItem}
          estimatedItemSize={100}
          error={undefined}
          isLastPage={false}
        />
        {/* <UpdatedDocumentStatusCard
          title={STRINGS.sinDocument}
          status={'Pending'}
          asset={mockAsset}
        /> */}
      </View>
    </SafeAreaView>
  );
};

export default UpdatedDocumentStatus;
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginTop: verticalScale(24),
    },
  });
