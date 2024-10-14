import {StyleSheet, TextInput, View} from 'react-native';
import React, {useRef, useState} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import SearchInput from '@components/molecules/InputTypes/SearchInput';
import {useNavigation} from '@react-navigation/native';
import ShortlistedCandidateCard from '@components/client/ShortlistedCandidateCard';

const ShortListedCandidates = () => {
  const [search, setSearch] = useState('');
  const searchRef = useRef<TextInput | null>(null);
  const navigation = useNavigation();

  const onChangeSearch = (e: string) => {
    setSearch(e);
  };

  const onPresCrossSearch = () => {
    setSearch('');
  };

  const onPressDone = () => {
    console.log(search);
  };

  return (
    <OnBoardingBackground isInlineTitle title={STRINGS.check_in}>
      <SearchInput
        onPressDone={onPressDone}
        value={search}
        inputRef={searchRef}
        onChangeText={e => onChangeSearch(e)}
        onPressCross={onPresCrossSearch}
        placeHolder={STRINGS.search}
        withBack={false}
        navigation={navigation}
        showLoader={false}
      />
      <View>
        <ShortlistedCandidateCard />
      </View>
    </OnBoardingBackground>
  );
};

export default ShortListedCandidates;

const styles = StyleSheet.create({});
