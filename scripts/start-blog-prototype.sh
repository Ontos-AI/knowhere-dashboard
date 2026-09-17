#!/usr/bin/env bash
# Start the knowhere-landing blog prototype with this repo's pnpm 10.
# Does not use apps/blog's packageManager pnpm@12.0.0, and does not install
# into this dashboard's node_modules.
set -euo pipefail

script_dir=$(cd "$(dirname "$0")" && pwd)
dashboard=$(cd "$script_dir/.." && pwd)
landing=${KNOWHERE_LANDING:-"$dashboard/../knowhere-landing"}
blog="$landing/apps/blog"
port=${BLOG_PROTO_PORT:-3002}

if [[ ! -f "$blog/package.json" ]]; then
  echo "Blog prototype not found at $blog" >&2
  echo "Set KNOWHERE_LANDING to the knowhere-landing checkout." >&2
  exit 1
fi

# Corepack would otherwise download the broken pnpm 12 shim from packageManager.
export COREPACK_ENABLE_AUTO_PIN=0
export COREPACK_ENABLE_STRICT=0
export npm_config_ignore_workspace=true

cd "$dashboard"
pnpm_args=(
  --dir "$blog"
  --ignore-workspace
  --config.manage-package-manager-versions=false
  --config.package-manager-strict=false
  --config.package-manager-strict-version=false
)

# Prefer vite preview so we do not hit OS file-watch limits.
if [[ ! -d "$blog/node_modules" ]]; then
  pnpm "${pnpm_args[@]}" install
fi

if [[ ! -d "$blog/dist" && ! -d "$blog/.output" && ! -d "$blog/build" ]]; then
  pnpm "${pnpm_args[@]}" run build
fi

echo "Blog prototype on http://127.0.0.1:${port}"
if pnpm "${pnpm_args[@]}" exec vite preview --help >/dev/null 2>&1; then
  exec pnpm "${pnpm_args[@]}" exec vite preview --host 127.0.0.1 --port "$port"
fi
exec pnpm "${pnpm_args[@]}" exec vite --host 127.0.0.1 --port "$port"
