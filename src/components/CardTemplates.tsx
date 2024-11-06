import { useNavigate } from "react-router-dom";
import { CARD_SUGGESTIONS } from "../constant";
import { LINK_PAGE_WEBINAR_LISTING } from "../routes";
import ButtonCustom from "./ButtonCustom";

interface ICardTemplates {
  variant: string;
  cardData: any;
  callBack?: any;
}

const CardTemplates = (props: ICardTemplates) => {
  const { variant, cardData, callBack } = props;

  const navigate = useNavigate();

  const card_continue_purchase = (
    <div className="w-full p-5">
      <div className="w-full flex flex-col gap-5 text-sm text-primary-pText">
        <div>
          <h4 className="text-xl">Continue where you left off</h4>
          <p className="text-base">{cardData?.webinarTitle}</p>
        </div>
        <div className="self-end flex items-center gap-5">
          <ButtonCustom
            containerClassName={
              "bg-primary-bg-teal text-center text-primary-pTextLight rounded-full"
            }
            className="w-44 h-8"
            label={"Buy Now"}
            handleClick={() => {
              navigate(LINK_PAGE_WEBINAR_LISTING + "/" + cardData?.webinarId);
            }}
          />

          <div>
            <ButtonCustom
              className="w-44 h-8 px-2 btn-custom-secondary flex gap-2 justify-center text-primary-pTextLight border-2 border-primary-light-900 rounded-full outline-none bg-primary-bg-obsidianBlack hover:bg-gray-800"
              label={"Not Interested"}
              type="button"
              handleClick={() => {
                localStorage.removeItem(CARD_SUGGESTIONS.CONTINUE_PURCHASE);
                if (callBack) {
                  callBack();
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (variant === CARD_SUGGESTIONS.CONTINUE_PURCHASE)
    return card_continue_purchase;
};

export default CardTemplates;
