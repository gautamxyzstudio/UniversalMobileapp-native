import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';
import {BaseBottomSheet} from '@components/molecules/bottomsheet';
import {verticalScale} from '@utils/metrics';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/index';
import {STRINGS} from 'src/locales/english';
import SearchInput from '@components/molecules/InputTypes/SearchInput';
import {useNavigation} from '@react-navigation/native';
import {ICONS, PLUS} from '@assets/exporter';
import {Row} from '@components/atoms/Row';
import {fonts} from '@utils/common.styles';
import {companyDetails} from '@api/mockData';
import {ICompanyDetails} from '@api/types';
import CustomImageComponent from '@components/atoms/customImage';
import Spacers from '@components/atoms/Spacers';
import AnimatedPressable from '@components/atoms/AnimatedPressable';
import {NavigationProps} from 'src/navigator/types';

type ISelectCompanyBottomSheetProps = {
  getSelectedCompany: (selectedCompany: ICompanyDetails) => void;
};

const SelectCompanyBottomSheet = React.forwardRef<
  BottomSheetModal,
  ISelectCompanyBottomSheetProps
>(({getSelectedCompany}, ref) => {
  const modalHeight = verticalScale(747);
  const [search, setSearch] = useState('');
  const styles = useThemeAwareObject(createStyles);
  const navigation = useNavigation<NavigationProps>();
  const snapPoints = useMemo(() => [0.01, modalHeight], [modalHeight]);

  const itemSeparator = () => {
    return <Spacers type="vertical" />;
  };

  const bottomSheetRenderItem = ({item}: {item: ICompanyDetails}) => {
    return (
      <AnimatedPressable onPress={() => getSelectedCompany(item)}>
        <Row style={styles.row} alignCenter>
          <CustomImageComponent
            defaultSource={ICONS.imagePlaceholder}
            image={item.poster}
            customStyle={styles.poster}
          />
          <Text style={styles.addText}>{item.name}</Text>
        </Row>
      </AnimatedPressable>
    );
  };

  const onPressAdd = () => {
    onClose();
    navigation.navigate('registerNewCompany');
  };

  const onClose = () => {
    //@ts-ignore
    ref.current?.snapToIndex(0);
  };

  return (
    <BaseBottomSheet
      headerTitle={STRINGS.select_the_company}
      snapPoints={snapPoints}
      ref={ref}
      onClose={onClose}>
      <View style={styles.containerView}>
        <SearchInput
          navigation={navigation}
          withBack={false}
          containerStyles={styles.input}
          leftIcon={false}
          value={search}
          onChangeText={e => setSearch(e)}
          onPressCross={() => setSearch('')}
          placeHolder={STRINGS.search}
        />
        <BottomSheetFlatList
          stickyHeaderIndices={[0]}
          ItemSeparatorComponent={itemSeparator}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <AnimatedPressable onPress={onPressAdd}>
              <Row style={[styles.row, styles.header]} alignCenter>
                <View style={styles.plusButtonView}>
                  <PLUS width={verticalScale(14)} height={verticalScale(14)} />
                </View>
                <Text style={styles.addText}>{STRINGS.add}</Text>
              </Row>
            </AnimatedPressable>
          }
          data={companyDetails}
          ListFooterComponent={<Spacers type="vertical" />}
          renderItem={bottomSheetRenderItem}
        />
      </View>
    </BaseBottomSheet>
  );
});

export default SelectCompanyBottomSheet;
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    containerView: {
      paddingHorizontal: verticalScale(24),
      flex: 1,
      paddingTop: verticalScale(24),
    },
    input: {
      marginBottom: verticalScale(16),
    },
    plusButtonView: {
      borderWidth: 1,
      borderColor: theme.color.accent,
      width: verticalScale(32),
      borderRadius: verticalScale(16),
      height: verticalScale(32),
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
      gap: verticalScale(12),
      backgroundColor: theme.color.primary,
    },
    addText: {
      ...fonts.medium,
      color: theme.color.textPrimary,
    },
    poster: {
      borderWidth: 1,
      borderColor: theme.color.strokeLight,
      width: verticalScale(32),
      borderRadius: verticalScale(16),
      height: verticalScale(32),
    },
    header: {
      paddingBottom: verticalScale(8),
      marginBottom: verticalScale(16),
    },
  });
