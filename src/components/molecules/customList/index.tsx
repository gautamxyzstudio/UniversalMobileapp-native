/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useCallback} from 'react';
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  RefreshControl,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {styles} from './styles';
import {verticalScale} from '@utils/metrics';
import {FlashList, FlashListProps, ListRenderItem} from '@shopify/flash-list';
import {useTheme} from '@theme/Theme.context';

export interface ICustomList<T> extends FlashListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T> | null | undefined;
  error: any | null;
  betweenItemSpace?: number; // space between items
  isRefreshing?: boolean;
  withRefreshing?: boolean;
  ItemSeparatorComponent?: React.ComponentType<any> | null | undefined; // render between items component
  refreshAfterError?: () => void; // refetch after api fail
  bottomSpace?: number; // add bottom space to list
  ListFooterComponent?:
    | React.ComponentType<any>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | null
    | undefined; // list footer component
  onRefresh?: () => void;
  blankViewStyles?: StyleProp<ViewStyle>;
  emptyListMessage?: string | undefined;
  isLastPage: boolean;
}

const CustomList = <T,>({
  renderItem,
  refreshAfterError,
  ItemSeparatorComponent,
  betweenItemSpace,
  withRefreshing = true,
  bottomSpace,
  ListFooterComponent,
  emptyListMessage,
  blankViewStyles,
  isLastPage,
  isRefreshing,
  onRefresh,
  data = [],
  error,
  ...flatlistProps
}: ICustomList<T>) => {
  const theme = useTheme();
  const itemSeparatorComponent = useCallback(() => {
    return <View style={{height: verticalScale(betweenItemSpace ?? 20)}} />;
  }, [data]);

  const itemFooterComponent = useCallback(() => {
    if (!isLastPage) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator color={theme.theme.color.darkBlue} size="large" />
        </View>
      );
    } else {
      return <View style={{height: bottomSpace ?? 50}} />;
    }
  }, [isLastPage]);

  const renderEmptyView = () => {
    return (
      <View style={[styles.blankView, blankViewStyles]}>
        {/* <EmptyState
            data={data}
            errorObj={error}
            emptyListMessage={emptyListMessage}
            refreshHandler={refreshAfterError}
          /> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={data}
        keyboardDismissMode={'none'}
        ListEmptyComponent={renderEmptyView}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item}${index}`}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={
          ItemSeparatorComponent ?? itemSeparatorComponent
        }
        ListFooterComponent={ListFooterComponent ?? itemFooterComponent}
        refreshControl={
          withRefreshing ? (
            <RefreshControl
              colors={[theme.theme.color.blue, theme.theme.color.darkBlue]}
              refreshing={isRefreshing ?? false}
              onRefresh={onRefresh}
            />
          ) : undefined
        }
        {...flatlistProps}
      />
    </View>
  );
};

export default CustomList;
