import {StyleSheet, View} from 'react-native';
import React, {useMemo} from 'react';
import {BaseBottomSheet} from '@components/molecules/bottomsheet';
import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';
import {verticalScale, windowHeight} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import FaqCard from '@components/molecules/FaqCard';
import {IFaq} from '@api/features/client/types';
import Spacers from '@components/atoms/Spacers';
import EmptyState from '@screens/common/emptyAndErrorScreen';
import {EMPTY} from '@assets/exporter';

type IFaqBottomSheetProps = {
  data: IFaq[] | undefined;
};

const FaqBottomSheet = React.forwardRef<BottomSheetModal, IFaqBottomSheetProps>(
  ({data}, ref) => {
    const onClose = () => {
      //@ts-ignore
      ref.current?.snapToIndex(0);
    };
    const modalHeight = verticalScale(windowHeight / 1.5);
    const snapPoints = useMemo(() => [0.01, modalHeight], [modalHeight]);

    const renderItem = ({item}: {item: IFaq}) => {
      return (
        <FaqCard
          key={item.id}
          title={item.title}
          description={item.description}
        />
      );
    };

    const renderSpacer = () => {
      return <Spacers size={12} scalable type={'vertical'} />;
    };

    return (
      <BaseBottomSheet
        ref={ref}
        headerTitle={STRINGS.fAQs}
        snapPoints={snapPoints}
        onClose={onClose}>
        <View style={styles.container}>
          <BottomSheetFlatList
            ItemSeparatorComponent={renderSpacer}
            contentContainerStyle={styles.containerContent}
            ListEmptyComponent={
              <EmptyState
                emptyListIllustration={EMPTY}
                data={[]}
                emptyListSubTitle="No Faqs found"
                errorObj={undefined}
              />
            }
            data={data}
            renderItem={renderItem}
          />
        </View>
      </BaseBottomSheet>
    );
  },
);

export default FaqBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: verticalScale(24),
    paddingTop: verticalScale(24),
  },
  containerContent: {
    flexGrow: 1,
  },
});
