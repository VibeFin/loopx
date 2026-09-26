#!/usr/bin/env bash
# LoopX static preview: serve the built static directory in the foreground.
# Writes deployment-output.json, then serves index.html on PORT (default 3000).
set -euo pipefail
cd "$(dirname "$0")"
/usr/bin/time -p test -f index.html
/usr/bin/time -p node --check scripts/serve-preview.mjs
web_dir="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
/usr/bin/time -p mkdir -p "$web_dir"
PROJECT_ROOT="$PWD" DEPLOY_DIR="$web_dir" /usr/bin/time -p node -e 'const { writeFileSync } = require("node:fs"); const { resolve } = require("node:path"); const project = resolve(process.env.PROJECT_ROOT); const payload = { project, directory: project }; writeFileSync(process.env.DEPLOY_DIR + "/deployment-output.json", JSON.stringify(payload) + "\n");'
# Static single-file preview: no dependencies to install and no build step.
exec /usr/bin/time -p node scripts/serve-preview.mjs
