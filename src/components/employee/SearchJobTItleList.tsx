/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, View, FlatList, ListRenderItem} from 'react-native';
import React, {useCallback} from 'react';
import HighlightText from '@sanar/react-native-highlight-text';
import {fonts} from '@utils/common.styles';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {verticalScale} from '@utils/metrics';

type SearchJobTitleListPropsType = {
  data: {id: number; title: string}[];
  search: string;
  onPressSuggestion: (item: {id: number; title: string}) => void;
};

const SearchJobTitleList: React.FC<SearchJobTitleListPropsType> = ({
  data,
  search,
  onPressSuggestion,
}) => {
  const styles = useThemeAwareObject(createStyles);

  const renderItem: ListRenderItem<{id: number; title: string}> = useCallback(
    ({item}) => {
      return (
        <HighlightText
          onPress={() => onPressSuggestion(item)}
          highlightStyle={styles.highlight}
          searchWords={[search]}
          style={styles.title}
          textToHighlight={item.title}
        />
      );
    },
    [search, styles.highlight, styles.title],
  );

  const itemSeparator = useCallback(() => {
    return <View style={styles.separator} />;
  }, []);

  return (
    <View style={styles.flex}>
      <FlatList
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={itemSeparator}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default SearchJobTitleList;

const createStyles = ({color}: Theme) => {
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    title: {
      color: color.disabled,
      ...fonts.regular,
    },
    highlight: {
      color: color.textPrimary,
      ...fonts.regular,
    },
    separator: {
      height: verticalScale(1),
      width: '100%',
      backgroundColor: color.grey,
      marginVertical: 10,
    },
  });
};
