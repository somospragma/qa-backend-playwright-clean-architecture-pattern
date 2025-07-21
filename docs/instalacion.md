# Instalación

A continuación se detallan los pasos para instalar y ejecutar la suite de pruebas automatizadas con Playwright.

## 1. Clonar el repositorio

```bash
git clone https://github.com/somospragma/qa-backend-playwright-clean-architecture-pattern
cd nombre-proyecto
```

## 2. Instalar dependencias

Asegúrate de tener [Node.js](https://nodejs.org/en) instalado (versión 16 o superior). Luego ejecuta:

```bash
npm install
```

## 3. Ejecutar las pruebas

Puedes correr todas las pruebas con el siguiente comando:

```bash
npm run test
```

## 4. Ejecutar pruebas específicas

Si tienes scripts separados para servicios o funcionalidades específicas, puedes ejecutar solo una sección del proyecto, por ejemplo:

```bash
npm run test:servicio1
```

> Asegúrate de definir esos scripts personalizados en tu archivo `package.json`.

## 5. Verificar que Playwright esté instalado

Si es la primera vez que usas Playwright, instala sus dependencias de navegador:

```bash
npx playwright install
```

Esto descargará Chromium, Firefox y WebKit si aún no están disponibles en tu entorno.

---

✅ ¡Con eso estarás listo para comenzar a probar!
