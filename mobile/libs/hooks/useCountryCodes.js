const useCountryCodes = () => {
  // this hook transforms returns some of the most popular country codes and their Alpha3 tags

  return [
    { calling_code: '+44', country_code: 'GBR' },
    { calling_code: '+1', country_code: 'USA' },
    { calling_code: '+1', country_code: 'CAN' },
    { calling_code: '+33', country_code: 'FRA' },
    { calling_code: '+49', country_code: 'DEU' },
    { calling_code: '+353', country_code: 'IRL' },
    { calling_code: '+47', country_code: 'NOR' },
  ];
};
export default useCountryCodes;
