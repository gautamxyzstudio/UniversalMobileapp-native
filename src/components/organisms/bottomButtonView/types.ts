export interface IButtonButtonView {
  disabled: boolean;
  onButtonPress: () => void;
  title?: string;
  backgroundColor?: string;
  rippleColor?: string;
  isLoading?: boolean;
  isMultiple?: boolean;
  secondaryButtonTitles?: string;
  onPressSecondaryButton?: () => void;
  buttonType?: 'outline' | 'filled';
}
