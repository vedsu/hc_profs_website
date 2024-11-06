import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hcHeroBanner from "../../assets/images/hc_hero_section_banner.jpg";
import hcpHeroSectionSubtitle from "../../assets/images/hcp-hero-section-subtitle.png";
import CarouselCustom from "../../components/CarouselCustom";
import { HEALTH_PROFS } from "../../constant";
import { LINK_PAGE_SPEAKERS } from "../../routes";
import SpeakerService from "../../services/SpeakerService";
import {
  getInitialLetterUpperCase,
  getLabel,
  validateGetRequest,
} from "../../utils/commonUtils";
import "./pageHome.css";

const videoURL =
  "https://webinarprofs.s3.us-east-1.amazonaws.com/misc/HC+Profs.mp4";

const PageHome: React.FC = () => {
  const navigate = useNavigate();
  const [speakerCarouselData, setSpeakerCarouselData] = useState([]);

  useEffect(() => {
    const init = async () => {
      await getSpeakersInfo();
    };
    init();
  }, []);

  /*---------------------------Service Calls------------------------------*/

  const getSpeakersInfo = async () => {
    try {
      const res = await SpeakerService.getSpeakers();
      if (validateGetRequest(res)) {
        const speakersList = res?.data?.[1];
        const speakerForHealthCare = speakersList.filter(
          (speaker: any) => speaker.industry === HEALTH_PROFS.HEALTHCARE
        );
        setSpeakerCarouselData(speakerForHealthCare);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*------------------------------Sectional Render---------------------------*/
  const carouselSpeakerTemplate = (carouselItem: any) => {
    return (
      <div
        className="p-2 mx-2 flex flex-col gap-2 relative text-xs border border-primary-light-900 rounded-lg cursor-pointer"
        onClick={() => {
          navigate(LINK_PAGE_SPEAKERS + "/" + `${carouselItem.id}`);
        }}
      >
        <div className="flex items-center justify-center">
          <img
            className="speaker-carousel-image w-[240px] h-[300px] object-cover"
            src={carouselItem.photo}
            alt="speaker's image"
          />
        </div>
        <div className="font-normal text-center text-primary-pSlateGray">
          <pre className="text-base">
            {getInitialLetterUpperCase(carouselItem.name)}
          </pre>
          <pre className="text-xs">{getLabel(carouselItem.industry)}</pre>
        </div>
      </div>
    );
  };

  /*-------------------------Main Render-----------------------------------*/

  return (
    <div className="w-full">
      <section className="hero-s-one mb-20 py-10">
        <div className="hero-bg-one-wrapper">
          <img alt="wallpaper" src={hcHeroBanner} />
        </div>

        <div className="page-margin">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full relative flex flex-col gap-10 text-primary-light-100">
              <div className="text-3xl text-pretty">
                <h1 className="text-center text-primary-light-900 tracking-wider">
                  Healthier World
                  <br />
                  by Thinking Big!
                </h1>
              </div>

              <div className="w-full px-3 flex flex-col gap-10 items-center justify-center screen_var_one:px-10 screen_var_one:flex-row">
                <div className="screen_var_one:w-[50%] flex text-sm">
                  <img
                    className="w-full h-full object-fill"
                    src={hcpHeroSectionSubtitle}
                    alt="main-message"
                  />
                </div>

                <div className="screen_var_one:w-[50%] hero-sec-vid-box">
                  <video controls autoPlay={true} loop={true}>
                    <source src={videoURL} type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-margin">
        <div className="flex flex-col gap-20 items-center justify-center">
          <section className="w-full px-3 flex flex-col gap-10 items-stretch justify-around sm:px-10 sm:flex-nowrap screen_var_one:flex-row">
            <div className="p-5 border rounded-lg">
              <div className="flex flex-col gap-2">
                <h2 className="primary-badge py-2 text-xl text-center">
                  Our Mission
                </h2>
                <p className="text-sm font-normal text-justify screen_var_one:text-left">
                  At HCProfs, our mission is to empower healthcare professionals
                  by providing them with the resources, tools, and community
                  support needed to excel in their careers. We are dedicated to
                  enhancing the quality of healthcare through continuous
                  education and innovation, ensuring that every professional is
                  equipped to deliver the highest standard of care that empowers
                  individuals to advance their careers and personal lives.
                </p>
              </div>
            </div>
            <div className="p-5 border rounded-lg">
              <div className="flex flex-col gap-2">
                <h2 className="primary-badge py-2 text-xl text-center">
                  Our Vision
                </h2>
                <p className="text-sm font-normal text-justify screen_var_one:text-left">
                  Our vision is to become the leading online platform for
                  healthcare professionals, fostering a global community where
                  knowledge is shared, careers are advanced, and the well-being
                  of patients is prioritized. We aim to bridge the gap between
                  healthcare providers and the latest industry insights,
                  promoting a culture of lifelong learning and professional
                  excellence.
                </p>
              </div>
            </div>
            <div className="p-5 border rounded-lg">
              <div className="flex flex-col gap-2">
                <h2 className="primary-badge py-2 text-xl text-center">
                  Our Goal
                </h2>
                <p className="text-sm font-normal text-justify screen_var_one:text-left">
                  We aim to give you a peek into our vast experience and
                  unwavering commitment to the healthcare field. Our ultimate
                  objective is to enhance the quality of patient care by
                  equipping healthcare providers with the skills and information
                  necessary to make informed decisions and drive positive
                  outcomes. We're here to showcase our expertise, share our
                  research interests, and improve the health and well-being of
                  the people and communities we serve.
                </p>
              </div>
            </div>
          </section>

          <div className="highlights-line"></div>

          <section className="w-full mb-10 px-3 sm:px-10 flex flex-col items-center justify-center gap-5">
            <h4 className="text-xl text-primary-pText">Meet our speakers</h4>

            {speakerCarouselData.length ? (
              <div className="w-full">
                <div className="speaker-carousel-wrapper">
                  <CarouselCustom
                    className="speaker-carousel"
                    carouselItems={speakerCarouselData}
                    carouselItemTemplate={carouselSpeakerTemplate}
                    numVisible={4}
                    numScroll={1}
                  />
                </div>
              </div>
            ) : null}
          </section>

          <div className="highlights-line"></div>

          <section className="mb-10 px-3 sm:px-10 flex flex-col items-center justify-center gap-5">
            <h4 className="text-xl text-primary-pText">History</h4>
            <div className="w-full flex items-center justify-center">
              <div className="text-base font-normal text-left text-pretty">
                <p>
                  For more than years, HCProfs has been at the forefront of
                  provider and patient care. Our commitment lies in equipping
                  professionals with cutting-edge insights, trends, and
                  indispensable knowledge necessary to excel in today's dynamic
                  and competitive landscape. It also offers exceptional value
                  without compromising affordability. Our training programs are
                  specifically designed to meet the unique needs of healthcare
                  professionals, providing them with the highest quality
                  professional development opportunities. We sought to transform
                  the industry by ensuring compliance and keeping healthcare
                  professionals informed. Our cost-effective, user-friendly, and
                  informative webinars have positioned us as a trusted resource
                  for career development.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PageHome;
