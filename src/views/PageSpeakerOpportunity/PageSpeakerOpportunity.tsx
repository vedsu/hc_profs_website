import jsonToFormData from "json-form-data";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import React, { BaseSyntheticEvent, useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import ButtonCustom from "../../components/ButtonCustom";
import DialogCustom from "../../components/DialogCustom";
import Input from "../../components/Input";
import { FORM_DATA_OPTIONS } from "../../constant";
import SpeakerService from "../../services/SpeakerService";
import { validatePostRequest } from "../../utils/commonUtils";

const initialSpeakerFormData = {
  name: "",
  email: "",
  education: "",
  country: "",
  phone: "",
  industry: "Others",
  bio: "",
};

const industryOptions = [
  "Nursing",
  "Healthcare Management",
  "Medical Billing and Coding",
  "HIPAA and Compliance",
  "E/M Services",
  "Hospital and Compliance",
  "Hospice and Home Care",
  "CMS Compliance",
  "CPT/ ICD Updates",
  "Others",
];

function PageSpeakerOpportunity() {
  const [speakerFormData, setSpeakerFormData] = React.useState(
    initialSpeakerFormData
  );
  const [showSpeakerOpportunityPopUp, setShowSpeakerOpportunityPopUp] =
    useState({
      isSuccess: false,
      showPopUp: false,
      headerContent: <div />,
      bodyContent: <div />,
    });
  const simpleValidator = useRef(
    new SimpleReactValidator({ className: "text-danger" })
  );
  const [_, forceUpdate] = useState<any>();

  /*------------Event Handlers----------- */

  const handleSpeakerFormInputChange = (e: BaseSyntheticEvent) => {
    setSpeakerFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleIndustryChange = (e: DropdownChangeEvent) => {
    setSpeakerFormData((prev) => ({
      ...prev,
      [e.target.name]: e.value,
    }));
  };

  const onSubmitSpeakerOpportunityForm = async () => {
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate("");
      return;
    }

    const jsonPayload = {
      Name: speakerFormData.name,
      Email: speakerFormData.email,
      Education: speakerFormData.education,
      Country: speakerFormData.country,
      Phone: speakerFormData.phone,
      Industries: speakerFormData.industry,
      Bio: speakerFormData.bio,
    };

    const formDataPayload = jsonToFormData(jsonPayload, FORM_DATA_OPTIONS);

    try {
      const response = await SpeakerService.createSpeakerOpportunity(
        "speakeropportunity",
        formDataPayload
      );

      if (validatePostRequest(response)) {
        setShowSpeakerOpportunityPopUp({
          isSuccess: true,
          showPopUp: true,
          headerContent: <h1 className="text-2xl">Thank You!</h1>,
          bodyContent: (
            <div className="p-5">
              <p>{response?.data?.Message}.</p>
            </div>
          ),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-margin w-full ">
      <section className="px-10 py-5 flex flex-col gap-5 screen_var_one:px-0">
        <h4 className="mb-1 font-semibold text-2xl text-primary-pLabel">
          Speaker Opportunity
        </h4>

        <div className="w-full flex flex-col gap-10 place-items-stretch md:flex-row">
          <div className="flex-grow flex flex-col gap-5 text-sm">
            <div className="grid grid-cols-1 gap-5">
              <Input
                className="col-span-1"
                name={"name"}
                label={"Name"}
                value={speakerFormData.name}
                handler={handleSpeakerFormInputChange}
                mandatory
                onBlur={() => {
                  simpleValidator.current.showMessageFor("name");
                }}
                validationMessage={simpleValidator.current.message(
                  "name",
                  speakerFormData.name,
                  "required"
                )}
              />
              <Input
                className="col-span-1"
                name={"email"}
                label={"Email"}
                type={"email"}
                value={speakerFormData.email}
                handler={handleSpeakerFormInputChange}
                mandatory
                onBlur={() => {
                  simpleValidator.current.showMessageFor("email");
                }}
                validationMessage={simpleValidator.current.message(
                  "email",
                  speakerFormData.email,
                  "required|email"
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-5">
              <Input
                className="col-span-1"
                name={"education"}
                label={"Education"}
                value={speakerFormData.education}
                handler={handleSpeakerFormInputChange}
              />
              <Input
                className="col-span-1"
                name={"phone"}
                label={"Contact"}
                value={speakerFormData.phone}
                handler={handleSpeakerFormInputChange}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>{"Industry"}</label>
              <Dropdown
                className="p-2 w-full border border-primary-light-900 text-xs"
                name="industry"
                placeholder="Select Industry"
                options={industryOptions}
                value={speakerFormData.industry}
                onChange={handleIndustryChange}
              />
            </div>

            <div className="w-full flex flex-col gap-1">
              <label>{"Bio"}</label>
              <InputTextarea
                className={
                  "w-full min-h-40 p-2 border border-primary-light-900"
                }
                name="bio"
                value={speakerFormData.bio}
                onChange={handleSpeakerFormInputChange}
                maxLength={5000}
              />
            </div>

            <div className="w-full flex items-center justify-center">
              <ButtonCustom
                containerClassName="w-full sm:w-64"
                className="w-full px-2 py-1 flex gap-2 justify-center text-primary-pTextLight bg-primary-bg-interactiveBlue border border-primary-light-900 rounded-full hover:bg-primary-bg-lightTeal hover:bg-primary-bg-interactiveBlueHover"
                label={"Submit"}
                handleClickWithLoader={onSubmitSpeakerOpportunityForm}
              />
            </div>
          </div>

          <div className="w-full md:w-[40%] self-start flex flex-col items-start justify-center gap-3">
            <h4 className="text-lg">Want to inspire others with your story?</h4>
            <p className="text-sm">
              <strong>Platform for Experts:</strong>
              <span className="mx-1">
                Share your unique knowledge and experiences.
              </span>
            </p>
            <p className="text-sm">
              <strong>Forge Connections:</strong>
              <span className="mx-1">
                Interact and bond with a diverse community.
              </span>
            </p>
            <p className="text-sm">
              <strong>Share Insights:</strong>
              <span className="mx-1">
                Enlighten others with your expertise.
              </span>
            </p>
            <p className="text-sm">
              <strong>Diverse Audience:</strong>
              <span className="mx-1">
                Benefit from the rich energy of varied attendees.
              </span>
            </p>
            <p className="text-sm">
              <strong>Empowerment Mission: </strong>
              <span className="mx-1">
                Be a part of our goal to educate and uplift.
              </span>
            </p>
            <p className="text-sm">
              <strong>Inspirational Role: </strong>
              <span className="mx-1">
                Play a key part in catalyzing change.
              </span>
            </p>
          </div>
        </div>
      </section>

     <DialogCustom
        dialogVisible={showSpeakerOpportunityPopUp.showPopUp}
        containerClassName={
          "max-w-[500px] p-5 border border-primary-light-900 rounded-lg bg-white"
        }
        headerTemplate={showSpeakerOpportunityPopUp.headerContent}
        headerTemplateClassName={`flex items-center justify-center`}
        bodyTemplate={showSpeakerOpportunityPopUp.bodyContent}
        onHideDialog={() => {
          setShowSpeakerOpportunityPopUp((prev) => ({
            ...prev,
            showPopUp: false,
          }));
        }}
      />
    </div>
  );
}

export default React.memo(PageSpeakerOpportunity);
