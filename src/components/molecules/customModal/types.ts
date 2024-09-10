export type ICustomModalProps = {
  children: React.ReactNode;
  hideOverLay?: boolean;
  hideOnClickOutSide?: boolean;
};

export interface customModalRef {
  handleModalState: (value: boolean) => void;
}
