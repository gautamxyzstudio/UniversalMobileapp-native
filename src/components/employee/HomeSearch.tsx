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

const HomeSearch = () => {
  const styles = useThemeAwareObject(createStyles);
  const navigation = useNavigation<NavigationProps>();
  return (
    <Pressable
      onPress={() => navigation.navigate('employeeSearch')}
      style={styles.container}>
      <Row alignCenter>
        <View style={styles.searchContainer}>
          <SEARCH_HOME width={verticalScale(24)} height={verticalScale(24)} />
        </View>
        <Text style={styles.search}>{STRINGS.search}</Text>
      </Row>
      <IconWithBackground customStyles={styles.filters} icon={FILTER_SEARCH} />
    </Pressable>
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
  });
  return styles;
};
