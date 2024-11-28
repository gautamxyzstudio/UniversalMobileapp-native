import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import HeaderWithBack from '@components/atoms/headerWithBack';
import SafeAreaView from '@components/safeArea';

const PrivacyPolicy = () => {
  const [showLoading, setShowLoading] = useState(true);

  return (
    <SafeAreaView paddingHorizontal>
      <HeaderWithBack headerTitle="Privacy Policy" />
      <View style={styles.flex}>
        {showLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <WebView
          source={{
            uri: 'https://www.termsfeed.com/live/4f3b3dff-89d6-40c3-86c1-fa2c3d8462ec',
          }}
          style={styles.flex}
          onLoadStart={() => setShowLoading(true)}
          onLoadEnd={() => setShowLoading(false)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Optional: Add a semi-transparent background
  },
  flex: {
    flex: 1,
  },
});

export default PrivacyPolicy;
