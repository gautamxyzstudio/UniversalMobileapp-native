import {pick, types} from 'react-native-document-picker';

export interface IDocument {
  status: 'pending' | 'success' | 'failed';
  url?: string;
  fileName: string;
  uri: string;
  size: number;
  extension: string;
}

export const documentPicker = async ({
  allowMultiSelection,
}: {
  allowMultiSelection: boolean | undefined;
}): Promise<IDocument[] | null> => {
  try {
    const pickDocument = await pick({
      allowMultiSelection,
      presentationStyle: 'fullScreen',
      type: [types.pdf, types.docx, types.images],
    });
    if (pickDocument) {
      return pickDocument.map(document => ({
        uri: document.uri,
        url: undefined,
        status: 'pending',
        size: document.size ?? 0,
        fileName: document.name ?? 'unknown',
        extension: document.type ?? 'unknown',
      }));
    } else {
      return null;
    }
  } catch (e) {
    console.log(JSON.stringify(e), 'DOCUMENT PICKER ERROR');
    throw new Error('unable to pick document');
  }
};
