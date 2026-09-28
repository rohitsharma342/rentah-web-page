const env = (key, fallback = "") =>
  (typeof process !== "undefined" && process.env && process.env[key]) || fallback;

export const APP_DOMAIN = env(
  "REACT_APP_PUBLIC_APP_DOMAIN",
  typeof window !== "undefined" ? window.location.host : "web.rentah.com"
);

export const BRANCH_KEY = env("REACT_APP_BRANCH_KEY", "");

export const ANDROID_STORE_URL = env(
  "REACT_APP_ANDROID_STORE_URL",
  "https://play.google.com/store/apps/details?id=com.app.rentah&pcampaignid=web_share"
);

export const IOS_STORE_URL = env(
  "REACT_APP_IOS_STORE_URL",
  "https://apps.apple.com/in/app/rentah/id1668164022"
);

export const ANDROID_PACKAGE = env(
  "REACT_APP_ANDROID_PACKAGE",
  "com.app.rentah"
);

export const APP_SCHEME = env("REACT_APP_APP_SCHEME", "rentah");

export function getAppOrigin() {
  const configured = APP_DOMAIN.trim();
  if (/^https?:\/\//i.test(configured)) {
    return configured.replace(/\/$/, "");
  }
  if (configured) {
    const host = configured.replace(/\/$/, "");
    const isLocal =
      host.startsWith("localhost") ||
      host.startsWith("127.") ||
      host.startsWith("192.168.") ||
      host.startsWith("10.");
    return `${isLocal ? "http" : "https"}://${host}`;
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "https://web.rentah.com";
}

export function productWebPath(productId) {
  return `/product/${productId}`;
}

export function productWebUrl(productId) {
  return `${getAppOrigin()}${productWebPath(productId)}`;
}

export function userWebPath(userId) {
  return `/user/${userId}`;
}

export function userWebUrl(userId) {
  return `${getAppOrigin()}${userWebPath(userId)}`;
}

export function customAppUrl(query) {
  const params = new URLSearchParams();
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value != null && value !== "") params.set(key, String(value));
  });
  return `${APP_SCHEME}://open?${params.toString()}`;
}

export function androidIntentUrl(query) {
  const params = new URLSearchParams();
  Object.entries(query || {}).forEach(([key, value]) => {
    if (key === "route") return;
    if (value != null && value !== "") params.set(key, String(value));
  });
  const fallback = encodeURIComponent(ANDROID_STORE_URL);
  return `intent://open?${params.toString()}#Intent;scheme=${APP_SCHEME};package=${ANDROID_PACKAGE};S.browser_fallback_url=${fallback};end`;
}

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

export function isMobileOs(os = getOS()) {
  return os === "iOS" || os === "Android";
}

export function isDesktopBrowser() {
  const platform =
    window.navigator?.userAgentData?.platform || window.navigator.platform || "";
  return /Win|Mac|Linux x86/i.test(platform) && !/Android/i.test(platform);
}

export function storeUrlFor(os = getOS()) {
  if (os === "iOS") return IOS_STORE_URL;
  return ANDROID_STORE_URL;
}
