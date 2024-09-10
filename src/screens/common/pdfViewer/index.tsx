import {Image, Pressable, SafeAreaView, Text, View} from 'react-native';
import React, {useState} from 'react';
import Pdf from 'react-native-pdf';
import {ActivityIndicator} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {useTheme} from '@theme/Theme.context';
import {ICONS} from '@assets/exporter';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import {IPdfViewerProps} from './types';
import {getImageUrl} from '@utils/constants';

const PdfViewer: React.FC<IPdfViewerProps> = ({route}) => {
  let source = route?.params?.source.uri;

  console.log(getImageUrl(source ?? ''));

  const styles = useThemeAwareObject(getStyles);
  const [state, updateState] = useState<'loading' | 'error' | 'success'>(
    'loading',
  );
  const top = useSafeAreaInsets().top + 10;
  const navigation = useNavigation<NavigationProps>();
  const {theme} = useTheme();

  return (
    <SafeAreaView>
      <View style={[styles.mainView, {marginTop: top}]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image style={{alignSelf: 'flex-end'}} source={ICONS.cross} />
        </Pressable>
      </View>

      {state === 'loading' && (
        <View style={styles.absolute}>
          <ActivityIndicator size={'large'} color={theme.color.red} />
        </View>
      )}
      {state === 'error' && (
        <View style={styles.absolute}>
          <Text style={styles.errorText}>Unable to load pdf</Text>
        </View>
      )}
      <View style={styles.container}>
        <Pdf
          source={{uri: getImageUrl(source ?? '')}}
          onLoadComplete={() => {
            updateState('success');
          }}
          onError={error => {
            updateState('error');
          }}
          style={styles.pdf}
        />
      </View>
    </SafeAreaView>
  );
};

export default PdfViewer;
