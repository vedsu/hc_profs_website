import React, { BaseSyntheticEvent } from "react";
import Input from "../../components/Input";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import ButtonCustom from "../../components/ButtonCustom";

const initialSpeakerFormData = {
  name: "",
  email: "",
  education: "",
  country: "",
  phone: "",
  industry: "",
  bio: "",
};

function PageSpeakerOpportunity() {
  const [speakerFormData, setSpeakerFormData] = React.useState(
    initialSpeakerFormData
  );

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

  const onSubmitSpeakerOpportunityForm = () => {
    //
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
              />
              <Input
                className="col-span-1"
                name={"email"}
                label={"Email"}
                type={"email"}
                value={speakerFormData.email}
                handler={handleSpeakerFormInputChange}
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
                className="p-2 w-full border border-primary-light-900 text-gray-500 text-xs"
                name="industry"
                placeholder="Select Industry"
                options={[{ label: "Option1", value: "val1" }]}
                optionLabel="label"
                optionValue="value"
                value={""}
                onChange={handleIndustryChange}
              />
              {/* <small>{"validationMessage"}</small> */}
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
              {/* <small>{"validationMessage"}</small> */}
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
    </div>
  );
}

export default React.memo(PageSpeakerOpportunity);
