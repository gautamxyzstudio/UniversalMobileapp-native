import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {STRINGS} from 'src/locales/english';
import {fonts} from '@utils/common.styles';
import {RIGHT_ARROW_DROPDOWN} from '@assets/exporter';
import {Row} from '@components/atoms/Row';
import {verticalScale} from '@utils/metrics';
import BrTag from '@components/atoms/brTag';

type RecentSearchesPropTypes = {
  searches: {
    id: number;
    title: string;
  }[];
  onPressRecentSearch: (search: {id: number; title: string}) => void;
};

const RecentSearches: React.FC<RecentSearchesPropTypes> = ({
  searches,
  onPressRecentSearch,
}) => {
  const [recentSearches, setRecentSearches] = useState<
    {
      id: number;
      title: string;
    }[]
  >([]);

  useEffect(() => {
    setRecentSearches(searches);
  }, [searches]);

  const styles = useThemeAwareObject(createStyles);
  return (
    <View style={styles.container}>
      <Row alignCenter style={styles.row} spaceBetween>
        <Text style={styles.heading}>{STRINGS.recent_Search}</Text>
      </Row>
      {recentSearches.map((search, index) => {
        const withBr = recentSearches.length - 1 !== index;
        return (
          <View key={index}>
            <TouchableOpacity onPress={() => onPressRecentSearch(search)}>
              <Row alignCenter style={styles.row} spaceBetween>
                <Text style={styles.title}>{search.title}</Text>
                <RIGHT_ARROW_DROPDOWN />
              </Row>
            </TouchableOpacity>
            {withBr && <BrTag />}
          </View>
        );
      })}
    </View>
  );
};

export default RecentSearches;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {},
    heading: {
      ...fonts.mediumBold,
      color: theme.color.textPrimary,
      marginBottom: verticalScale(16),
    },

    title: {
      color: theme.color.disabled,
      ...fonts.regular,
    },
    row: {
      gap: verticalScale(12),
    },
  });
  return styles;
};
