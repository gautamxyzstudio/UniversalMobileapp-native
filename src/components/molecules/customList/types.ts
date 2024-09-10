import {IJobStatus} from '@screens/employeeScreens/employeeJobs/types';
import {Theme} from '@theme/Theme.type';

export const getStatusStylesFromStatus = (status: IJobStatus, theme: Theme) => {
  switch (status) {
    case IJobStatus.CONFIRMED:
      return {
        backgroundColor: theme.color.greenLight,
        color: theme.color.green,
        borderColor: theme.color.green,
      };
    case IJobStatus.IN_PROGRESS:
      return {
        backgroundColor: theme.color.yellowLight,
        color: theme.color.yellow,
        borderColor: theme.color.yellow,
      };
    case IJobStatus.DECLINED:
      return {
        backgroundColor: theme.color.redLight,
        color: theme.color.red,
        borderColor: theme.color.red,
      };
    case IJobStatus.CANCELED:
      return {
        backgroundColor: theme.color.disabledLight,
        color: theme.color.disabled,
        borderColor: theme.color.disabled,
      };
    case IJobStatus.COMPLETED:
      return {
        backgroundColor: theme.color.skyBlueLight,
        color: theme.color.darkBlue,
        borderColor: theme.color.blue,
      };
    case IJobStatus.APPLIED:
      return {
        backgroundColor: theme.color.accentLighter,
        color: theme.color.accent,
        borderColor: theme.color.accent,
      };
    default:
      return null;
  }
};
