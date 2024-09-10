import {IDoc} from '@api/features/user/types';
import moment from 'moment';

export const convertDateToDobFormat = (date: Date | null): string | null => {
  if (date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  }
  return null;
};
export const extractTimeFromDate = (date: Date | null): string | null => {
  if (date) {
    const momentDate = moment(date);
    return momentDate.format('hh:mm A');
  }
  return null;
};

// const formattedDate = moment(date).format('D MMM');

export const extractDayAndMonthFromDate = (
  date: Date | null,
): string | null => {
  if (date) {
    const momentDate = moment(date);
    return momentDate.format('D MMM');
  }
  return null;
};

export const formatPhoneNumber = (phoneNumer: string) => {
  const phoneNumber = phoneNumer.replace(/[^\d]/g, '');

  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) {
    return phoneNumber;
  } else if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6,
    )}-${phoneNumber.slice(6, 10)}`;
  }
};

export const decodePhoneNumber = (formattedPhoneNumber: string) => {
  const plainPhoneNumber = formattedPhoneNumber.replace(/[^\d]/g, '');

  return plainPhoneNumber;
};

export const sanitizeFileName = (fileName: string) => {
  return fileName.trim().replace(/[^a-zA-Z0-9]/g, '');
};

export const setFileName = (fileName: string, docName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return fileName;
  }
  let extensionName = fileName.slice(lastDotIndex + 1);
  return `${sanitizeFileName(docName)}.${extensionName}`;
};

export function uniqueID() {
  return Math.floor(Math.random() * Date.now());
}

export const isValidSinNumber = (number: string): boolean => {
  number = number.replace(/\D/g, '');
  if (number.length !== 9) {
    return false;
  }
  let sum = 0;
  for (let i = 0; i < number.length; i++) {
    let digit = parseInt(number[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

export const generateUniqueUserName = (email: string) => {
  const frontPart = email.split('@')[0];
  const backPart = Math.random() * 10;
  return `${frontPart}${backPart.toFixed(0)}`;
};

export const isValidContact = (num: string) => {
  const regex = /^\d{10}$/;
  return regex.test(num);
};

export const phoneNumberWithCountryCode = (code: string, phone: string) =>
  `+${code}${phone}`;

/**
 * Extracts a 10-digit phone number from a string, removing any country code or non-digit characters.
 *
 * @param number - The phone number string with potential country code and formatting.
 * @returns The last 10-digit phone number if valid, or null if not enough digits are present.
 */
export const getPhoneNumberAndCountryCode = (
  number: string,
): {countryCode: string | null; phoneNumber: string | null} => {
  // Remove all non-digit characters
  const digitsOnly = number.replace(/\D/g, '');

  // Check if there are at least 10 digits for the phone number
  if (digitsOnly.length >= 10) {
    // Extract the last 10 digits as the phone number
    const phoneNumber = digitsOnly.slice(-10);

    // Extract the country code (remaining digits before the phone number)
    const countryCode = digitsOnly.slice(0, -10) || null;

    return {countryCode, phoneNumber};
  } else {
    // Return nulls if there are less than 10 digits
    return {countryCode: null, phoneNumber: null};
  }
};

export const getImageUrl = (image: string | null): string | null => {
  if (image) {
    return `${process.env.BASE_URL}${image}`;
  }
  return null;
};

export const getImageId = (image: IDoc | undefined) => {
  const item = image && image;
  if (typeof item === 'object' && item) {
    return item.id;
  } else {
    return 0;
  }
};

export const getImageDetails = (
  image: IDoc | undefined,
):
  | {url: string; mime: string; id: number; name: string; size: number}
  | undefined => {
  const item = image;
  if (typeof item === 'object' && item) {
    return {
      ...item,
    };
  }
  return undefined;
};

export const convertArrayOfStringsToUlLi = (data: string[]) => {
  return `
    <ul>
      ${data.map(item => `<li>${item}</li>`).join('')}
    </ul>
  `;
};

export const getJobAddress = ({
  address,
  location,
  city,
  postalCode,
}: {
  address: string;
  location: string;
  city: string;
  postalCode: string;
}) => {
  return `${address},${location},${city},${postalCode}`;
};
