import { Carousel } from "primereact/carousel";

interface ICarouseProps {
  className: string;
  carouselItems: any;
  carouselItemTemplate: any;
  numVisible: number;
  numScroll: number;
}

const CarouselCustom = (props: ICarouseProps) => {
  const {
    className,
    carouselItems,
    carouselItemTemplate,
    numVisible,
    numScroll,
  } = props;

  const responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "1100px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "980px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  return (
    <div className="card">
      <Carousel
        className={className ?? ""}
        value={carouselItems}
        numScroll={numScroll}
        numVisible={numVisible}
        responsiveOptions={responsiveOptions}
        itemTemplate={carouselItemTemplate}
      />
    </div>
  );
};

export default CarouselCustom;
