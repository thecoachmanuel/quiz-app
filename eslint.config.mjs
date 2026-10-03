import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from 'eslint/config'

const eslintConfig = defineConfig([
  globalIgnores([".next/**", "out/**", "build/**", "node_modules/**"]),
  ...nextVitals,
  prettier,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error", // "error" ensures the build fails
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);

export default eslintConfig
