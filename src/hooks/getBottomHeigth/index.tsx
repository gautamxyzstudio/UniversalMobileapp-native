import {verticalScale} from '@utils/metrics';
import {Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const useBottomSafeAreaHeight = () => {
  const bottom = useSafeAreaInsets().bottom;
  console.log(bottom);
  return Platform.OS === 'ios' ? bottom + verticalScale(5) : verticalScale(24); // Adjusted for iOS bottom inset
};

export default useBottomSafeAreaHeight;
