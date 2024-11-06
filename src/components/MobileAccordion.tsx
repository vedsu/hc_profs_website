import React, { ReactElement, useState } from "react";

interface IMobileAccordionProps {
  title: string;
  content: string | ReactElement;
}

const MobileMenuAccordion = (props: IMobileAccordionProps) => {
  const [isActive, setIsActive] = useState(false);
  const { title, content } = props;

  return (
    <React.Fragment>
      <div className="custom-accordion">
        <div className="custom-accordion-item">
          <div
            className="custom-accordion-title"
            onClick={() => setIsActive(!isActive)}
          >
            <div>{title}</div>
            <div className="chevron" />
          </div>

          {isActive && <div className="accordion-content">{content}</div>}
        </div>
      </div>

      <style>
        {`
            .custom-accordion .chevron{
            transform:${isActive ? `rotate(-135deg)` : `rotate(45deg)`};
             -webkit-transform::${
               isActive ? `rotate(-135deg)` : `rotate(45deg)`
             };
            } 
        `}
      </style>
    </React.Fragment>
  );
};

export default React.memo(MobileMenuAccordion);
