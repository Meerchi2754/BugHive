export const getURL = (): string => {
  let url =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    (typeof window !== "undefined" ? window.location.origin : "") ||
    "http://localhost:3000";

  url = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
  return url.endsWith("/") ? url.slice(0, -1) : url;
};
