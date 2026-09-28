export function trackDeepLinkEvent(name, payload = {}) {
  const event = {
    name,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, event);
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[deep-link]", event);
  }
}
