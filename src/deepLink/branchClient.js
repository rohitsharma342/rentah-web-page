import { BRANCH_KEY } from "./config";

const BRANCH_SCRIPT = "https://cdn.branch.io/branch-latest.min.js";

let sdkPromise = null;
let initPromise = null;

function loadBranchScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Branch is only available in the browser"));
  }
  if (window.branch) return Promise.resolve(window.branch);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${BRANCH_SCRIPT}"]`);
    if (existing && window.branch) {
      resolve(window.branch);
      return;
    }

    const script = document.createElement("script");
    script.src = BRANCH_SCRIPT;
    script.async = true;
    script.onload = () => {
      if (window.branch) resolve(window.branch);
      else reject(new Error("Branch SDK loaded without window.branch"));
    };
    script.onerror = () => reject(new Error("Failed to load Branch SDK"));
    document.head.appendChild(script);
  });

  return sdkPromise;
}

export function isBranchConfigured() {
  return Boolean(BRANCH_KEY);
}

export async function getBranch() {
  if (!BRANCH_KEY) {
    throw new Error("REACT_APP_BRANCH_KEY is not set");
  }

  const branch = await loadBranchScript();
  if (initPromise) {
    await initPromise;
    return branch;
  }

  initPromise = new Promise((resolve, reject) => {
    branch.init(BRANCH_KEY, {}, (err) => {
      if (err) {
        initPromise = null;
        reject(err);
        return;
      }
      resolve();
    });
  });

  await initPromise;
  return branch;
}

export async function createBranchLink(linkData) {
  const branch = await getBranch();

  return new Promise((resolve, reject) => {
    branch.link(linkData, (err, url) => {
      if (err || !url) {
        reject(err || new Error("Branch did not return a link"));
        return;
      }
      resolve(url);
    });
  });
}

export async function logBranchEvent(name, metadata) {
  try {
    const branch = await getBranch();
    if (typeof branch.logEvent === "function") {
      branch.logEvent(name, metadata);
    }
  } catch {
    // Branch analytics is optional
  }
}
