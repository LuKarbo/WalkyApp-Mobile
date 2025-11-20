# **WalkyAPP**

**Descripción:** Proyecto mobile de Walky para la gestión de paseos de mascotas (UI, consumo de API y control de sesión), ademas de aportar de forma exclusiva la funcionalidad de rastreo GPS.
El código contiene la app (rutas y pantallas), componentes reutilizables, un cliente API para comunicarse con un backend remoto y utilidades comunes.

**Rápido — Ejecutar localmente**

- **Instalar dependencias:** `npm install`
- **Configurar entorno:** copia `./.env.example` a `./.env` y ajusta `API_BASE_URL` si hace falta. El proyecto ya incluye `app.config.js` que carga `dotenv` y expone `API_BASE_URL` en `expo.extra`.
- **Iniciar Metro / Expo:** `npm run start` (o `npx expo start`)
- **Abrir en dispositivo/emulador:**
  - Android: `npm run android`
  - iOS: `npm run ios`
  - Web: `npm run web`

**Scripts disponibles**

- **`start`**: `expo start` — inicia Metro/Expo.
- **`android`**: `expo start --android` — lanza en Android/emulador.
- **`ios`**: `expo start --ios` — lanza en iOS/simulador.
- **`web`**: `expo start --web` — prueba en web.
- **`reset-project`**: `node ./scripts/reset-project.js` — (script incluido) desplaza el starter a `app-example` y deja la carpeta `app` vacía para empezar desde cero.
- **`lint`**: `expo lint` — analiza con ESLint.

**Entorno y variables**

- **Archivo de ejemplo:** `./.env.example` (contiene `API_BASE_URL`).
- **Ignorado por git:** `.env` está listado en `.gitignore`.
- **Dónde se usa:** `app.config.js` carga `process.env.API_BASE_URL` y lo expone como `expo.extra.API_BASE_URL`. En runtime `backend/config/ApiClient.js` obtiene la URL desde `expo-constants` (`Constants.manifest.extra.API_BASE_URL`) o `process.env.API_BASE_URL`.

**Lenguajes y frameworks**

- **Lenguajes:** JavaScript (ESNext), JSX. Hay configuración relacionada con TypeScript (`tsconfig.json` y dependencias de tipo) pero el código principal está en JS/JSX.
- **Frameworks/plataformas:** Expo SDK (universal: iOS / Android / Web), React, React Native.

**Arquitectura y organización de carpetas**

- **`app/`**: código de la aplicación (rutas y pantallas) — usa file-based routing de `expo-router`.
- **`components/`**: componentes UI reutilizables (separados por dominio: `auth`, `client`, `pet`, `walker`, `common`, `walk`).
- **`assets/`**: imágenes y recursos estáticos.
- **`backend/`**: capa cliente que organiza el acceso al backend remoto (NO es el servidor). Dentro contiene:
  - `API/` — wrappers de API (ej. `AuthAPI.js`, `WalksAPI.js`) que llaman a `backend/config/ApiClient.js`.
  - `config/` — configuración compartida (ej. `ApiClient.js`).
  - `Controllers/` — lógica para transformar/coordinar llamadas (`AuthController.js`, `PetsController.js`, ...).
  - `Services/` — lógica de negocio y orquestación usada por los controladores.
  - `DataAccess/` — funciones de acceso a datos remotos (llamadas CRUD a la API).
  - `Context/` — providers React (`UserContext.jsx`, `ToastContext.jsx`).
  - `System/` — utilidades del sistema (ej. `GPSService.js`).
- **`hooks/`**: hooks personalizados (`useAuth.js`, `useToast.js`).
- **`utils/`**: constantes, formateadores y validadores.
- **`android/`**: proyecto Android (generado por Expo / EAS) — incluye `gradle` y configuración nativa.

**Cliente API y sesión**

- **`backend/config/ApiClient.js`**: cliente HTTP que monta la URL base desde `expo-constants` o `process.env`, añade `Content-Type: application/json`, y gestiona token con `@react-native-async-storage/async-storage` (`setToken`, `getToken`, `removeToken`).
- **Uso:** las funciones en `backend/API/*.js` usan ese cliente para todas las llamadas REST (login, walks, pets, reviews, etc.).

**Librerías principales**

- `expo`, `expo-router`, `expo-constants`, `expo-location`, `expo-task-manager`
- `react`, `react-native`, `react-dom`, `react-native-web`
- `@react-native-async-storage/async-storage`, `react-navigation` (paquetes relacionados)
- `react-native-maps`, `react-native-paper`, `react-native-reanimated`, `react-native-gesture-handler`
- `dotenv`, `date-fns`, `@expo/vector-icons`

**Puntos importantes / Notas operativas**

- Después de cambiar `./.env`, reinicia Metro/Expo para que `app.config.js` vuelva a leer las variables y las inyecte en `expo.extra`.
- `./backend/config/ApiClient.js` usa `Constants.manifest.extra.API_BASE_URL` en entornos Expo clásicos. Si usas un build nativo o EAS, asegúrate de que `expo.extra` esté disponible en la configuración correspondiente.
- `./.env` no debe subirse al repositorio. Usa `./.env.example` como plantilla.
