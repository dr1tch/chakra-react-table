#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

DEFAULT_PACKAGE="$(node -p "require('./packages/chakra/package.json').name")"
PACKAGE="${DEFAULT_PACKAGE}"
BUMP="patch"
SUMMARY="chore: release ${PACKAGE}"
NO_GIT_CHECKS="${NO_GIT_CHECKS:-1}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --package)
      PACKAGE="$2"
      shift 2
      ;;
    --bump)
      BUMP="$2"
      shift 2
      ;;
    --summary)
      SUMMARY="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1"
      echo "Usage: $0 [--package <name>] [--bump patch|minor|major] [--summary <text>]"
      exit 1
      ;;
  esac
done

if [[ "${BUMP}" != "patch" && "${BUMP}" != "minor" && "${BUMP}" != "major" ]]; then
  echo "Invalid bump '${BUMP}'. Use patch|minor|major."
  exit 1
fi

# ensure selected package exists in workspace
if ! pnpm -r list --depth -1 --json | node -e '
const fs=require("fs");
const pkg=process.argv[1];
const data=JSON.parse(fs.readFileSync(0,"utf8"));
const names=new Set(data.map((x)=>x.name).filter(Boolean));
process.exit(names.has(pkg)?0:1);
' "${PACKAGE}"; then
  echo "Package '${PACKAGE}' is not part of this workspace."
  echo "Default package is '${DEFAULT_PACKAGE}'."
  exit 1
fi

if [[ "${NO_GIT_CHECKS}" != "1" ]]; then
  if [[ -n "$(git status --porcelain)" ]]; then
    echo "Working tree is not clean."
    echo "Set NO_GIT_CHECKS=1 to bypass this check."
    exit 1
  fi
fi

pnpm config set git-checks false --location project >/dev/null

SLUG="$(echo "${SUMMARY}" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')"
[[ -z "${SLUG}" ]] && SLUG="release"
CHANGESET_FILE=".changeset/${SLUG}-$(date +%s).md"

cat > "${CHANGESET_FILE}" <<CS
---
"${PACKAGE}": ${BUMP}
---

${SUMMARY}
CS

echo "Created changeset: ${CHANGESET_FILE}"

echo "1) Versioning packages from changesets..."
pnpm changeset version

echo "2) Installing lockfile updates..."
pnpm install --frozen-lockfile=false

echo "3) Building publishable package..."
pnpm --dir packages/chakra build

echo "4) Publishing with changesets..."
pnpm changeset publish

echo "Release flow complete."
