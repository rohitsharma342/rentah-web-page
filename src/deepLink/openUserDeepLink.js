import { userWebUrl } from "./config";
import { openAppDeepLink } from "./openAppDeepLink";

export async function openUserDeepLink(userId) {
  const id = String(userId || "").trim();
  if (!id) return;

  return openAppDeepLink({
    id,
    type: "user",
    query: {
      user_id: id,
      type: "user",
    },
    webUrl: userWebUrl(id),
    eventName: "message_button_clicked",
  });
}
