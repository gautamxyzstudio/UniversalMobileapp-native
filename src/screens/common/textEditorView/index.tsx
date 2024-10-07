import {Pressable, StyleSheet, Text, View} from 'react-native';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import React, {useEffect, useRef, useState} from 'react';
import SafeAreaView from '@components/safeArea';
import {Row} from '@components/atoms/Row';
import {fonts} from '@utils/common.styles';
import {useKeyboardHeight} from 'src/hooks/useKeyboardHeight';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {STRINGS} from 'src/locales/english';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {useNavigation} from '@react-navigation/native';
import {verticalScale, windowWidth} from '@utils/metrics';
type ITextEditorView = {
  route: {
    params: {
      title: string;
      initialValue: string;
      onGoBack: (data: string) => void;
    };
  };
};

const TextEditorView: React.FC<ITextEditorView> = ({route}) => {
  const {initialValue, onGoBack, title} = route.params;
  const styles = useThemeAwareObject(createStyles);
  const RichText = useRef<RichEditor | null>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const height = useKeyboardHeight();

  const navigation = useNavigation();

  useEffect(() => {
    if (initialValue) {
      setHtmlContent(initialValue);
    }
  }, [initialValue]);

  const onPressDone = () => {
    onGoBack(htmlContent);
    navigation.goBack();
  };

  return (
    <SafeAreaView paddingHorizontal>
      <Row alignCenter spaceBetween>
        <Text style={styles.title}>{title}</Text>
        <Pressable onPress={onPressDone}>
          <Text style={styles.add}>{STRINGS.add}</Text>
        </Pressable>
      </Row>
      <KeyboardAwareScrollView
        style={{height: height, width: windowWidth - verticalScale(24)}}>
        <RichEditor
          disabled={false}
          ref={RichText}
          initialContentHTML={htmlContent}
          style={styles.rich}
          useContainer
          pasteAsPlainText={true}
          styleWithCSS={false}
          placeholder={'Start Writing Here'}
          onChange={text => setHtmlContent(text.trim())}
        />
      </KeyboardAwareScrollView>
      <View style={(styles.toolbar, {bottom: height})}>
        <RichToolbar
          actions={[actions.insertBulletsList, actions.keyboard]}
          editor={RichText}
        />
      </View>
    </SafeAreaView>
  );
};

export default TextEditorView;
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    title: {
      flex: 1,
      ...fonts.headingSmall,
      color: theme.color.textPrimary,
    },
    keyboardAvoidingView: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
    },
    rich: {
      minHeight: 300,
      ...fonts.small,
      flex: 1,
    },
    add: {
      color: theme.color.darkBlue,
      ...fonts.headingSmall,
    },
    toolbar: {
      position: 'absolute',
    },
  });
