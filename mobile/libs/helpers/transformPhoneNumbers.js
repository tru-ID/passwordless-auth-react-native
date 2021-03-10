// transform phone numbers to the form 4155550100
export const transformPhoneNumber = (callingCode, phoneNumber) => {
  let transformNorthAmericanNumbers = '';
  if (callingCode === '+1') {
    // transform US, Canada numbers from (415) 555-0100 to 4155550100
    transformNorthAmericanNumbers = phoneNumber.includes('(')
      ? phoneNumber
          .trim()
          .split('(')[1]
          .split(')')
          .join('')
          .split('-')
          .join('')
          .split(' ')
          .join('')
      : phoneNumber;
  }
  // check if there's a space i.e. user copied phone number e.g. 07700 900000 and remove the space
  const phone_number = phoneNumber.trim().includes(' ')
    ? phoneNumber.split(' ').join('')
    : phoneNumber.trim();
  const splitNumber = phone_number.split('');
  const checkLeadingZero = splitNumber[0] === '0';
  if (checkLeadingZero) {
    const number =
      callingCode.split('+')[1] +
      splitNumber.splice(1, splitNumber.length - 1).join('');
    return number;
  }

  return transformNorthAmericanNumbers
    ? callingCode.split('+')[1] + transformNorthAmericanNumbers
    : callingCode.split('+')[1] + phone_number;
};
