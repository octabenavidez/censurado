# Censurado (@censurado.ok) — Página de Enlaces

Réplica de alta fidelidad visual de la página de enlaces oficial de **Censurado** (`https://linktr.ee/censurado.ok`), desarrollada con **Astro 5**, **React 19**, **TypeScript** estricto y **Vanilla CSS**. Diseñada para autohospedaje estático en dominio propio, con máxima velocidad, accesibilidad WCAG y SEO técnico listo para producción.

---

## 🚀 Características Principales

- **Fidelidad Visual Absoluta**: Idéntica composición a la referencia original (fondo `#2A3236`, panel central `#000000`, tarjetas `#222222`, centrado geométrico y miniatura exclusiva en NUEVA CÓRDOBA).
- **Cero Dependencia de Linktree**: Sin llamadas externas a Linktree, sin rastreadores ni scripts innecesarios.
- **HTML Estático Resiliente**: El encabezado y los 8 enlaces funcionan al 100% sin JavaScript en el navegador.
- **Islas React Interactivas**:
  - Botón de compartir superior derecho (`SharePage.tsx`) con Web Share API y diálogo modal accesible con copiado rápido.
  - Menú de 3 puntos en cada tarjeta (`LinkActions.tsx`) para compartir o copiar la URL directa de cada sucursal con anuncio accesible en vivo (*"Enlace copiado"*).
- **SEO Técnico & Redes Sociales**:
  - `lang="es-AR"` y marcado semántico con un único `<h1>`.
  - Open Graph y Twitter Cards integrados (1200 × 630 px).
  - Datos estructurados Schema.org (`Organization` y `WebSite`) en JSON-LD vinculados al Instagram verificado.
  - Generación de `robots.txt` y `sitemap-index.xml` configurable por variable de entorno sin URLs ficticias.
- **Página 404 Integrada**: Diseño acorde con botón de retorno al inicio y directiva `noindex`.

---

## 📁 Estructura del Proyecto

```
CENSURADO LINKTREE/
├── public/
│   ├── favicon.svg               # Favicon vectorial con emblema de Censurado
│   ├── favicon.png               # Icono PNG alternativo
│   └── images/
│       ├── avatar.webp           # Avatar circular optimizado (400x400)
│       ├── nueva-cordoba.webp    # Miniatura de sucursal Nueva Córdoba (160x160)
│       └── og-cover.jpg          # Portada para redes sociales (1200x630)
├── src/
│   ├── components/
│   │   ├── ProfileHeader.astro   # Encabezado estático (Avatar, H1, bio)
│   │   ├── LinkCard.astro        # Tarjeta de sucursal con <a> nativo y slot
│   │   ├── SharePage.tsx         # Isla React: Compartir perfil
│   │   └── LinkActions.tsx       # Isla React: Menú popover de 3 puntos
│   ├── data/
│   │   ├── links.ts              # Centralización de las 8 sucursales y URLs
│   │   └── site-config.ts        # Metadatos del sitio, handle y configuración
│   ├── layouts/
│   │   └── BaseLayout.astro      # Estructura HTML5, metadatos, Open Graph y JSON-LD
│   ├── pages/
│   │   ├── index.astro           # Página principal
│   │   ├── 404.astro             # Página de error 404
│   │   └── robots.txt.ts         # Generador dinámico de robots.txt
│   └── styles/
│       └── global.css            # Variables CSS, diseño responsive y accesibilidad
├── scripts/
│   └── prepare-assets.cjs        # Script automatizado para procesar imágenes con sharp
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## 🛠️ Instalación y Desarrollo

### Requisitos Previos
- Node.js 18.20+ (recomendado Node.js 20+ o 22+).
- npm 9+.

### 1. Clonar o Abrir el Proyecto
```bash
cd "CENSURADO LINKTREE"
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
Abre en tu navegador la dirección indicada (por defecto `http://localhost:4321`).

---

## 📦 Compilación y Producción

### Generar Build Estático
Para generar la versión de producción lista para servir:
```bash
npm run build
```
Esto creará la carpeta `dist/` con todo el HTML, CSS, JavaScript y assets estáticos listos.

### Build con Dominio de Producción (Recomendado para Sitemap y Canónicos)
Para que el sitemap (`sitemap-index.xml`), el archivo `robots.txt` y las etiquetas canónicas incluyan tu dominio definitivo:

**En Linux / macOS / Bash:**
```bash
SITE_URL="https://tudominio.com" npm run build
```

**En Windows PowerShell:**
```powershell
$env:SITE_URL="https://tudominio.com"; npm run build
```

### Previsualizar el Build Localmente
```bash
npm run preview
```

---

## 🖼️ Reemplazo y Edición de Imágenes

Las imágenes locales se encuentran en `public/images/`:

| Archivo | Dimensión Recomendada | Propósito |
| :--- | :--- | :--- |
| `public/images/avatar.webp` | 400 × 400 px (cuadrado) | Avatar principal del perfil. |
| `public/images/nueva-cordoba.webp` | 160 × 160 px (cuadrado) | Miniatura en la tarjeta de Nueva Córdoba. |
| `public/images/og-cover.jpg` | 1200 × 630 px | Imagen para Open Graph (WhatsApp, Facebook, Twitter, etc.). |
| `public/favicon.svg` | Vectorial | Icono de pestaña del navegador. |

> **Nota**: Si deseas regenerar automáticamente los assets desde `imagenes/Fondo Censurado.png` y `imagenes/LOGO CENSURADO.png`, ejecuta:
> ```bash
> node scripts/prepare-assets.cjs
> ```

---

## 🔗 Modificación o Agregado de Sucursales

Todos los destinos y etiquetas están centralizados en `src/data/links.ts`.

Ejemplo para modificar o añadir una sucursal:
```typescript
{
  id: "nueva-sucursal",
  label: "NOMBRE DE SUCURSAL",
  href: "https://cucina.link/?t=censurado-ejemplo",
  thumbnail: null // o "/images/mi-miniatura.webp"
}
```

---

## 🌐 Guía de Despliegue en Hosting Estático

La carpeta `dist/` no requiere ningún servidor Node.js en ejecución. Se puede desplegar en cualquier proveedor estático:

### Opciones Recomendadas:
1. **Cloudflare Pages**:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Variable de entorno: `SITE_URL=https://tudominio.com`
2. **Vercel**:
   - Framework preset: Astro
   - Variable de entorno: `SITE_URL=https://tudominio.com`
3. **Netlify**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Variable de entorno: `SITE_URL=https://tudominio.com`
4. **Servidor Nginx / Apache / VPS**:
   - Copiar el contenido de `dist/` a la carpeta web (por ejemplo `/var/www/html/`).
   - Configurar redirección obligatoria de HTTP a HTTPS y de `www` a sin `www` (o viceversa).
   - Configurar `try_files $uri $uri/ /404.html;` para que los errores 404 devuelvan estado HTTP 404.

---

## 📋 Checklist Posterior al Despliegue (SEO & Verificación)

1. **Configurar HTTPS y Dominio**:
   - Asegurarse de que el certificado SSL/TLS esté activo.
   - Forzar redirección permanente 301 de `http://` a `https://`.
2. **Google Search Console**:
   - Dar de alta la propiedad del dominio en [Google Search Console](https://search.google.com/search-console).
   - Enviar el sitemap: `https://tudominio.com/sitemap-index.xml`.
   - Inspeccionar la URL principal y solicitar indexación.
3. **Verificación de Redes Sociales**:
   - Probar la vista previa del enlace en el depurador de WhatsApp, [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) y Twitter Card Validator.
4. **Validación de Datos Estructurados**:
   - Comprobar la URL en la [Herramienta de Prueba de Resultados Enriquecidos de Google](https://search.google.com/test/rich-results) y Schema Validator.

---

## 📌 Pendientes Reales

- **Configuración del Dominio Definitivo**: Establecer la variable de entorno `SITE_URL` con la URL final del dominio cuando esté adquirido y delegado.
- **Imágenes Finales**: El proyecto ya cuenta con las imágenes optimizadas a partir de los archivos de marca provistos en `imagenes/`. Si en el futuro se desea cambiar la foto de portada o el avatar, simplemente reemplaza los archivos en `public/images/`.


## Corrección de enlaces compartidos (21/09/2026)

Los tres puntos comparten y copian exactamente `link.href`, el mismo destino externo de la tarjeta. Nueva Córdoba usa https://www.cucina.link/ords/pedidos/r/pedidos/categorias?t=censurado-nvacba. No se crean páginas intermedias ni se comparte localhost desde las sucursales. Solo el botón superior comparte la página del perfil.

LinkedIn puede tomar el `og:url` genérico publicado por Cucina al generar su vista previa. El botón envía la URL completa correctamente codificada; los metadatos externos deben corregirse en Cucina si LinkedIn los sustituye.

Se quitó Messenger porque usaba un app_id ajeno. La opción “Más opciones” usa las aplicaciones que ofrezca el sistema mediante Web Share cuando esté disponible. La copia tiene alternativa manual si el navegador la rechaza. El modal contiene el foco, bloquea el fondo y permite Escape.


## GitHub → Hostinger compartido

- `main`: código fuente. Editar y subir cambios aquí.
- `deploy`: contenido compilado de `dist` en la raíz; lo actualiza GitHub Actions solo después de pasar check, build y validación de enlaces. No editar manualmente.
- Actions → Build and publish deploy branch → Run workflow permite regenerar sin cambios de código.
- En GitHub → Settings → Secrets and variables → Actions → Variables, crear `SITE_URL` con el origen HTTPS real del sitio (sin ruta). Volver a ejecutar el workflow para generar canonical, Open Graph absoluto y sitemap. Mientras falte, el build funciona pero no genera sitemap/canonical de producción.
- En Hostinger → sitio → Advanced → Git, conectar GitHub y autorizar este repositorio privado, seleccionar la rama **deploy**, directorio `public_html` del sitio elegido y activar auto-deployment. No conectar `main`. En deploy, index.html ya está en la raíz; no seleccionar una subcarpeta dist.
- El directorio de destino debe ser el de este sitio: el despliegue puede reemplazar archivos existentes. No conectar a una web distinta.
- Comprobar HTTPS, la 404 y el historial de despliegues después de conectar. Hacer un cambio pequeño en main y verificar el ciclo completo hasta Hostinger.
- GitHub no contiene credenciales de Hostinger. La vinculación/autorización y la prueba final del hosting quedan a cargo del propietario.

Documentación de Hostinger: https://www.hostinger.com/support/1583302-how-to-deploy-a-git-repository-in-hostinger/
