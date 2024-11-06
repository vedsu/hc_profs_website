import React from "react";
import { Link } from "react-router-dom";
import AccordionCustom from "../../components/AccordionCustom";
import { LINK_PAGE_CONTACT_US } from "../../routes";

const PageFAQ: React.FC = () => {
  const accordionData = [
    {
      title: "What is a live session?",
      description:
        "Live webinar training is a real-time virtual event where a speaker presents information, and participants can interact with them through a web conferencing platform. This interactive format allows you to ask questions, share insights, and discuss with industry experts, making it a valuable learning and networking opportunity.",
    },
    {
      title: "How do you join the live session?",
      description:
        "Login to your dashboard and get your Live Instruction. Also, you will get a notification via email. We will drop you live instructions via email 12 hours before the live webinar.",
    },
    {
      title: "When will the recording be available after the live session?",
      description:
        "Recording and Transcript will be available 24 hours after the live date.",
    },
    {
      title: "How do you get a handout/presentation(pdf)?",
      description:
        "Login to your dashboard and download the presentation(pdf).",
    },
    {
      title: "What is Digital Download?",
      description:
        "A digital download is a file that can be downloaded and used without further processing. This could include a webinar, video, audio file, or other digital content. Please save it in your local storage so that you will have lifetime access. The digital download link is valid for 30 Days. The information in this email is unique and valid only for you. Please do not share the information with others. With digital downloads, you can revisit the content at your convenience, ensuring a lifetime of learning and professional development.",
    },
    {
      title: "How to get Digital Download?",
      description:
        "Login to your dashboard and click on Digital Download to get lifetime access. Also, we will drop you download instructions via email.",
    },
    {
      title: "What is a Transcript?",
      description:
        "The Transcript is a written record of the spoken words in a webinar. It includes the presenter's words and any questions and comments from participants. The transcript allows you to review the content at your own pace, ensuring a more thorough understanding of the material. Read at any time within 30 days of access.",
    },
    {
      title: "How to get a transcript(pdf)?",
      description:
        "Login to your dashboard and download the Transcript (pdf). Also, we will drop you download instructions via email. The Transcript pdf file will be available in your dashboard for 30 days of access.",
    },
    {
      title: "What is an on-demand(recording) session?",
      description:
        "A recorded webinar is an online event that has been pre-recorded and can be watched at any time with 30 days' access.",
    },
    {
      title: "How to watch an on-demand(recording) session?",
      description:
        "Login to your dashboard and watch the recording. Also, we will drop you download instructions via email. Record access will be available in your dashboard for 30 days, with unlimited watch access.",
    },
    {
      title: "How do I get an invoice?",
      description:
        "Login to your dashboard and download the Invoice(pdf). Also, we will send a thank you email once the order is confirmed.",
    },
    {
      title: "Is there any other option for registration?",
      description: "You can download the registration form or request a call.",
    },
    {
      title: "How can I change my password?",
      description:
        "Changing your password is easy. Log into your dashboard, navigate to 'My Profile ', and click 'Change Password '. Follow the instructions to set a new password. Remember to choose a robust and unique password to protect your account.",
    },
  ];

  return (
    <div className="page-margin w-full ">
      <div className="px-10 py-5 w-full screen_var_one:px-0">
        <h4 className="font-semibold text-2xl text-primary-pLabel">FAQ</h4>
        <p className="text-sm font-semibold text-primary-pText">
          Here are answers to some of our most common questions.
        </p>
      </div>
      <div className="px-10 py-5 w-full flex flex-col gap-2 items-center justify-center screen_var_one:px-0">
        <h4 className="font-semibold text-2xl text-primary-pLabel">
          Frequently asked questions
        </h4>
        <p className="text-primary-pText text-sm">
          <span className="mx-1">
            Can't find the answer to a question? Feel free to
          </span>
          <Link to={LINK_PAGE_CONTACT_US} className="underline">
            {"contact us"}
          </Link>
          <span className="mx-1">and we'll help you.</span>
        </p>
      </div>

      <section className="px-10 py-5 flex flex-col items-center justify-center gap-5 screen_var_one:px-0">
        <AccordionCustom
          accordionData={accordionData}
          accordionTabClassName={
            "mb-5 pb-2 text-sm  border border-l-0 border-t-0 border-r-0 border-b-primary-bg-lightCyan"
          }
        />
      </section>
    </div>
  );
};

export default PageFAQ;
