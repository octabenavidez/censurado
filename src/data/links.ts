/**
 * Link item representation for Censurado branch locations and social links.
 */
export interface BranchLink {
  /** Unique identifier for the link */
  id: string;
  /** Display label shown in the button */
  label: string;
  /** Verified destination URL */
  href: string;
  /** Path to local thumbnail image */
  thumbnail: string;
  /** Clean branch slug or title displayed in the share modal preview */
  shareTitle?: string;
  /** Short descriptive or action subtitle shown in the share modal */
  description?: string;
}

/**
 * Verified branch locations and external destinations in exact display order.
 * Extracted from official sources on 16/09/2026.
 */
export const BRANCH_LINKS: BranchLink[] = [
  {
    id: "nuevo-poeta",
    label: "NUEVO POETA",
    href: "https://www.cucina.link/ords/r/pedidos/pedidos/categorias?p5_id_tienda=379&id_local=379&t=censurado-nuevopoeta",
    thumbnail: "/images/cara-con-fondo.webp",
    shareTitle: "censurado-nuevopoeta",
    description: "Hace tu pedido!"
  },
  {
    id: "luuma",
    label: "LUUMA (Intercountry)",
    href: "https://menu.fu.do/luumacba",
    thumbnail: "/images/cara-con-fondo.webp",
    shareTitle: "censurado-luuma",
    description: "Hace tu pedido!"
  },
  {
    id: "nueva-cordoba",
    label: "NUEVA CÓRDOBA",
    href: "https://www.cucina.link/ords/pedidos/r/pedidos/categorias?t=censurado-nvacba",
    thumbnail: "/images/cara-con-fondo.webp",
    shareTitle: "censurado-nvacba",
    description: "Hace tu pedido!"
  },
  {
    id: "recta-martinolli",
    label: "RECTA MARTINOLLI",
    href: "https://www.cucina.link/ords/r/pedidos/pedidos/categorias?p5_id_tienda=214&id_local=214&t=censurado-recta",
    thumbnail: "/images/cara-con-fondo.webp",
    shareTitle: "censurado-recta",
    description: "Hace tu pedido!"
  },
  {
    id: "general-paz",
    label: "GENERAL PAZ",
    href: "https://www.cucina.link/ords/r/pedidos/pedidos/categorias?p5_id_tienda=264&id_local=264&t=censurado-gral-paz",
    thumbnail: "/images/cara-con-fondo.webp",
    shareTitle: "censurado-gral-paz",
    description: "Hace tu pedido!"
  },
  {
    id: "villa-carlos-paz",
    label: "VILLA CARLOS PAZ",
    href: "https://www.cucina.link/ords/r/pedidos/pedidos/categorias?p5_id_tienda=256&id_local=256&t=censurado-carlospaz",
    thumbnail: "/images/cara-con-fondo.webp",
    shareTitle: "censurado-carlospaz",
    description: "Hace tu pedido!"
  },
  {
    id: "urca",
    label: "URCA",
    href: "https://www.cucina.link/ords/r/pedidos/pedidos/categorias?p5_id_tienda=213&id_local=213&t=censurado-urca",
    thumbnail: "/images/cara-con-fondo.webp",
    shareTitle: "censurado-urca",
    description: "Hace tu pedido!"
  },
  {
    id: "instagram",
    label: "Entra a nuestro Instagram",
    href: "https://www.instagram.com/censurado.ok/",
    thumbnail: "/images/cara-con-fondo.webp",
    shareTitle: "@censurado.ok",
    description: "¡Seguinos en Instagram!"
  }
];
