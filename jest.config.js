/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind|react-native-css-interop|react-native-audio-api|drizzle-orm)",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    // Type-only modules have no runnable code.
    "!src/**/*.d.ts",
    "!src/**/types.ts",
    // Barrel files.
    "!src/**/index.ts",
    // Routes.
    "!src/app/**",
    // Platform glue validated on device (SAF/MediaStore, SQL, screens).
    "!src/core/db/client.ts",
    "!src/core/db/repositories/**",
    "!src/core/files/listers/**",
    "!src/features/**",
    // NativeWind interop wrapper (no logic).
    "!src/shared/ui/icons.ts",
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
};
