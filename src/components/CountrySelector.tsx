import { ReactNode, useState } from "react";
import { CountryDropdown } from "react-country-region-selector";

interface ICountrySelectorProps {
  name?: string;
  validationMessage?: ReactNode;
  getSelectedCountry: any;
}

const CountrySelector = (props: ICountrySelectorProps) => {
  const { name, getSelectedCountry, validationMessage } = props;
  const [countryInfo, setCountryInfo] = useState({ country: "", region: "" });

  const selectCountry = (val: any) => {
    setCountryInfo((prev) => ({ ...prev, country: val }));
    getSelectedCountry(val);
  };

  return (
    <div>
      <CountryDropdown
        name={name}
        classes={"country-selector w-full h-8 border border-primary-light-900"}
        value={countryInfo.country}
        onChange={(val) => selectCountry(val)}
      />

      <div className="text-red-500 text-xs">
        {validationMessage ? validationMessage : null}
      </div>
    </div>
  );
};

export default CountrySelector;
