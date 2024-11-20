import { useNavigate } from "react-router-dom";
import { CARD_SUGGESTIONS } from "../constant";
import { LINK_PAGE_NEWSLETTERS, LINK_PAGE_WEBINAR_LISTING } from "../routes";
import { getInitialLetterUpperCase } from "../utils/commonUtils";
import { PURCHASE_ITEM } from "../views/PageCart/PageCart";
import ButtonCustom from "./ButtonCustom";

interface ICardTemplates {
  variant: string;
  cardData: any;
  callBack?: any;
}

const CardTemplates = (props: ICardTemplates) => {
  const { variant, cardData, callBack } = props;

  const navigate = useNavigate();

  const handleCardBuyNow = (cardItem: any) => {
    if (cardItem?.cardCategory === PURCHASE_ITEM.WEBINAR) {
      navigate(`${LINK_PAGE_WEBINAR_LISTING}/${cardItem?.id}`);
    } else if (cardItem?.cardCategory === PURCHASE_ITEM?.NEWSLETTER) {
      navigate(`${LINK_PAGE_NEWSLETTERS}/${cardItem?.id}`);
    }
  };

  const handleCardNotInterested = (cardItem: any) => {
    if (cardItem?.cardCategory === PURCHASE_ITEM.WEBINAR) {
      localStorage.removeItem(CARD_SUGGESTIONS.CONTINUE_PURCHASE);
    } else if (cardItem?.cardCategory === PURCHASE_ITEM?.NEWSLETTER) {
      localStorage.removeItem(CARD_SUGGESTIONS.CONTINUE_PURCHASE_NEWSLETTER);
    }
    if (callBack) {
      callBack(cardItem);
    }
  };

  const card_continue_purchase = (
    <div className="w-full p-5 flex flex-col gap-5">
      <h4 className="text-xl">Continue where you left off</h4>
      {cardData?.map((cardItem: any, idx: number) => {
        return (
          <div
            key={idx + 1}
            className="w-full flex flex-wrap items-center justify-between text-sm text-primary-pText"
          >
            <div>
              <p className="text-base">
                {cardItem?.title}
                <span className="text-xs px-2 font-semibold">{`(${getInitialLetterUpperCase(
                  cardItem?.cardCategory
                )})`}</span>
              </p>
            </div>
            <div className="self-end flex items-center gap-5">
              <ButtonCustom
                containerClassName={
                  "bg-primary-bg-purple text-center text-primary-pTextLight rounded-full"
                }
                className="max-w-fit h-6 px-2 text-xs !shadow-none"
                label={"Buy Now"}
                handleClick={() => {
                  handleCardBuyNow(cardItem);
                }}
              />

              <div>
                <ButtonCustom
                  className="max-w-fit h-6 px-2 btn-custom-secondary text-xs flex gap-2 justify-center text-primary-pTextLight border-2 border-primary-light-900 rounded-full outline-none bg-primary-bg-obsidianBlack hover:bg-gray-800"
                  label={"Not Interested"}
                  type="button"
                  handleClick={() => {
                    handleCardNotInterested(cardItem);
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (variant === CARD_SUGGESTIONS.CONTINUE_PURCHASE)
    return card_continue_purchase;
};

export default CardTemplates;
