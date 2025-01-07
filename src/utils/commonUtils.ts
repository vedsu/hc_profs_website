import { LOCAL_STORAGE_ITEMS, SESSION_STORAGE_ITEMS } from "../constant";

export const getEnvVariableValues = (key: any) => {
  if (!key) throw new Error("Please pass the env key to get value");
  else return import.meta.env[key];
};

export const getInitialLetterUpperCase = (test: string) => {
  if (test) {
    const wordArr = test.split(" ");
    const modifiedWordArr = [];
    for (const word of wordArr) {
      modifiedWordArr.push(
        word?.charAt(0)?.toUpperCase() + word.slice(1).toLowerCase()
      );
    }
    return modifiedWordArr?.join(" ");
  } else {
    return test;
  }
};

export const getLabel = (constant: string) => {
  const WEBSITE_LABEL: { [key: string]: string } = {
    HEALTHCARE: "Healthcare",
  };
  return WEBSITE_LABEL[constant];
};

export const ddmmyy = (date: any) => {
  if (date) {
    date = new Date(date);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }

    return dt + "/" + month + "/" + year;
  } else {
    return date;
  }
};

export const monDayYear = (date: Date) => {
  const receivedDate = new Date(date);
  if (receivedDate) {
    return receivedDate.toLocaleString("en-US", {
      // weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } else {
    return new Date().toLocaleString("en-US", {
      // weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

export const clearLocalAndSessionStorage = () => {
  localStorage.removeItem(LOCAL_STORAGE_ITEMS.PURCHASE_INFO_NEWSLETTER);
  localStorage.removeItem(LOCAL_STORAGE_ITEMS.CART_DATA);
  localStorage.removeItem(LOCAL_STORAGE_ITEMS.PAYMENT_STATUS_SUCCESS);
  sessionStorage.removeItem(SESSION_STORAGE_ITEMS.INVOICE_NUMBER);
};

export const validateGetRequest = (res: any) => {
  if (res?.status === 200) return true;
  else return false;
};

export const validatePostRequest = (res: any) => {
  if (res?.status === 201 || res?.status === 200) return true;
  else return false;
};

export const validatePutRequest = (res: any) => {
  if (res?.status === 200) return true;
  else return false;
};

export const validatePatchRequest = (res: any) => {
  if (res?.status === 200) return true;
  else return false;
};

export const validateDeleteRequest = (res: any) => {
  if (res?.status === 202) return true;
  else return false;
};
