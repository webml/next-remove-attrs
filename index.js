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
  const htmlPattern = attrs.map((a) => `\\s${a}="[^"]*"`).join("|");
  const jsonPattern = attrs
    .map((a) => `("${a}"\\s*:\\s*"[^"]*"\\s*,?)`)
    .join("|");
  return new RegExp(`${htmlPattern}|${jsonPattern}`, "g");
}

const regex = buildRegex();

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith(".js") || file.endsWith(".json")) {
      let content = fs.readFileSync(fullPath, "utf8");
      const newContent = content
        .replace(regex, "")
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]");
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent, "utf8");
        console.log(`Cleaned: ${fullPath}`);
      }
    }
  }
}

console.log(`Removing attributes: ${attrs.join(", ")} from ${root}`);
walk(root);
