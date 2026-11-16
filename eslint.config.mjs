import { defineConfig, globalIgnores } from "eslint/config";
import nextPlugin from "@next/eslint-plugin-next";
export default defineConfig([{ languageOptions: { parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } } }, plugins: { "@next/next": nextPlugin }, rules: { ...nextPlugin.configs.recommended.rules } }, globalIgnores([".next/**", "node_modules/**", "out/**", "next-env.d.ts"])]);
