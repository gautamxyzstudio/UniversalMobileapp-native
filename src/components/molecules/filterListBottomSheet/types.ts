export type IFilterListBottomSheetProps = {
  filters: IFilterSheet[];
  snapPoints: number[];
  title?: string;
  selectionType: 'multiSelect' | 'singleSelect' | 'singleOptionSelect';
  initialSelectedOptions?: string[];
  getAppliedFilters: (
    values: string[],
    dateRange?: {startDate: Date; endDate: Date},
  ) => void;
  withClearButton: boolean;
  buttonTitle?: string;
  onPressClear?: () => void;
  filterDate?: {startDate: Date; endDate: Date};
};

export type IFilterSheet = {
  id: number;
  title: string;
  value: filterValue[];
};

export type filterValue = {
  id: number;
  subTitle: string;
  isSelected?: boolean;
  rowId: number;
};

export type ISelectedOption = Map<string, filterValue>;
