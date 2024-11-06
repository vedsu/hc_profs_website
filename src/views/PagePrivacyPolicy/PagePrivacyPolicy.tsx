import React from "react";

const PagePrivacyPolicy: React.FC = () => {
  const statements = [
    "Your privacy is our utmost priority at HCProfs. We do not sell or share your information with third parties, companies, or other organizations. Your information is solely used to inform you of webinars or compliance training via e-mail and to assist you in participating in the webinars should you decide to register. We respect your privacy and are committed to protecting your data.",

    "You can remind us anytime not to receive e-mail notices about webinars, and we will remove you from our notification list.",

    "We gather data like browser and domain names for internal analysis to enhance our website's performance.",

    "Our site uses cookies to track user activities and provide statistical insights. You can turn off cookies in your browser settings.",

    "Your personal information remains confidential and is only shared under strict confidentiality agreements or when required by law.",

    "We may disclose information with your consent only in cases of legal obligations, collaborations with trusted partners, or business acquisitions.",

    "Links to third-party websites are provided for convenience, but we do not endorse their privacy policies. Users should review these policies independently.",

    "Feel free to contact us with any concerns or queries regarding our Privacy Policies.",
  ];

  return (
    <div className="page-margin w-full ">
      <section className="px-10 py-5 flex flex-col items-center justify-center gap-5 screen_var_one:px-0">
        <div className="flex flex-col gap-5 text-sm">
          <div className="text-left">
            <h4 className="mb-1 font-semibold text-2xl text-primary-pLabel">
              Privacy Policy
            </h4>
            <p className="text-sm font-semibold leading-6">
              At HCProfs, safeguarding your privacy is at the core of our
              values.
              <br />
              Here's how we're committed to protecting your data.
            </p>
          </div>

          <div>
            <ul className="list-disc font-normal">
              {statements?.map((statement, idx: number) => (
                <li className="mb-2 leading-6" key={idx}>
                  {statement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PagePrivacyPolicy;
