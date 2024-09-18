import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import SearchInput from '@components/molecules/InputTypes/SearchInput';
import {useNavigation} from '@react-navigation/native';
import ShortlistedCandidateCard from '@components/client/ShortlistedCandidateCard';

const ShortListedCandidates = () => {
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  const onChangeSearch = (e: string) => {
    setSearch(e);
  };

  const onPresCrossSearch = () => {
    setSearch('');
  };

  return (
    <OnBoardingBackground isInlineTitle title={STRINGS.check_in}>
      <SearchInput
        value={search}
        onChangeText={e => onChangeSearch(e)}
        onPressCross={onPresCrossSearch}
        placeHolder={STRINGS.search}
        withBack={false}
        navigation={navigation}
      />
      <View>
        <ShortlistedCandidateCard />
      </View>
    </OnBoardingBackground>
  );
};

export default ShortListedCandidates;

const styles = StyleSheet.create({});
