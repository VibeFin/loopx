#!/usr/bin/env bash
# Capture desktop and mobile screenshots of the running preview.
# Reads CAPTURE_URL and CAPTURE_DIR, leaves the app server running.
set -euo pipefail
cd "$(dirname "$0")"
/usr/bin/time -p test -n "${CAPTURE_URL:?Set CAPTURE_URL to the preview URL.}"
/usr/bin/time -p test -n "${CAPTURE_DIR:?Set CAPTURE_DIR to the screenshot output directory.}"
/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
/usr/bin/time -p node "${RUNTIME_DIR:?Set RUNTIME_DIR to the runtime scripts directory.}/scripts/default-capture.mjs"
