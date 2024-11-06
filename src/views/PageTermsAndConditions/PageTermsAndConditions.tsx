import React from "react";

const PageTermsAndConditions: React.FC = () => {
  const termsAndConditions = [
    {
      title: "Permissible Use",
      conditions: [
        "Content on this site is for personal, informational, or internal business use only.",
        "Material cannot be used commercially, licensed, or sold.",
        "Copyright, trademark, and design rights apply to all content.",
        "Graphics can only be used with relevant text.",
      ],
    },
    {
      title: "Backlinking",
      conditions: [
        "Backlinks to our site are permitted from Pre-Approved Sites.",
        "Conditions apply to ensure fair representation and avoid misuse.",
      ],
    },
    {
      title: "User Conduct",
      conditions: [
        "The use of robots or spiders to compile information is prohibited.",
        "Use of service marks or trademarks without consent is not allowed.",
      ],
    },
    {
      title: "Modifications to Terms",
      conditions: [
        "We reserve the right to update the terms without notice.",
        "Your continued use of the site implies acceptance of any changes.",
      ],
    },
    {
      title: "Termination or Modifications",
      conditions: [
        "We may modify or terminate access to the site at any time.",
        "This can be temporary or permanent, with or without notice.",
      ],
    },
  ];

  return (
    <div className="page-margin w-full ">
      <section className="px-10 py-5 flex flex-col items-center justify-center gap-5 screen_var_one:px-0">
        <div className="flex flex-col gap-5 text-sm">
          <div className="flex flex-col text-left">
            <h4 className="mb-1 font-semibold text-2xl text-primary-pLabel">
              Terms & Conditions
            </h4>
            <div className="text-base font-semibold leading-6">
              <p className="mb-1">Welcome to HCProfs!</p>
              <p className="text-sm font-normal">
                Before diving in, please take a moment to familiarize yourself
                with our Terms & Conditions. By using this site, you agree to
                abide by the guidelines outlined below
              </p>
            </div>
          </div>

          <div>
            <ul className="list-disc font-normal">
              {termsAndConditions?.map((item: any, idx: number) => (
                <div className="mb-8" key={idx}>
                  <h6>{item.title}</h6>
                  {item?.conditions?.map((condition: string, idx: number) => (
                    <li className="mb-2 leading-6" key={idx}>
                      {condition}
                    </li>
                  ))}
                </div>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-sm">
              Thank you for being part of HCProfs. Enjoy exploring!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageTermsAndConditions;
