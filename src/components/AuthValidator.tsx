import React from "react";
import { LOCAL_STORAGE_ITEMS, USER_ROLE } from "../constant";
import { LINK_HOME, LINK_UNAUTHORIZED_DASHBOARD } from "../routes";

class AuthValidator extends React.Component<{ children: any }> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    const userInfo = localStorage.getItem(LOCAL_STORAGE_ITEMS.USERINFO);
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      const invalidUserRole = parsedUserInfo.role.attendee
        ? USER_ROLE.SPEAKER
        : parsedUserInfo.role.speaker
        ? USER_ROLE.ATTENDEE
        : "";

      const failedAuth = location.href.includes(invalidUserRole?.toLowerCase());
      if (failedAuth) {
        window.location.href = LINK_UNAUTHORIZED_DASHBOARD;
        return;
      }
    } else {
      window.location.href = LINK_HOME;
      return;
    }

    return <div className="w-full">{this.props?.children ?? null}</div>;
  }
}

export default AuthValidator;
