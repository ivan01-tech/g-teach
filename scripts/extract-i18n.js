import { Project, SyntaxKind } from "ts-morph";
import fg from "fast-glob";
import fs from "fs";
import path from "path";

const SRC_DIR = "components";
const LOCALES_DIR = "locales";
const DEFAULT_LOCALE = "en";

// Initialisation du projet TS (lecture AST)
const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

// Fichiers à analyser
const files = fg.sync([`${SRC_DIR}/**/*.{ts,tsx}`]);

const localeFile = path.join(LOCALES_DIR, `${DEFAULT_LOCALE}.json`);

// Charger les traductions existantes si elles existent
let messages = {};
if (fs.existsSync(localeFile)) {
  messages = JSON.parse(fs.readFileSync(localeFile, "utf8"));
}

// Parcours des fichiers
for (const filePath of files) {
  const sourceFile = project.addSourceFileAtPath(filePath);

  sourceFile.forEachDescendant((node) => {
    // t("...")
    if (
      node.getKind() === SyntaxKind.CallExpression &&
      node.getExpression().getText() === "t("
    ) {
      const arg = node.getArguments()[0];

      if (arg && arg.getKind() === SyntaxKind.StringLiteral) {
        const text = arg.getText().slice(1, -1); // enlève les guillemets

        // clé = texte exact
        if (!messages[text]) {
          messages[text] = text;
        }
      }
    }
  });
}

// Écriture du fichier de langue
fs.mkdirSync(LOCALES_DIR, { recursive: true });
fs.writeFileSync(localeFile, JSON.stringify(messages, null, 2), "utf8");

console.log(`✅ ${Object.keys(messages).length} messages extraits`);
