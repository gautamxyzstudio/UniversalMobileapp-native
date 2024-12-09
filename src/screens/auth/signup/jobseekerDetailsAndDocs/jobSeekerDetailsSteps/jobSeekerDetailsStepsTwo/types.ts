export type jobSeekerDetailsStepTwoState = {
  backAccountNumber: string;
  institutionNumber: string;
  transitNumber: string;
  cheque: number | null;
  sinNumber: string;
  sinDocument: number | null;
  bankAccountNumberError: string;
  institutionNumberError: string;
  transitNumberError: string;
  chequeError: string;
  sinNumberError: string;
  sinDocumentError: string;
};

export type userBankingDetails = {
  bankAcNo: string;
  institutionNumber: string;
  trasitNumber: string;
  directDepositVoidCheque: number;
  sinNumber: string;
  sinDocument: number;
};

export type IDocument = {
  name: string;
  Document: number;
};

export type jobSeekerSecRef = {
  validate?: () => Promise<{
    fields: userBankingDetails;
    documents: IDocument[];
    isValid: boolean;
  }>;
};
