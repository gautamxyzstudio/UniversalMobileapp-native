import {View} from 'react-native';
import React, {useMemo} from 'react';
import {verticalScale} from '@utils/metrics';

type ISpacerProps = {
  type: 'horizontal' | 'vertical';
  size?: number;
  scalable?: boolean;
};

const Spacers: React.FC<ISpacerProps> = ({type, size, scalable = true}) => {
  let defaultSize = useMemo(() => 24, []);
  return (
    <View
      style={[
        type === 'horizontal'
          ? {
              width: scalable ? verticalScale(size ?? 24) : size ?? defaultSize,
            }
          : {
              height: scalable
                ? verticalScale(size ?? 24)
                : size ?? defaultSize,
            },
      ]}
    />
  );
};

export default Spacers;
