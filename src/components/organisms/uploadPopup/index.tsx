/* eslint-disable no-catch-shadow */
/* eslint-disable @typescript-eslint/no-shadow */
import {Text, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import SelectImagePopup from '@components/molecules/selectimagepopup';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {ISelectedAsset} from '@components/molecules/selectimagepopup/types';
import {useTheme} from '@theme/Theme.context';
import {PredefinedCertificates} from '@screens/auth/signup/jobseekerDetailsAndDocs/jobSeekerDetailsSteps/jobSeekerDetailsStepsThree/types';
import UploadedAssetCard from '@components/doucment/UploadedAssetCard';
import DocAddButton from '@components/doucment/DocAddButton';
import DocUploadView from '@components/doucment/DocUploadView';
import PredefinedCertificatesCard from '@components/doucment/PredefinedCertificatesCard';
import useUploadAssets from 'src/hooks/useUploadAsset';
import {handleDocumentDisplayStatus, IFile} from './types';
import {setFileName} from '@utils/constants';
import {IOtherDocument} from '../uploadOtherCertificateBottomSheet';

type IUploadDocViewPropTypes = {
  title: string;
  error: string;
  multipleLimit?: number;
  isOtherType?: boolean;
  getSelectedDocumentIds?: (ids: number[]) => void;
  predefinedCertificates?: PredefinedCertificates[];
  onPressOther?: () => void;
  getSelectedDocuments?: (ids: IFile[] | IOtherDocument[]) => void;
  initialDocuments?: IFile[] | IOtherDocument[] | [];
  getPredefinedCertificates?: (certificates: PredefinedCertificates[]) => void;
};

const UploadDocView: React.FC<IUploadDocViewPropTypes> = ({
  title,
  error,
  multipleLimit = 1,
  getSelectedDocuments,
  initialDocuments,
  isOtherType,
  predefinedCertificates,
  onPressOther,
  getSelectedDocumentIds,
  getPredefinedCertificates,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const {theme} = useTheme();
  const {uploadImage} = useUploadAssets();
  const [files, setFiles] = useState<IFile[]>([]);
  const [uploadError, setUploadError] = useState<string>('');
  const [preCertificates, setPredefinedCertificates] = useState<
    Map<number, PredefinedCertificates>
  >(new Map());
  const [imageSelectionLimit, setImageSelectionLimit] = useState<number>(1);
  const compRef = useRef<BottomSheetMethods | null>(null);
  const [currentSelectedCertificates, setCurrentSelectedCertificates] =
    useState<number>(0);

  const docDisplayStatus = handleDocumentDisplayStatus(preCertificates, files);

  useEffect(() => {
    if (initialDocuments?.length) {
      setFiles(initialDocuments);
      setImageSelectionLimit(prev => prev++);
    } else {
      setFiles([]);
      setImageSelectionLimit(1);
    }
  }, [initialDocuments]);

  useEffect(() => {
    if (predefinedCertificates) {
      let perCertificates = new Map(
        predefinedCertificates.map((certificate, index) => [
          index,
          certificate,
        ]),
      );
      setPredefinedCertificates(perCertificates);
    }
  }, [predefinedCertificates]);

  // to set error if document choose failed
  useEffect(() => {
    setUploadError(error);
  }, [error]);

  const onPressChooses = () => {
    if (isOtherType) {
      onPressOther && onPressOther();
    } else {
      displayPopup();
    }
  };

  // to display the choose popup
  const displayPopup = useCallback(() => {
    compRef.current?.snapToIndex(1);
  }, []);

  /**
   * to upload predefined certificates
   * @param document - The certificate to be uploaded.
   *
   * @returns void
   *
   * @throws Logs an error message to the console if the upload fails.
   */
  const onPressPredefinedCertificates = async (asset: IFile) => {
    try {
      let currentCertificates = new Map(preCertificates);
      const selectedCertificates = currentCertificates.get(
        currentSelectedCertificates,
      );
      if (selectedCertificates) {
        currentCertificates.set(currentSelectedCertificates, {
          ...selectedCertificates,
          value: asset,
        });
        setPredefinedCertificates(currentCertificates);
      }
      const response = await uploadImage({asset: [asset]});
      if (response) {
        setPredefinedCertificates(prev => {
          let prevCertificates = new Map(prev);
          const currentCertificates = prevCertificates.get(
            currentSelectedCertificates,
          );
          if (currentCertificates) {
            preCertificates.set(currentSelectedCertificates, {
              ...currentCertificates,
              value: response[0],
            });
          }
          const certificatesArray =
            convertMapOfCertificatesToArray(prevCertificates);
          getPredefinedCertificates &&
            getPredefinedCertificates(certificatesArray);
          return prevCertificates;
        });
      }
    } catch (error) {
      console.log(error);
      setUploadError('Document upload Failed. Please try again');
    }
  };

  // to handle the process once a document is selected from the popup
  const handleSelectedAssets = (asset: ISelectedAsset) => {
    if (predefinedCertificates) {
      onPressPredefinedCertificates(asset.assets[0]);
    } else {
      handleDocumentUploadSimple(asset);
    }
  };

  /**
   * to upload simple docs
   * @param document - The document to be uploaded.
   *
   * @returns void
   *
   * @throws Logs an error message to the console if the upload fails.
   */
  const handleDocumentUploadSimple = async (document: ISelectedAsset) => {
    try {
      // Update the fileName for each asset
      document.assets.forEach(asset => {
        asset.fileName = setFileName(asset.fileName, title);
        asset.status = 'pending';
      });

      // Show the uploading documents by setting the current assets to the state
      setFiles(prevFiles => [...prevFiles, ...document.assets]);

      // Clear any previous upload error
      setUploadError('');

      // Upload the assets
      const assetResponse = await uploadImage({
        asset: document.assets,
      });

      if (assetResponse) {
        // After upload, update the files state with the response
        setFiles(prevFiles => {
          // Update the state with the new assets
          const updatedFiles = prevFiles.map(file => {
            const uploadedFile = assetResponse.find(
              asset => asset.fileName === file.fileName,
            );
            return uploadedFile || file;
          });

          // Extract IDs for the selected assets
          const selectedAssetsIds = updatedFiles.map(file => file.id ?? 0);

          // Update image selection limit
          setImageSelectionLimit(
            prevCount => prevCount + document.assets.length,
          );

          // Pass selected asset IDs to the parent callback if available
          if (getSelectedDocumentIds) {
            getSelectedDocumentIds(selectedAssetsIds);
          }

          return updatedFiles;
        });
      }
    } catch (error) {
      console.error(error, 'Document upload Error');
      // If an error occurs, update the state of the assets that failed to upload
      setFiles(prevFiles => {
        const failedAssets = document.assets.map(asset => {
          asset.status = 'failed';
          return asset;
        });
        return prevFiles.map(file => {
          const failedFile = failedAssets.find(
            asset => asset.fileName === file.fileName,
          );
          return failedFile || file;
        });
      });

      setUploadError('Document upload Failed. Please try again');
    }
  };

  /**
   * Retry the upload operation in case of an error
   * @param document - The document to be uploaded again.
   *
   * @returns void
   *
   * @throws Logs an error message to the console if the upload fails.
   */
  const retryDocumentUpload = async (asset: IFile, index: number) => {
    try {
      setFiles(prev => {
        let prevFiles = [...prev];
        prevFiles[index].status = 'pending';
        return prevFiles;
      });
      setUploadError('');
      const assetResponse = await uploadImage({
        asset: [asset],
      });
      if (assetResponse) {
        setFiles(prev => {
          let prevFiles = [...prev];
          prevFiles[index] = assetResponse[0];
          return prevFiles;
        });
        const selectedAssetsIds = files.map(file => file.id ?? 0);
        getSelectedDocumentIds && getSelectedDocumentIds(selectedAssetsIds);
      }
    } catch (error) {
      setUploadError('Document upload Failed. Please try again');
    }
  };

  /**
   * Removes the uploaded document
   * @param index - The index of the document to be removed.
   *
   * @returns void
   *
   * @throws Logs an error message to the console if the upload fails.
   */
  const onPressCrossDocument = (index: number) => {
    const preImages = [...files];
    preImages.splice(index, 1);
    setFiles(preImages);
    const selectedAssetsIds = preImages.map(file => file.id ?? 0);
    getSelectedDocuments && getSelectedDocuments(preImages);
    getSelectedDocumentIds && getSelectedDocumentIds(selectedAssetsIds);
    setImageSelectionLimit(prev => --prev);
  };

  /**
   * executes when we press on the certificate
   * @param index - The index of the certificate that has been pressed
   *
   * @returns void
   *
   * @throws Logs an error message to the console if the upload fails.
   */
  const onPressCertificates = (index: number) => {
    setCurrentSelectedCertificates(index);
    displayPopup();
  };

  /**
   * executes when we press cross on the upload certificate
   * @param index - The index of the certificate that has been pressed
   *
   * @returns void
   *
   * @throws Logs an error message to the console if the upload fails.
   */
  const onPressCrossCertificates = (index: number) => {
    setPredefinedCertificates(prev => {
      const prevCert = new Map(prev);
      const currentCert = prevCert.get(index);
      if (currentCert) {
        if (currentCert.isCustom) {
          prevCert.delete(index);
        } else {
          prevCert.set(index, {...currentCert, value: null});
        }
      }
      const certificatesArray = convertMapOfCertificatesToArray(prevCert);
      getPredefinedCertificates && getPredefinedCertificates(certificatesArray);
      return prevCert;
    });
  };

  const convertMapOfCertificatesToArray = (
    certificates: Map<number, PredefinedCertificates>,
  ) => {
    const preImages = Array.from(certificates.values());
    return preImages;
  };

  /**
   * executes when we press the retry button in case document upload fails
   * @param index - The index of the certificate that has been pressed
   *
   * @returns void
   *
   * @throws Logs an error message to the console if the upload fails.
   */
  const retryCertificateUpload = (
    index: number,
    certificate: PredefinedCertificates,
  ) => {
    if (certificate.value) {
      setCurrentSelectedCertificates(index);
      onPressPredefinedCertificates(certificate.value);
    }
  };

  return (
    <>
      <View
        style={[
          styles.container,
          uploadError.length > 0 && {borderColor: theme.color.red},
        ]}>
        <Text
          style={[
            styles.title,
            uploadError.length > 0 && {
              color: theme.color.red,
            },
          ]}>
          {title}
        </Text>

        {docDisplayStatus === 'files' && (
          <View style={styles.assetsView}>
            {files.map((file, index) => (
              <UploadedAssetCard
                key={`${file.fileName}${index}`}
                fileName={file.fileName}
                uploadStatus={file.status}
                size={file.size}
                onPressCross={() => onPressCrossDocument(index)}
                retryOnFailure={() => retryDocumentUpload(file, index)}
              />
            ))}
            {/* Add button in case of multiselect option */}
            {imageSelectionLimit < multipleLimit && (
              <DocAddButton onPress={onPressChooses} />
            )}
          </View>
        )}
        {docDisplayStatus === 'uploadView' && (
          <DocUploadView onPresUpload={onPressChooses} />
        )}
        {docDisplayStatus === 'predefinedCertificates' && (
          <View style={styles.assetsView}>
            {Array.from(preCertificates).map(([index, certificate]) => {
              return (
                <PredefinedCertificatesCard
                  key={index}
                  certificate={certificate.name}
                  value={certificate.value}
                  onPressUpload={() => onPressCertificates(index)}
                  onPressCross={() => onPressCrossCertificates(index)}
                  uploadStatus={certificate.value?.status ?? 'pending'}
                  onPressRetry={() =>
                    retryCertificateUpload(index, certificate)
                  }
                />
              );
            })}
          </View>
        )}
        <SelectImagePopup
          isDocumentMultiple={multipleLimit !== 1}
          selectionLimit={multipleLimit}
          getSelectedImages={asset => handleSelectedAssets(asset)}
          compRef={compRef}
        />
      </View>
      {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}
    </>
  );
};

export default UploadDocView;
