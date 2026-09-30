import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bughive.dev";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/register", "/verify/*"],
        disallow: ["/api/", "/dashboard/", "/profile/", "/settings/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
