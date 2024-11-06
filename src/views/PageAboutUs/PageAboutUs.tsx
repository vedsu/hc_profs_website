import React from "react";

const PageAboutUs: React.FC = () => {
  return (
    <div className="page-margin w-full">
      <section className="px-10 py-5 flex flex-col items-center justify-center gap-5 screen_var_one:px-0">
        <div className="flex flex-col gap-5 text-sm">
          <h4 className="font-semibold text-2xl text-primary-pLabel ">
            About Us
          </h4>
          <p className="text-left text-sm font-normal leading-6">
            <span>
              HCProfs is an online platform that hosts healthcare webinars to
              facilitate and certify individual health executives and entire
              nursing home staff in enhancing their knowledge of the care
              industry. We can help you understand complicated things in a
              simple way.
              <br />
              This will save you money, time, and stress. If you choose to
              improve your career or gain more knowledge, then we are the best
              for you. We have a professional panel of experts delivering
              various healthcare terms and topics on Patient-Centered Care,
              Evidence-Based Medicine, Healthcare Quality, Access to Care, Care
              Coordination, Health Equity, Chronic Disease Management,
              Preventive Care, Patient Education, Innovative Treatments,
              Healthcare Integration, Telemedicine, Health Information
              Technology, Patient Advocacy, Healthcare Policy, Interdisciplinary
              Collaboration, Patient Satisfaction, Healthcare Safety, Community
              Outreach, Ethical Standards and much more to help healthcare
              professionals and attendees to grow in their career.
            </span>
          </p>

          <div className="flex flex-col gap-5 font-normal text-sm">
            <p>Email: support@hcprofs.com</p>
            <p>Contact us: +1-830-256-0384</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageAboutUs;
