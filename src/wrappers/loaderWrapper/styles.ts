import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  childrenContainer: {
    flex: 1,
  },
  loaderBlackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loaderWhiteContainerView: {
    height: 130,
    width: 150,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  loaderText: {
    marginBottom: -10,
    marginTop: 5,
    color: '#131007',
    fontSize: 16,
    fontWeight: '500',
  },
});
