/**
 * Site configuration and SEO metadata for Censurado.
 */
export interface SiteConfig {
  /** Page title for head tag */
  title: string;
  /** Primary H1 title displayed on the profile card */
  profileHandle: string;
  /** Profile bio / product description */
  profileDescription: string;
  /** Meta description for SEO and social sharing */
  metaDescription: string;
  /** Document language code */
  lang: string;
  /** Avatar image path */
  avatarPath: string;
  /** Open Graph cover image path */
  ogCoverPath: string;
  /** Verified brand Instagram account URL */
  instagramUrl: string;
  /** Production site URL or fallback empty string */
  siteUrl: string;
}

/**
 * Global site configuration constants.
 */
export const SITE_CONFIG: SiteConfig = {
  title: "Censurado | Sucursales y pedidos",
  profileHandle: "@censurado.ok",
  profileDescription: "🍔BURGERS🍔/ 🥪LOMOS🥪/ 🌯WRAPS🌯/ PICKERS",
  metaDescription: "Hamburguesas, lomos, wraps y pickers. Encontrá todas las sucursales y hacé tu pedido online en Censurado.",
  lang: "es-AR",
  avatarPath: "/images/cara-con-fondo.webp",
  ogCoverPath: "/images/og-cover.jpg",
  instagramUrl: "https://www.instagram.com/censurado.ok/",
  siteUrl: (typeof process !== "undefined" && (process.env.SITE_URL || process.env.PUBLIC_SITE_URL)) || "",
};
