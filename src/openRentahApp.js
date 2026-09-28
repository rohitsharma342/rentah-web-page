import {
  ANDROID_STORE_URL,
  IOS_STORE_URL,
  getOS,
  isMobileOs,
} from "./deepLink/config";
import { openProductDeepLink } from "./deepLink/openProductDeepLink";
import { openUserDeepLink } from "./deepLink/openUserDeepLink";
import { openAppDeepLink } from "./deepLink/openAppDeepLink";

export const APP_STORE_URL = IOS_STORE_URL;
export const PLAY_STORE_URL = ANDROID_STORE_URL;
export { getOS };

export function openRentahApp(target) {
  if (target?.type === "listing" || target?.type === "product") {
    return openProductDeepLink(target.id);
  }

  if ((target?.type === "chat" || target?.type === "user") && target.id) {
    return openUserDeepLink(target.id);
  }

  if (!isMobileOs()) {
    window.open(PLAY_STORE_URL, "_blank", "noopener,noreferrer");
    return;
  }

  return openAppDeepLink({
    id: "home",
    type: "home",
    query: { type: "home" },
    webUrl: window.location.href,
    eventName: "get_app_clicked",
  });
}
