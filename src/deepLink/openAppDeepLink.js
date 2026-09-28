import {
  androidIntentUrl,
  customAppUrl,
  getOS,
  isDesktopBrowser,
  isMobileOs,
  storeUrlFor,
} from "./config";
import { trackDeepLinkEvent } from "./analytics";

const STORE_FALLBACK_MS = 1600;
let inFlight = false;

function goToWebPage(webUrl) {
  if (!webUrl) return;
  if (window.location.href.split("?")[0] !== webUrl) {
    window.location.assign(webUrl);
  }
}

function launchHref(href) {
  const link = document.createElement("a");
  link.href = href;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function tryOpenInstalledApp(query) {
  return new Promise((resolve) => {
    let settled = false;
    const os = getOS();
    const href =
      os === "Android" ? androidIntentUrl(query) : customAppUrl(query);

    const finish = (opened) => {
      if (settled) return;
      settled = true;
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("blur", onHide);
      window.clearTimeout(timer);
      resolve(opened);
    };

    const onHide = () => {
      if (document.hidden || document.visibilityState === "hidden") {
        finish(true);
      }
    };

    const timer = window.setTimeout(() => {
      const stillHere =
        !document.hidden && document.visibilityState !== "hidden";
      finish(!stillHere);
    }, STORE_FALLBACK_MS);

    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    window.addEventListener("blur", onHide);

    launchHref(href);
  });
}

export async function openAppDeepLink({
  id,
  type,
  query,
  webUrl,
  eventName = "deep_link_opened",
}) {
  const targetId = String(id || "").trim();
  if (!targetId || inFlight) return;

  inFlight = true;
  const os = getOS();
  const platform = os || "unknown";
  const schemeQuery = query || { [`${type}_id`]: targetId };

  trackDeepLinkEvent(eventName, {
    id: targetId,
    type,
    platform,
    web_url: webUrl,
  });

  try {
    if (!isMobileOs(os) || isDesktopBrowser()) {
      goToWebPage(webUrl);
      return;
    }

    trackDeepLinkEvent("deep_link_opened", {
      id: targetId,
      type,
      platform,
      href: customAppUrl(schemeQuery),
    });

    const opened = await tryOpenInstalledApp(schemeQuery);
    if (opened) return;

    trackDeepLinkEvent("deep_link_fallback", {
      id: targetId,
      type,
      platform,
    });
    window.location.href = storeUrlFor(os);
  } finally {
    window.setTimeout(() => {
      inFlight = false;
    }, 800);
  }
}
