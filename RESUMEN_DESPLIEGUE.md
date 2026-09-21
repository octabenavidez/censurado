# Censurado — Resumen Técnico de Despliegue y Estado del Proyecto

Documento que detalla el diagnóstico realizado, las soluciones aplicadas, las mejoras introducidas y la guía definitiva para conectar el sitio a Hostinger.

---

## 1. Diagnóstico del Error `startup_failure`

### Síntoma inicial
* El workflow `.github/workflows/deploy.yml` fallaba automáticamente en 0 segundos con el estado `startup_failure` antes de que se creara o iniciara cualquier máquina virtual en GitHub.
* Localmente, el proyecto compilaba (`npm run build`) y validaba tipos (`npm run check`) con 0 errores.

### Causa raíz descubierta
1. Se consultó la API interna de GitHub Actions (`gh api`) y se detectó que los eventos de *push* estaban siendo interceptados por un registro sintético de GitHub denominado `BuildFailed`.
2. Al forzar una ejecución detallada, GitHub arrojó la anotación exacta:
   > `The job was not started because your account is locked due to a billing issue.`
3. Se confirmó con la captura de pantalla de la cuenta: la cuenta de GitHub tenía un cobro rechazado por el banco (**"Your payment authorization has failed"**), lo que congela el uso de runners de GitHub Actions en toda la cuenta.

---

## 2. Acciones y Soluciones Implementadas

### A. Repositorio configurado como PÚBLICO
* Se cambió la visibilidad del repositorio a **Público**: [github.com/octabenavidez/censurado](https://github.com/octabenavidez/censurado).
* **Beneficio**: No expone datos confidenciales (es un Linktree estático con links públicos de delivery e Instagram) y permite a Hostinger clonar el sitio de forma directa vía HTTPS sin necesidad de configurar complejas llaves SSH privadas.

### B. Reglas de Redirección Forzada a HTTPS (`.htaccess`)
* Se editó el archivo `public/.htaccess` para que Apache/Hostinger redirija automáticamente cualquier tráfico inseguro `http://` a `https://` con código de estado permanente 301:
  ```apache
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  ErrorDocument 404 /404.html
  Options -Indexes
  ```
* Astro copia este archivo directamente a `dist/` en cada compilación.

### C. Creación y Publicación de la Rama `deploy`
* Se ejecutó la compilación de producción (`npm run build`) y la verificación de enlaces (`verify-build.py`), asegurando que las 8 sucursales apunten a sus destinos oficiales.
* Se generó la rama remota **`deploy`** en GitHub conteniendo únicamente los archivos estáticos listos para servir:
  * `index.html` (página principal de alta fidelidad)
  * `404.html` (página de error personalizada)
  * `.htaccess` (HTTPS forzado + 404)
  * `robots.txt` (directivas para buscadores)
  * `favicon.svg` y `favicon.png`
  * `_astro/` (CSS y bundles React hidratados)
  * `images/` (avatar, miniatura de Nueva Córdoba y portada Open Graph)

### D. Nuevo Comando Autónomo de Despliegue (`npm run deploy`)
Para no depender de los bloqueos de GitHub Actions ni esperar que se resuelvan problemas bancarios, se implementó un script de despliegue automático:
* **Script**: `scripts/publish-deploy.cjs`
* **Comando en `package.json`**: `"deploy": "node scripts/publish-deploy.cjs"`
* **¿Qué hace con un solo clic?**
  1. Ejecuta `astro check` (valida TypeScript y componentes).
  2. Ejecuta `astro build` (genera el bundle estático en `dist/`).
  3. Ejecuta `verify-build.py` (audita que los 8 enlaces estén intactos).
  4. Sube y actualiza la rama `deploy` en GitHub en menos de 10 segundos.

---

## 3. Guía Paso a Paso para Publicar en Hostinger

Ya no necesitas configurar nada más en el código. Para tener el sitio online:

### Paso 1: Conectar el Repositorio en Hostinger
1. Entra a tu panel de **Hostinger (hPanel)**.
2. Ve al menú lateral: **Avanzado (Advanced)** → **Git**.
3. En la sección **Desplegar un repositorio Git**, completa los campos:
   * **Repositorio**: `https://github.com/octabenavidez/censurado.git`
   * **Rama (Branch)**: `deploy`
   * **Carpeta de destino (Install directory)**: `public_html`
   * **Auto-deployment**: Activar / Marcar la casilla.
4. Haz clic en el botón **Crear / Desplegar (Create / Deploy)**.

> **Nota**: Hostinger descargará el contenido de la rama `deploy` directamente en `public_html`. Como el sitio ya está compilado en HTML/CSS/JS estático, no requiere Node.js ni comandos de build en el servidor: **funciona al instante**.

### Paso 2: SSL y HTTPS en Hostinger
1. En hPanel, ve a **Seguridad** → **SSL**.
2. Verifica que el certificado SSL gratuito (Let's Encrypt) esté activo en tu dominio.
3. Activa la opción **Forzar HTTPS**.

### Paso 3: Configurar el Dominio en GitHub (`SITE_URL`)
Cuando tengas definido el dominio web definitivo (ejemplo: `https://censurado.com.ar`):
1. Ve a tu repositorio en GitHub: **Settings** → **Secrets and variables** → **Actions** → Pestaña **Variables**.
2. Agrega una variable:
   * **Name**: `SITE_URL`
   * **Value**: Tu URL definitiva con `https://` y sin barra al final (ej: `https://censurado.com.ar`).
3. O ejecútalo en la terminal de tu máquina:
   ```bash
   gh variable set SITE_URL --body "https://tudominio.com"
   ```

### Paso 4: Validar en LinkedIn Post Inspector
Una vez publicado el dominio:
1. Abre **[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)**.
2. Pega la URL de tu sitio web.
3. Confirma que la vista previa cargue:
   * Título: `Censurado | Sucursales y pedidos`
   * Descripción oficial de Censurado.
   * Imagen de portada optimizada (1200 × 630 px).

---

## 4. Resumen de Comandos del Proyecto

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor local de desarrollo (`localhost:4321`) |
| `npm run check` | Analiza errores de tipos TypeScript y componentes Astro |
| `npm run build` | Compila el sitio estático en la carpeta local `dist/` |
| `npm run deploy` | Compila, audita y actualiza automáticamente la rama `deploy` en GitHub |
