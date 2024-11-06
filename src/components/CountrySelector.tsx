import { useState } from "react";
import { CountryDropdown } from "react-country-region-selector";

interface ICountrySelectorProps {
  getSelectedCountry: any;
}

const CountrySelector = (props: ICountrySelectorProps) => {
  const { getSelectedCountry } = props;
  const [countryInfo, setCountryInfo] = useState({ country: "", region: "" });

  const selectCountry = (val: any) => {
    setCountryInfo((prev) => ({ ...prev, country: val }));
    getSelectedCountry(val);
  };

  return (
    <div>
      <CountryDropdown
        classes={"country-selector w-full h-8 border border-primary-light-900"}
        value={countryInfo.country}
        onChange={(val) => selectCountry(val)}
      />
    </div>
  );
};

export default CountrySelector;
