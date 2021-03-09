import { useRef } from 'react';
import { regions, callingCountries } from 'country-data';
const useTransformCountryCodes = () => {
  // this hook transforms data from the country-data package returns just calling code
  // and country code for europe and North America
  const NorthAmericanCallingCodes = useRef([
    { calling_code: '', country_code: '' },
  ]);
  const WesternEuropeCallingCodes = useRef([
    { calling_code: '', country_code: '' },
  ]);
  const NothernEuropeCallingCodes = useRef([
    { calling_code: '', country_code: '' },
  ]);
  const SouthernEuropeCallingCodes = useRef([
    { calling_code: '', country_code: '' },
  ]);
  for (const callingCountry of callingCountries.all) {
    for (const el of regions.southernEurope.countries) {
      if (el === callingCountry.alpha2) {
        const calling_code = callingCountry.countryCallingCodes[0].split(
          ' '
        )[0];
        // immutably overwrite country calling code
        const newSouthernEuropeCallingCode = [
          ...SouthernEuropeCallingCodes.current,
          { calling_code, country_code: callingCountry.alpha3 },
        ];

        SouthernEuropeCallingCodes.current = newSouthernEuropeCallingCode;
      }
    }
    for (const el of regions.northernEurope.countries) {
      if (el === callingCountry.alpha2) {
        const calling_code = callingCountry.countryCallingCodes[0].split(
          ' '
        )[0];
        // immutably overwrite country calling code
        const newNothernEuropeCallingCode = [
          ...NothernEuropeCallingCodes.current,
          { calling_code, country_code: callingCountry.alpha3 },
        ];

        NothernEuropeCallingCodes.current = newNothernEuropeCallingCode;
      }
    }
    for (const el of regions.westernEurope.countries) {
      if (el === callingCountry.alpha2) {
        const calling_code = callingCountry.countryCallingCodes[0].split(
          ' '
        )[0];

        // immutably overwrite country calling code
        const newWesternEuropeCallingCode = [
          ...WesternEuropeCallingCodes.current,
          { calling_code, country_code: callingCountry.alpha3 },
        ];

        WesternEuropeCallingCodes.current = newWesternEuropeCallingCode;
      }
    }
    for (const el of regions.northernAmerica.countries) {
      if (el === callingCountry.alpha2) {
        const calling_code = callingCountry.countryCallingCodes[0].split(
          ' '
        )[0];
        // immutably overwrite country calling code
        const newNorthAmericanCallingCode = [
          ...NorthAmericanCallingCodes.current,
          { calling_code, country_code: callingCountry.alpha3 },
        ];

        NorthAmericanCallingCodes.current = newNorthAmericanCallingCode;
      }
    }
  }
  // remove initial state from regions calling code

  const lastIndexNA = NorthAmericanCallingCodes.current.length - 1;
  const lastIndexWE = WesternEuropeCallingCodes.current.length - 1;
  const lastIndexNE = NothernEuropeCallingCodes.current.length - 1;
  const lastIndexSE = SouthernEuropeCallingCodes.current.length - 1;

  NorthAmericanCallingCodes.current = NorthAmericanCallingCodes.current.splice(
    1,
    lastIndexNA
  );
  WesternEuropeCallingCodes.current = WesternEuropeCallingCodes.current.splice(
    1,
    lastIndexWE
  );
  NothernEuropeCallingCodes.current = NothernEuropeCallingCodes.current.splice(
    1,
    lastIndexNE
  );
  SouthernEuropeCallingCodes.current = SouthernEuropeCallingCodes.current.splice(
    1,
    lastIndexSE
  );
  return [
    ...NorthAmericanCallingCodes.current,
    ...WesternEuropeCallingCodes.current,
    ...NothernEuropeCallingCodes.current,
    ...SouthernEuropeCallingCodes.current,
  ];
};
export default useTransformCountryCodes;
