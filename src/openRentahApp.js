export const APP_STORE_URL = "https://apps.apple.com/in/app/rentah/id1668164022";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.app.rentah&pcampaignid=web_share";

const APP_SCHEME = "rentah";
const ANDROID_PACKAGE = "com.app.rentah";
const FALLBACK_MS = 1600;

export function getOS() {
  const userAgent = window.navigator.userAgent;
  const platform =
    window.navigator?.userAgentData?.platform || window.navigator.platform;
  const macosPlatforms = ["macOS", "Macintosh", "MacIntel", "MacPPC", "Mac68K"];
  const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
  const iosPlatforms = ["iPhone", "iPad", "iPod"];

  if (macosPlatforms.includes(platform)) return "Mac OS";
  if (iosPlatforms.includes(platform)) return "iOS";
  if (windowsPlatforms.includes(platform)) return "Windows";
  if (/Android/.test(userAgent)) return "Android";
  if (/Linux/.test(platform)) return "Linux";
  return null;
}

function storeUrlFor(os) {
  return os === "iOS" ? APP_STORE_URL : PLAY_STORE_URL;
}

function appPath(target) {
  if (target?.type === "listing" && target.id) return `listing/${target.id}`;
  if (target?.type === "chat" && target.id) return `chat/${target.id}`;
  return "";
}

function customSchemeUrl(target) {
  const path = appPath(target);
  return path ? `${APP_SCHEME}://${path}` : `${APP_SCHEME}://`;
}

function androidIntentUrl(target) {
  const path = appPath(target);
  const fallback = encodeURIComponent(PLAY_STORE_URL);
  const hostAndPath = path || "home";
  return `intent://${hostAndPath}#Intent;scheme=${APP_SCHEME};package=${ANDROID_PACKAGE};S.browser_fallback_url=${fallback};end`;
}

function goToStore(os) {
  const storeUrl = storeUrlFor(os);
  if (os === "iOS" || os === "Android") {
    window.location.href = storeUrl;
    return;
  }
  window.open(PLAY_STORE_URL, "_blank", "noopener,noreferrer");
}

function appOpened(startedAt) {
  if (document.hidden || document.webkitHidden) return true;
  if (document.visibilityState === "hidden") return true;
  return Date.now() - startedAt > FALLBACK_MS + 400;
}

export function openRentahApp(target) {
  const os = getOS();

  if (os !== "iOS" && os !== "Android") {
    goToStore(os);
    return;
  }

  const startedAt = Date.now();
  let settled = false;

  const cancelFallback = () => {
    settled = true;
    window.clearTimeout(timer);
    document.removeEventListener("visibilitychange", onHide);
    window.removeEventListener("pagehide", onHide);
    window.removeEventListener("blur", onHide);
  };

  const onHide = () => {
    if (document.hidden || document.visibilityState === "hidden") {
      cancelFallback();
    }
  };

  const timer = window.setTimeout(() => {
    if (settled || appOpened(startedAt)) {
      cancelFallback();
      return;
    }
    cancelFallback();
    goToStore(os);
  }, FALLBACK_MS);

  document.addEventListener("visibilitychange", onHide);
  window.addEventListener("pagehide", onHide);
  window.addEventListener("blur", onHide);

  window.location.href = os === "Android" ? androidIntentUrl(target) : customSchemeUrl(target);
}
