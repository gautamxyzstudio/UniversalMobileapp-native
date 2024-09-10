import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import CustomTextInput from '@components/atoms/customtextInput';
import {STRINGS} from 'src/locales/english';
import {LOCATION_ICON} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';

type ILocationInputPropTypes = {
  onPress: () => void;
  value: string;
  errorMessage: string;
};

const LocationInput: React.FC<ILocationInputPropTypes> = ({
  onPress,
  value,
  errorMessage,
}) => {
  return (
    <View>
      <CustomTextInput
        title={STRINGS.location}
        onTextChange={undefined}
        value={value}
        editable={false}
        keyboardType="email-address"
        right={
          <TouchableOpacity onPress={onPress} style={styles.locationContainer}>
            <LOCATION_ICON
              width={verticalScale(24)}
              height={verticalScale(24)}
            />
          </TouchableOpacity>
        }
        errorMessage={errorMessage}
      />
    </View>
  );
};

export default LocationInput;

const styles = StyleSheet.create({
  locationContainer: {
    marginRight: verticalScale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
