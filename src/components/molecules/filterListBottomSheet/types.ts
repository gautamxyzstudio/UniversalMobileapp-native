export type IFilterListBottomSheetProps = {
  filters: IFilterSheet[];
  snapPoints: number[];
  title?: string;
  isMultiSelect?: boolean;
  getAppliedFilters: (values: string[]) => void;
  buttonTitle?: string;
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
};
