import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import {verticalScale, windowWidth} from '@utils/metrics';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {useTheme} from '@theme/Theme.context';
import {IJobFilters} from 'src/constants/constants';

type IFiltersPropsTypes = {
  filters: IJobFilters[];
  isLoading: boolean;
  onFilterPress: (filter: IJobFilters) => void;
  selectedFilterId: number;
};

const Filters: React.FC<IFiltersPropsTypes> = ({
  filters,
  onFilterPress,
  isLoading,
  selectedFilterId,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const {theme} = useTheme();
  return (
    <View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        horizontal>
        <View style={styles.spacer} />
        {isLoading ? (
          <View style={styles.skelton} />
        ) : (
          <>
            {filters.map(filter => (
              <Pressable
                onPress={() => onFilterPress(filter)}
                style={[
                  styles.filter,
                  selectedFilterId === filter.id && {
                    backgroundColor: theme.color.darkBlue,
                  },
                ]}
                key={filter.id}>
                <Text
                  style={[
                    styles.filterText,
                    selectedFilterId === filter.id && {
                      color: theme.color.primary,
                    },
                  ]}>
                  {filter.name}
                </Text>
              </Pressable>
            ))}
          </>
        )}

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

export default memo(Filters);

const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    contentContainer: {
      gap: verticalScale(8),
    },
    skelton: {
      height: verticalScale(32),
      width: windowWidth - verticalScale(40),
      backgroundColor: theme.color.skelton,
      borderRadius: 8,
    },
    filter: {
      paddingHorizontal: verticalScale(12),
      paddingVertical: verticalScale(7),
      borderRadius: 20,
      backgroundColor: theme.color.lightGrey,
    },
    filterText: {
      ...fonts.regular,
      color: theme.color.textPrimary,
    },
    spacer: {
      width: verticalScale(24),
    },
  });
  return styles;
};
