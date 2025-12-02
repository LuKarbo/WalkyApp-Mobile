require('dotenv').config();

module.exports = {
  expo: {
    name: "WalkyAPP",
    slug: "walkyapp",
    version: "1.0.3",
    scheme: "walkyapp",
    platforms: ["ios", "android", "web"],
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "light",
    extra: {
      eas: {
        projectId: "c2cb8500-4524-44fa-9a53-58f0947619e3"
      },
      API_BASE_URL: process.env.API_BASE_URL
    },
    
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#6366f1"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.walkyapp.walkyapp",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "WalkyAPP necesita acceso a tu ubicación para rastrear los paseos de las mascotas en tiempo real y mostrarte paseadores cercanos.",
        NSLocationAlwaysAndWhenInUseUsageDescription: "WalkyAPP necesita acceso a tu ubicación todo el tiempo para poder rastrear los paseos incluso cuando la aplicación está en segundo plano o cerrada.",
        NSLocationAlwaysUsageDescription: "WalkyAPP necesita acceso a tu ubicación en segundo plano para rastrear los paseos de mascotas de forma continua y segura.",
        "ITSAppUsesNonExemptEncryption": false,
        UIBackgroundModes: [
          "location",
          "fetch",
          "remote-notification"
        ]
      },
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/android-icon-background.png",
        backgroundColor: "#6366f1"
      },
      package: "com.walkyapp.walkyapp",
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "FOREGROUND_SERVICE",
        "FOREGROUND_SERVICE_LOCATION"
      ],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },
    plugins: [
      "expo-router",
      "expo-notifications",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "WalkyAPP necesita acceso a tu ubicación para rastrear los paseos de las mascotas en tiempo real y mostrarte paseadores cercanos.",
          locationAlwaysPermission: "WalkyAPP necesita acceso a tu ubicación en segundo plano para rastrear los paseos de mascotas de forma continua y segura.",
          locationWhenInUsePermission: "WalkyAPP necesita acceso a tu ubicación para rastrear los paseos de las mascotas en tiempo real.",
          isAndroidBackgroundLocationEnabled: true,
          isAndroidForegroundServiceEnabled: true
        }
      ],
      "expo-task-manager"
    ]
  }
};