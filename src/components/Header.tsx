import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import brandLogo from "../assets/images/hc_profs_logo_variant1.png";
import { ENV_VAR, LOCAL_STORAGE_ITEMS } from "../constant";
import {
  LINK_ATTENDEE_DASHBOARD,
  LINK_HOME,
  LINK_PAGE_ABOUT_US,
  LINK_PAGE_FAQ,
  LINK_PAGE_LOGIN_REG,
  LINK_PAGE_NEWSLETTERS,
  LINK_PAGE_SPEAKERS,
  LINK_PAGE_WEBINAR_LISTING,
  LINK_SPEAKER_DASHBOARD,
} from "../routes";
import { getEnvVariableValues } from "../utils/commonUtils";
import ButtonCustom from "./ButtonCustom";
import MobileAccordion from "./MobileAccordion";

interface IHeaderProps {
  subscribeButtonHandler: any;
}

const orderFormURL = getEnvVariableValues(ENV_VAR.VITE_ORDER_FORM_URL);

const resourcesVideos = [
  {
    title: "CMS 2024",
    url: "https://vedsubrandwebsite.s3.amazonaws.com/demo/Human+Factors+Usability+Studies+following+ISO62366%2C+the+FDA+Guidance%2C+and+the+new+FDA+Draft+Guidance.mp4",
  },
  {
    title: "HIPAA 2025",
    url: "https://vedsubrandwebsite.s3.amazonaws.com/demo/How+to+Write+SOPs+(Procedures)+for+Human+Error+Reduction+Prevention.mp4",
  },
  {
    title: "MEDICARE E&R",
    url: "https://vedsubrandwebsite.s3.amazonaws.com/demo/Data+Integrity+and+Privacy+Compliance+with+21+CFR+Part+11%2C+SaaSCloud%2C+EU+GDPR.mp4",
  },
];

const Header = (props: IHeaderProps) => {
  const { subscribeButtonHandler } = props;

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const navigate = useNavigate();
  const isUserLoggedIn = localStorage.getItem(LOCAL_STORAGE_ITEMS.USERINFO);

  const toggleHamburgerIcon = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  const onLogout = async () => {
    await new Promise((res) => {
      setTimeout(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = LINK_HOME;
      }, 1000);

      res("Logged Out");
    });
  };

  const gotoDashboard = () => {
    const storedUserInfo = localStorage.getItem(LOCAL_STORAGE_ITEMS.USERINFO);
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      if (userInfo?.role?.attendee) navigate(`${LINK_ATTENDEE_DASHBOARD}`);
      else if (userInfo?.role.speaker) navigate(`${LINK_SPEAKER_DASHBOARD}`);
    }
  };

  return (
    <header className="navbar-wrapper font-bold text-sm">
      <nav>
        <div className="flex items-center justify-between">
          <div
            className="flex items-center justify-start cursor-pointer"
            onClick={() => {
              navigate(LINK_HOME);
            }}
          >
            <img
              className="w-36 h-12 screen_var_one:w-52 screen_var_one:h-16"
              src={brandLogo}
              alt="logo"
            />
          </div>

          <div
            id="wrapper-primary-nav"
            className="flex items-center justify-between"
          >
            <ul className="nav-links inline-flex items-center justify-center gap-4 text-primary-pLabel">
              {isUserLoggedIn ? (
                <li className="nav-link-item">
                  <button
                    className="hover:text-primary-link-500"
                    onClick={gotoDashboard}
                  >
                    Dashboard
                  </button>
                </li>
              ) : null}
              <li className="nav-link-item">
                <Link to={LINK_HOME}>Home</Link>
              </li>
              <li className="nav-link-item">
                <div
                  className="nav-mega-menu-wrapper relative"
                  data-hover="false"
                  data-delay="0"
                >
                  <div className="mega-menu-dropdown">
                    <a>Webinar</a>
                    <div className="sub-menu-arrow"></div>
                  </div>
                  <div className="mega-box">
                    <div className="mega-box-content-wrapper">
                      <div className="content">
                        <div className="mega-menu-intro-block">
                          <h4 className="text-2xl">
                            For Individuals & For Organizations
                          </h4>
                          <p className="text-sm font-normal">
                            We are dedicated to advancing healthcare by
                            supporting both individual professionals and
                            organizations. Together they can shape the future of
                            healthcare.
                          </p>
                        </div>
                        <div className="mega-menu-block stretched">
                          <div className="w-layout-grid mega-menu-grid _2-cols">
                            <div className="flex flex-col gap-3">
                              <div className="font-bold">Category</div>
                              <ul
                                className="mega-menu-links category-list"
                                onClick={() => window?.location?.reload()}
                              >
                                <li>
                                  <Link
                                    to={`${LINK_PAGE_WEBINAR_LISTING}?category=all`}
                                    className="font-thin"
                                  >
                                    {`All`}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={`${LINK_PAGE_WEBINAR_LISTING}?category=nursing`}
                                    className="font-thin"
                                  >
                                    {`Nursing`}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={`${LINK_PAGE_WEBINAR_LISTING}?category=healthcare management`}
                                    className="font-thin"
                                  >
                                    {`Healthcare Management`}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={`${LINK_PAGE_WEBINAR_LISTING}?category=medical billing and coding`}
                                    className="font-thin"
                                  >
                                    {`Medical Billing and Coding`}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={`${LINK_PAGE_WEBINAR_LISTING}?category=hipaa and compliance`}
                                    className="font-thin"
                                  >
                                    {`HIPAA and Compliance`}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={`${LINK_PAGE_WEBINAR_LISTING}?category=e/m services`}
                                    className="font-thin"
                                  >
                                    {`E/M Services`}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={`${LINK_PAGE_WEBINAR_LISTING}?category=hospital and compliance`}
                                    className="font-thin"
                                  >
                                    {`Hospital and Compliance`}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={`${LINK_PAGE_WEBINAR_LISTING}?category=hospice and home care`}
                                    className="font-thin"
                                  >
                                    {`Hospice and Home Care`}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={`${LINK_PAGE_WEBINAR_LISTING}?category=cms compliance`}
                                    className="font-thin"
                                  >
                                    {`CMS Compliance`}
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={`${LINK_PAGE_WEBINAR_LISTING}?category=cpt/icd updates`}
                                    className="font-thin"
                                  >
                                    {`CPT/ ICD Updates`}
                                  </Link>
                                </li>
                              </ul>
                            </div>

                            <div className="flex flex-col gap-3">
                              <div className="font-bold">Courses</div>
                              <ul
                                className="mega-menu-links courses-list"
                                onClick={() => window?.location?.reload()}
                              >
                                <li>
                                  <Link
                                    to={`${LINK_PAGE_WEBINAR_LISTING}?courses=all`}
                                    className="font-thin"
                                  >
                                    All
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={`${LINK_PAGE_WEBINAR_LISTING}?courses=live`}
                                    className="font-thin"
                                  >
                                    Live
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to={`${LINK_PAGE_WEBINAR_LISTING}?courses=recording`}
                                    className="font-thin"
                                  >
                                    Recordings
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="nav-link-item">
                <div
                  className="nav-mega-menu-wrapper relative"
                  data-hover="false"
                  data-delay="0"
                >
                  <div className="mega-menu-dropdown">
                    <a>Company</a>
                    <div className="sub-menu-arrow"></div>
                  </div>
                  <div className="mega-box">
                    <div className="mega-box-content-wrapper">
                      <div className="content">
                        <div className="mega-menu-intro-block">
                          <h4 className="text-2xl">
                            We are dedicated to advancing healthcare by bridging
                            the gap between clinical expertise and innovation
                          </h4>
                          <p className="text-sm font-normal">
                            Our company offers a platform for healthcare
                            professionals who bring together years of experience
                            to deliver solutions that enhance healthcare
                            services' efficiency, quality, and impact. HCProfs
                            continues to set industry standards through our
                            tailored offerings and forward-thinking approach.
                          </p>
                        </div>
                        <div className="mega-menu-block stretched">
                          <div className="w-layout-grid mega-menu-grid _2-cols">
                            <div />
                            <ul
                              className="mega-menu-links nav-company-list"
                              onClick={() => window?.location?.reload()}
                            >
                              <li>
                                <Link to={LINK_PAGE_ABOUT_US}>About Us</Link>
                              </li>
                              <li>
                                <Link to={LINK_PAGE_FAQ}>FAQ's</Link>
                              </li>
                              <li>
                                <Link to={LINK_PAGE_SPEAKERS}>Teams</Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="nav-link-item">
                <div
                  className="nav-mega-menu-wrapper relative"
                  data-hover="false"
                  data-delay="0"
                >
                  <div className="mega-menu-dropdown">
                    <a>Resources</a>
                    <div className="sub-menu-arrow"></div>
                  </div>
                  <div className="mega-box">
                    <div className="mega-box-content-wrapper">
                      <div className="content">
                        <div className="mega-menu-intro-block">
                          <h4 className="text-2xl">
                            Explore career opportunities and resources to help
                            you grow professionally
                          </h4>
                          <p className="text-sm font-normal">
                            We provide a wide range of valuable resources
                            designed to support healthcare professionals in
                            their practice. To keep you updated we deliver
                            reports on legislative changes, technological
                            advancements, medical journals, public health
                            advancement, and policy changes.
                          </p>
                        </div>
                        <div className="mega-menu-block stretched">
                          <div className="w-layout-grid mega-menu-grid _3-cols">
                            <div className="flex flex-col gap-3">
                              <div className="font-bold">Demo Videos</div>
                              <ul className="mega-menu-links resource-nav-links">
                                {resourcesVideos?.map((resource, idx) => {
                                  return (
                                    <li key={idx + 1}>
                                      <a
                                        className="font-thin"
                                        href={resource.url}
                                        target="_blank"
                                      >
                                        {resource.title}
                                      </a>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>

                            <div className="flex flex-col gap-3">
                              <div className="font-bold">
                                Publications (*coming soon)
                              </div>
                              <ul className="mega-menu-links resource-nav-links">
                                <li>
                                  <Link
                                    className="font-thin"
                                    to={LINK_PAGE_NEWSLETTERS}
                                  >
                                    Newsletters
                                  </Link>
                                </li>
                                <li>
                                  <a className="font-thin" href={"#"}>
                                    E-book
                                  </a>
                                </li>
                              </ul>
                            </div>

                            <div className="flex flex-col gap-3">
                              <div className="font-bold">
                                Get Inspired (*coming soon)
                              </div>
                              <ul className="mega-menu-links resource-nav-links">
                                <li>
                                  <a className="font-thin" href={"#"}>
                                    Blog
                                  </a>
                                </li>
                                <li>
                                  <a className="font-thin" href={"#"}>
                                    Press
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="nav-link-item">
                <a
                  href={orderFormURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Order Form
                </a>
              </li>
            </ul>

            {isUserLoggedIn ? (
              <div>
                <ButtonCustom
                  className="nav-logout bg-primary-bg-purple text-primary-pText rounded-full"
                  label={"Logout"}
                  handleClickWithLoader={onLogout}
                >
                  <i className="mx-2 text-xs pi pi-sign-out"></i>
                </ButtonCustom>
              </div>
            ) : (
              <div>
                <Link
                  to={LINK_PAGE_LOGIN_REG}
                  className="nav-login-reg bg-primary-bg-purple text-primary-pText rounded-full"
                >
                  <span>Login / Register</span>
                  <i className="mx-2 text-xs pi pi-sign-in"></i>
                </Link>
              </div>
            )}
          </div>

          <div className="mobile-menu-button" onClick={toggleHamburgerIcon}>
            <div className="burger burger1"></div>
            <div className="burger burger2"></div>
            <div className="burger burger3"></div>
            <style>
              {`.burger1{
                transform:${isHamburgerOpen ? "rotate(45deg)" : "rotate(0)"};
                }
              
                .burger2{
                transform:${
                  isHamburgerOpen ? "translateX(100%)" : "translateX(0)"
                };
                opacity:${isHamburgerOpen ? 0 : 1};
                }

                .burger3{
                  transform:${isHamburgerOpen ? "rotate(-45deg)" : "rotate(0"};
                }
              `}
            </style>
          </div>
        </div>
      </nav>

      <div
        className="mobile-menu"
        style={isHamburgerOpen ? { display: "block", opacity: 1 } : undefined}
      >
        <div className="mobile-menu-wrapper">
          <ul className="p-5 flex flex-col items-center justify-center gap-4 text-primary-pLabel">
            {isUserLoggedIn ? (
              <li className="mob-nav-link-item px-1">
                <button
                  className="hover:text-primary-link-500"
                  onClick={() => {
                    gotoDashboard();
                    window?.location?.reload();
                  }}
                >
                  Dashboard
                </button>
              </li>
            ) : null}
            <li className="mob-nav-link-item px-1">
              <a href={LINK_HOME}>Home</a>
            </li>
            <li className="mob-nav-link-item">
              <MobileAccordion
                title={"Webinar"}
                content={
                  <div>
                    <ul className="px-5 flex flex-col gap-3">
                      <li>
                        <a
                          href={`${LINK_PAGE_WEBINAR_LISTING}?category=nursing`}
                        >
                          Nursing
                        </a>
                      </li>
                      <li>
                        <a
                          href={`${LINK_PAGE_WEBINAR_LISTING}?category=healthcare management`}
                        >
                          Healthcare Management
                        </a>
                      </li>
                      <li>
                        <a
                          href={`${LINK_PAGE_WEBINAR_LISTING}?category=medical billing and coding`}
                        >
                          Medical Billing and Coding
                        </a>
                      </li>
                      <li>
                        <a
                          href={`${LINK_PAGE_WEBINAR_LISTING}?category=hipaa and compliance`}
                        >
                          HIPAA and Compliance
                        </a>
                      </li>
                      <li>
                        <a
                          href={`${LINK_PAGE_WEBINAR_LISTING}?category=e/m services`}
                        >
                          E/M Services
                        </a>
                      </li>
                      <li>
                        <a
                          href={`${LINK_PAGE_WEBINAR_LISTING}?category=hospital and compliance`}
                        >
                          Hospital and Compliance
                        </a>
                      </li>
                      <li>
                        <a
                          href={`${LINK_PAGE_WEBINAR_LISTING}?category=hospice and home care`}
                        >
                          Hospice and Home Care
                        </a>
                      </li>
                      <li>
                        <a
                          href={`${LINK_PAGE_WEBINAR_LISTING}?category=cms compliance`}
                        >
                          CMS Compliance
                        </a>
                      </li>
                      <li>
                        <a
                          href={`${LINK_PAGE_WEBINAR_LISTING}?category=cpt/icd updates`}
                        >
                          CPT/ ICD Updates
                        </a>
                      </li>
                    </ul>
                  </div>
                }
              />
            </li>
            <li className="mob-nav-link-item">
              <MobileAccordion
                title={"Company"}
                content={
                  <div>
                    <ul className="px-5 flex flex-col gap-1">
                      <li>
                        <a href={LINK_PAGE_ABOUT_US}>About Us</a>
                      </li>
                      <li>
                        <a href={LINK_PAGE_FAQ}>FAQ's</a>
                      </li>
                      <li>
                        <a href={LINK_PAGE_SPEAKERS}>Teams</a>
                      </li>
                    </ul>
                  </div>
                }
              />
            </li>
            <li className="mob-nav-link-item">
              <MobileAccordion
                title={"Resources"}
                content={
                  <div className="flex flex-col gap-5">
                    <div className="px-5">
                      <div>Demo Videos</div>
                      <ul className="px-5 py-1 flex flex-col gap-1">
                        {resourcesVideos?.map((resource, idx) => {
                          return (
                            <li key={idx + 1}>
                              <a
                                className="font-thin"
                                href={resource.url}
                                target="_blank"
                              >
                                {resource.title}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="px-5">
                      <div>Publications (*coming soon)</div>
                      <ul className="px-5 py-1 flex flex-col gap-1">
                        <li>
                          <a href={LINK_PAGE_NEWSLETTERS}>Newsletter</a>
                        </li>
                        <li>
                          <a href={"#"}>E-book</a>
                        </li>
                      </ul>
                    </div>
                    <div className="px-5">
                      <div>Get Inspired (*coming soon)</div>
                      <ul className="px-5 py-1 flex flex-col gap-1">
                        <li>
                          <a href={"#"}>Blog</a>
                        </li>
                        <li>
                          <a href={"#"}>Press</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                }
              />
            </li>
            <li className="mob-nav-link-item px-1">
              <a href={orderFormURL} target="_blank" rel="noopener noreferrer">
                Order Form
              </a>
            </li>
            <li className="mob-nav-link-item px-1">
              <button
                className="hover:text-primary-link-500"
                onClick={subscribeButtonHandler}
              >
                Subscribe
              </button>
            </li>
          </ul>

          {isUserLoggedIn ? (
            <div>
              <ButtonCustom
                className="nav-logout bg-primary-bg-purple text-primary-pText rounded-full"
                label={"Logout"}
                handleClickWithLoader={onLogout}
              >
                <i className="mx-2 text-xs pi pi-sign-out"></i>
              </ButtonCustom>
            </div>
          ) : (
            <div>
              <a
                href={LINK_PAGE_LOGIN_REG}
                className="nav-login-reg bg-primary-bg-purple text-primary-pText rounded-full"
              >
                <span>Login / Register</span>
                <i className="mx-2 text-xs pi pi-sign-in"></i>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
