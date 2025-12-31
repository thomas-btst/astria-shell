import js from "@eslint/js"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"
import prettierRecommended from "eslint-plugin-prettier/recommended"
import "path"

export default defineConfig(
    globalIgnores(["@girs/**"]),
    {
        languageOptions: {
            parserOptions: {
                project: ["./tsconfig.json"],
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    js.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    prettierRecommended,
    {
        files: ["**/*.{ts,tsx}"],
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    varsIgnorePattern: "^_",
                    argsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                },
            ],
            "@typescript-eslint/use-unknown-in-catch-callback-variable": "off",
            "@typescript-eslint/no-namespace": "off",
        },
    },
    {
        rules: {
            "prettier/prettier": [
                "error",
                {
                    singleQuote: false,
                    trailingComma: "all",
                    tabWidth: 4,
                    semi: false,
                    printWidth: 120,
                },
            ],
        },
    },
)
