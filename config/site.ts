import { USER } from "@/features/profile/data/user";

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.APP_URL || "https://admin12121.com",
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const GITHUB_USERNAME = "admin12121";
export const SOURCE_CODE_GITHUB_REPO = "admin12121/portfolio";
export const SOURCE_CODE_GITHUB_URL =
  "https://github.com/admin12121/portfolio";

export const UTM_PARAMS = {
  utm_source: "admin12121.com",
  utm_medium: "portfolio_website",
  utm_campaign: "referral",
};
