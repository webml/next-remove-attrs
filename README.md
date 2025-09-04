# next-remove-attrs

Removes specified HTML attributes (e.g., `data-testid`) from the final Next.js build.

Удаляет указанные HTML-атрибуты (например, `data-testid`) из финальной сборки Next.js.

---

## 🇬🇧 Usage

### Install

```bash
npm install --save-dev next-remove-attrs
# or
yarn add -D next-remove-attrs
# or
pnpm add -D next-remove-attrs
```

### Run

Add to your `package.json`:

```json
{
  "scripts": {
    "postbuild": "next-remove-attrs --path .next --attrs data-testid,data-trackid"
  }
}
```

In this example, after running next build, the script will remove data-testid and data-trackid attributes from all .next files.

Run:

```bash
npm run build
```

### Options

--path — build directory (default .next)

--attrs — comma-separated list of attributes to remove

---

## 🇷🇺 Использование

### Установка

```bash
npm install --save-dev next-remove-attrs
# или
yarn add -D next-remove-attrs
# или
pnpm add -D next-remove-attrs
```

### Запуск

Добавьте в ваш `package.json`:

```json
{
  "scripts": {
    "postbuild": "next-remove-attrs --path .next --attrs data-testid,data-trackid"
  }
}
```

В этом примере после команды next build будут удалены атрибуты data-testid и data-trackid из всех файлов .next.

Запуск:

```bash
npm run build
```

### Опции

--path — директория сборки (по умолчанию .next)

--attrs — список атрибутов через запятую
