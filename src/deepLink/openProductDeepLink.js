import { productWebPath, productWebUrl } from "./config";
import { openAppDeepLink } from "./openAppDeepLink";

export async function openProductDeepLink(productId) {
  const id = String(productId || "").trim();
  if (!id) return;

  return openAppDeepLink({
    id,
    type: "product",
    query: {
      product_id: id,
      type: "product",
    },
    webUrl: productWebUrl(id),
    eventName: "interested_button_clicked",
  });
}

export function productSharePath(productId) {
  return productWebPath(encodeURIComponent(String(productId || "").trim()));
}

export { productWebUrl };
