#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

NO_GIT_CHECKS="${NO_GIT_CHECKS:-0}"

if [[ "${NO_GIT_CHECKS}" != "1" ]]; then
  if [[ -n "$(git status --porcelain)" ]]; then
    echo "Working tree is not clean."
    echo "Commit/stash changes, or run with NO_GIT_CHECKS=1."
    exit 1
  fi
fi

echo "1) Versioning packages from changesets..."
pnpm changeset version

echo "2) Installing lockfile updates..."
pnpm install --frozen-lockfile=false

echo "3) Building publishable package..."
pnpm --dir packages/chakra build

echo "4) Publishing with changesets..."
pnpm changeset publish

echo "Release flow complete."
