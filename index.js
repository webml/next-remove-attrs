const fs = require("fs");
const path = require("path");

const root = process.argv.includes("--path")
  ? process.argv[process.argv.indexOf("--path") + 1]
  : ".next";

const attrsArg = process.argv.includes("--attrs")
  ? process.argv[process.argv.indexOf("--attrs") + 1]
  : "data-testid";

const attrs = attrsArg
  .split(",")
  .map((a) => a.trim())
  .filter(Boolean);

function buildRegex() {
  // Совмещаем JSON-подобные ключи и HTML-подобные атрибуты
  const jsonPattern = attrs.map((a) => `"${a}"\\s*:\\s*[^,}\\]]+`).join("|");
  const htmlPattern = attrs.map((a) => `\\s${a}="[^"]*"`).join("|");

  // Группируем и ищем запятую перед или после ключа, чтобы безопасно удалять
  return new RegExp(`(,?\\s*(${jsonPattern})\\s*,?)|((${htmlPattern}))`, "g");
}

const regex = buildRegex();

function walk(dir) {
  if (!fs.existsSync(dir)) return;

  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith(".js") || file.endsWith(".json")) {
      let content = fs.readFileSync(fullPath, "utf8");
      let newContent = content;

      // Пока находятся совпадения — удаляем их
      while (regex.test(newContent)) {
        newContent = newContent.replace(regex, (match, p1, p2, p3, p4) => {
          if (p1) return p1.startsWith(",") ? "" : ""; // запятая уже в match
          if (p4) return ""; // HTML атрибут
          return "";
        });
      }

      // Убираем лишние запятые после удаления
      newContent = newContent.replace(/,\s*(\}|])/g, "$1");

      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent, "utf8");
        console.log(`Cleaned: ${fullPath}`);
      }
    }
  }
}

console.log(`Removing attributes: ${attrs.join(", ")} from ${root}`);
walk(root);
