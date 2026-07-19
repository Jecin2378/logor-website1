import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Allow any in specific contexts (we'll fix as we go)
      "@typescript-eslint/no-explicit-any": "warn",
      // Unused vars (auto-fixable)
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
      }],
      // React hooks exhaustive deps
      "react-hooks/exhaustive-deps": "warn",
      // Allow require() in seed scripts
      "@typescript-eslint/no-require-imports": "warn",
    },
  },
]);

export default eslintConfig;
