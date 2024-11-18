import {writeFile, DocumentDirectoryPath} from 'react-native-fs';
import XLSX from 'xlsx';
import Share from 'react-native-share';
import {showToast} from '@components/organisms/customToast';
import {ToastType} from 'react-native-toast-notifications';

export const writeDataAndDownloadExcelFile = (
  data: {[key: string]: string}[],
  fileName: string,
  columnWidths: {wch: number}[],
  emptyMessage: string,
  toast: ToastType,
) => {
  let wb = XLSX.utils.book_new();
  if (data.length === 0) {
    let ws = XLSX.utils.aoa_to_sheet([[`${emptyMessage}`]]);
    ws['!cols'] = [{wch: 100}];
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
  } else {
    let ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = columnWidths;
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
  }

  const writingData = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});
  writeFile(DocumentDirectoryPath + `/${fileName}.xlsx`, writingData, 'ascii')
    .then(async () => {
      const res = await shareExcelFile(fileName);
      if (res) {
        showToast(toast, 'Excel file downloaded successfully!!', 'success');
      }
    })
    .catch(e => {
      showToast(toast, 'Error while downloading Excel file', 'error');
      console.log('Error', e);
    });
};

export const shareExcelFile = async (fileName: string) => {
  const filePath = `${DocumentDirectoryPath}/${fileName}.xlsx`;
  try {
    const response = await Share.open({
      url: `file://${filePath}`,
      title: 'Excel File',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    if (response) {
      return true;
    }
    return false;
  } catch (error) {
    const {message} = error as any;
    if (message === 'User did not share') {
      return false;
    } else {
      throw error;
    }
  }
};
