import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Bewusst verworfene Werte mit Unterstrich kennzeichnen
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }],
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "playwright-report/**", "test-results/**", "data/**", "next-env.d.ts"],
  },
];

export default config;
