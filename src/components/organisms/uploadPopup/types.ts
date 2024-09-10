import {PredefinedCertificates} from '@screens/auth/signup/jobseekerDetailsAndDocs/jobSeekerDetailsSteps/jobSeekerDetailsStepsThree/types';
import {IDocument} from '@utils/doumentManager';
import {IImage} from '@utils/photomanager';

export const handleDocumentDisplayStatus = (
  predefinedCertificates: Map<number, PredefinedCertificates>,
  files: IImage[] | IDocument[],
) => {
  if (files.length > 0) {
    return 'files';
  } else if (predefinedCertificates?.size > 0) {
    return 'predefinedCertificates';
  } else {
    return 'uploadView';
  }
};

export interface IFile extends IDocument, IImage {
  index?: number;
  errorMessage?: string;
}
