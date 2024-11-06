import { Accordion, AccordionTab } from "primereact/accordion";

interface IAccordionCustomProps {
  accordionData: any;
  accordionClassName?: string;
  accordionTabClassName?: string;
  accordionHeaderClassName?: string;
  activeIndex?: number;
}

const AccordionCustom = (props: IAccordionCustomProps) => {
  const {
    accordionData,
    accordionClassName,
    accordionTabClassName,
    accordionHeaderClassName,
    activeIndex,
  } = props;

  return (
    <div className="accordion-wrapper w-full">
      <Accordion
        className={`${accordionClassName}`}
        activeIndex={activeIndex ?? undefined}
      >
        {accordionData.map((accordionInfo: any) => {
          return (
            <AccordionTab
              key={Math.random().toString(36).substring(2)}
              header={
                <div className="accordion-header-content">
                  <div className="accordion-header-title">
                    {accordionInfo?.title ?? ""}
                  </div>
                  <div className="chevron"></div>
                </div>
              }
              headerClassName={`bg-transparent text-primary-pSlateGray text-base font-bold ${accordionHeaderClassName}`}
              className={accordionTabClassName ?? ""}
            >
              <div>{accordionInfo.description}</div>
            </AccordionTab>
          );
        })}
      </Accordion>
    </div>
  );
};

export default AccordionCustom;
