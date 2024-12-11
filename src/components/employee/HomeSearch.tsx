import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {verticalScale} from '@utils/metrics';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {FILTER_SEARCH, SEARCH_HOME} from '@assets/exporter';
import {STRINGS} from 'src/locales/english';
import {fonts} from '@utils/common.styles';
import {Row} from '@components/atoms/Row';
import IconWithBackground from '@components/atoms/IconWithbackground';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';

type IHomeSearchProps = {
  onPressFilters: () => void;
  isFilterApplied?: boolean;
};

const HomeSearch: React.FC<IHomeSearchProps> = ({
  onPressFilters,
  isFilterApplied,
}) => {
  const styles = useThemeAwareObject(createStyles);
  const navigation = useNavigation<NavigationProps>();

  const onPressSearch = () => {
    navigation.navigate('employeeSearch');
  };
  return (
    <View style={styles.container}>
      <Pressable style={styles.flex} onPress={onPressSearch}>
        <Row alignCenter>
          <View style={styles.searchContainer}>
            <SEARCH_HOME width={verticalScale(24)} height={verticalScale(24)} />
          </View>
          <Text style={styles.search}>{STRINGS.search}</Text>
        </Row>
      </Pressable>
      <>
        <IconWithBackground
          onPress={onPressFilters}
          customStyles={styles.filters}
          icon={FILTER_SEARCH}
        />
        {isFilterApplied && <View style={styles.redDot} />}
      </>
    </View>
  );
};

export default HomeSearch;
const createStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: verticalScale(40),
      backgroundColor: color.primary,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 40,
    },
    searchContainer: {
      marginLeft: verticalScale(12),
      marginVertical: verticalScale(8),
    },
    search: {
      ...fonts.medium,
      color: color.disabled,
      marginLeft: verticalScale(12),
    },
    filters: {
      marginRight: verticalScale(2),
    },
    redDot: {
      position: 'absolute',
      width: verticalScale(10),
      height: verticalScale(10),
      borderRadius: 100,
      backgroundColor: color.red,
      right: verticalScale(8),
      top: verticalScale(8),
    },
    flex: {
      flex: 1,
    },
  });
  return styles;
};
