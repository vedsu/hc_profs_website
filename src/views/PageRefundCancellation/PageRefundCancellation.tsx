import React from "react";

const PageRefundCancellation: React.FC = () => {
  const deductionAmt = 30;
  const cancelBeforeTime = 72;
  const recordingAvailableBeforeTime = 24;
  const customerServiceBeforeTime = 24;

  const refundAndCancellations = [
    {
      title: "Want to cancel a webinar ?",
      titleDesc: "",
      descriptions: [
        `You can get a refund minus a $${deductionAmt} processing fee if you cancel at least ${cancelBeforeTime} hours before the Live webinar.`,
        "The sooner you let us know, the better !",
      ],
      descriptionSecondary: [],
    },
    {
      title: "Can't make it ? Consider a substitution for a Live Webinar",
      titleDesc: "",
      descriptions: [
        "Instead of canceling, you can substitute",
        "Substitutions are free, but advance notice is required for on-demand webinars.",
      ],
      descriptionSecondary: [
        "The webinar itself (attend a different one)",
        "The attendee (send someone else in your place)",
        `You can also opt for the recording if you let us know before ${recordingAvailableBeforeTime} hrs.`,
      ],
    },
    {
      title: "What if I miss the webinar entirely ?",
      titleDesc: "",
      descriptions: [
        "Unfortunately, cancellations and substitutions are prohibited if you miss the session.",
        "This also applies if you still need to receive the webinar information due to issues (e.g., bounced emails).",
      ],
      descriptionSecondary: [],
    },
    {
      title: "Our Cancellation Policy",
      titleDesc: `We offer refunds for cancellations made ${cancelBeforeTime} hours before a Live webinar (minus a $${deductionAmt} fee).`,
      descriptions: [
        "Substitutions (webinar or attendee) are allowed but require advance notice.",
        "There are no refunds for missed sessions or problems on your end.",
      ],
      descriptionSecondary: [],
    },
    {
      title: "Website Cancellations",
      titleDesc: "",
      descriptions: [
        "You'll receive a full refund if we cancel a webinar due to technical difficulties.",
      ],
      descriptionSecondary: [],
    },
    {
      title: "Digital Downloads & Transcripts",
      titleDesc: "",
      descriptions: [
        "Please note that there are no refunds for digital downloads or transcripts.",
      ],
      descriptionSecondary: [],
    },
    {
      title: "Need Login Info?",
      titleDesc: "",
      descriptions: [
        `Contact customer service at least ${customerServiceBeforeTime} hours before the webinar for login instructions through email chats.`,
      ],
      descriptionSecondary: [],
    },
  ];

  return (
    <div className="page-margin w-full ">
      <section className="px-10 py-5 flex flex-col items-center justify-center gap-5 screen_var_one:px-0">
        <div className="w-full flex flex-col gap-5 text-sm">
          <div className="flex flex-col text-left">
            <h4 className="mb-1 font-semibold text-2xl text-primary-pLabel">
              Refund & Cancellation
            </h4>
          </div>

          <div>
            <ul className="list-disc font-normal">
              {refundAndCancellations?.map((item: any, idx: number) => (
                <div
                  className={`${
                    idx === refundAndCancellations.length - 1 ? "" : "mb-6"
                  }`}
                  key={idx}
                >
                  <h6>{item.title}</h6>
                  {item.titleDesc ? <p> {item.titleDesc} </p> : null}
                  {item?.descriptions?.map(
                    (description: string, idx: number) => {
                      return (
                        <li className="mb-2 leading-6" key={idx}>
                          {description}
                          {item?.descriptionSecondary && idx === 0 ? (
                            <>
                              <ul className="ml-10 list-disc">
                                {item?.descriptionSecondary?.map(
                                  (item: any, idx: number) => (
                                    <li className="mb-2 leading-6" key={idx}>
                                      {item}
                                    </li>
                                  )
                                )}
                              </ul>
                            </>
                          ) : null}
                        </li>
                      );
                    }
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageRefundCancellation;
