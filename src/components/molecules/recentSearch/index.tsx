import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {STRINGS} from 'src/locales/english';
import {fonts} from '@utils/common.styles';
import {IC_CROSS, IC_NO_RECENT} from '@assets/exporter';
import {Row} from '@components/atoms/Row';
import {verticalScale} from '@utils/metrics';
import BrTag from '@components/atoms/brTag';
import EmptyState from '@screens/common/emptyAndErrorScreen';

type RecentSearchesPropTypes = {
  searches: string[];
  onPressRecentSearch: (search: string) => void;
  onPressCross: (search: string) => void;
};

const RecentSearches: React.FC<RecentSearchesPropTypes> = ({
  searches,
  onPressRecentSearch,
  onPressCross,
}) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(searches);
  }, [searches]);

  const styles = useThemeAwareObject(createStyles);
  return (
    <View style={styles.container}>
      {recentSearches.length > 0 ? (
        <>
          <Row alignCenter style={styles.row} spaceBetween>
            <Text style={styles.heading}>{STRINGS.recent_Search}</Text>
          </Row>
          <ScrollView>
            {recentSearches.map((search, index) => {
              const withBr = recentSearches.length - 1 !== index;
              return (
                <View key={index}>
                  <TouchableOpacity onPress={() => onPressRecentSearch(search)}>
                    <Row alignCenter style={styles.row} spaceBetween>
                      <Text style={styles.title}>{search}</Text>
                      <TouchableOpacity onPress={() => onPressCross(search)}>
                        <IC_CROSS />
                      </TouchableOpacity>
                    </Row>
                  </TouchableOpacity>
                  {withBr && <BrTag />}
                </View>
              );
            })}
          </ScrollView>
        </>
      ) : (
        <View style={styles.empty}>
          {recentSearches.length === 0 && (
            <EmptyState
              emptyListIllustration={IC_NO_RECENT}
              emptyListMessage={STRINGS.start_your_job_search_today}
              emptyListSubTitle={STRINGS.find_the_perfect_job}
              errorObj={undefined}
              data={searches}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default RecentSearches;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
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
    empty: {
      flex: 1,
      marginBottom: verticalScale(200),
    },
  });
  return styles;
};
