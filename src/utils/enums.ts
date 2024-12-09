export enum IPayDuration {
  HOURLY = 'Hourly',
  DAILY = 'Daily',
}

export enum IJobTypesEnum {
  EVENT = 'event',
  STATIC = 'static',
}

export enum IJobPostStatus {
  OPEN = 's0',
  CLOSED = 's1',
  APPLIED = 's2',
  DECLINED = 's3',
  CONFIRMED = 's4',
  NO_SHOW = 's5',
  COMPLETED = 's6',
  CANCELED = 's7',
}

export enum IUserTypeEnum {
  CLIENT = 'client',
  EMPLOYEE = 'emp',
}

export enum ICandidateStatusEnum {
  pending = 1,
  selected = 2,
  declined = 3,
}

export enum IHelpAndSupportTicketStatus {
  OPEN = 's0',
  CLOSED = 's1',
  RESOLVED = 's2',
}

export enum IClientStatus {
  PENDING = 's0',
  ACTIVE = 's1',
  INACTIVE = 's2',
}

export enum IDocumentNames {
  GOVT_ID = 'd0',
  DIRECT_DEPOSIT_VOID_CHEQUE = 'd1',
  SIN_DOCUMENT = 'd2',
  SECURITY_DOCUMENT_BASIC = 'd3',
  SECURITY_DOCUMENT_ADV = 'd4',
  SUPPORTING_DOCUMENT = 'd5',
  RESUME = 'd6',
  NULL = 'd7',
}

export enum IEmployeeDocsApiKeys {
  SIN_DOCUMENT = 'sinDocument',
  LICENSE_ADVANCE = 'securityDocumentAdv',
  LICENSE_BASIC = 'securityDocumentBasic',
  SUPPORTING_DOCUMENT = 'supportingDocument',
  GOVT_ID = 'govtid',
  CHEQUE = 'directDepositVoidCheque',
  RESUME = 'resume',
  NULL = 'null',
}
