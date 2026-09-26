import { useEffect } from "react";

const SITE_DESCRIPTION = "Just Rent It - goods, Service & spaces nearby";
const DEFAULT_TITLE = "Rentah";
const DEFAULT_ICON = "/rentah_logo.png";

function upsertMeta(attr, key, content) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function usePageMeta({ title, image } = {}) {
  useEffect(() => {
    const pageTitle = title || DEFAULT_TITLE;
    const pageImage = image || DEFAULT_ICON;

    document.title = pageTitle;
    upsertMeta("name", "description", SITE_DESCRIPTION);
    upsertMeta("property", "og:title", pageTitle);
    upsertMeta("property", "og:description", SITE_DESCRIPTION);
    upsertMeta("property", "og:image", pageImage);
    upsertMeta("name", "twitter:card", "summary");
    upsertMeta("name", "twitter:title", pageTitle);
    upsertMeta("name", "twitter:description", SITE_DESCRIPTION);
    upsertMeta("name", "twitter:image", pageImage);
    upsertLink("icon", pageImage);
    upsertLink("shortcut icon", pageImage);
    upsertLink("apple-touch-icon", pageImage);

    return () => {
      document.title = DEFAULT_TITLE;
      upsertMeta("name", "description", SITE_DESCRIPTION);
      upsertLink("icon", DEFAULT_ICON);
      upsertLink("shortcut icon", DEFAULT_ICON);
      upsertLink("apple-touch-icon", DEFAULT_ICON);
    };
  }, [title, image]);
}
