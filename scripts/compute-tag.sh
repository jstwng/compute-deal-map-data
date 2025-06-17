#!/usr/bin/env bash
set -euo pipefail

today=$(date -u +%Y.%m.%d)
existing=$(git tag --list "${today}*" | wc -l | tr -d ' ')

if [ "$existing" = "0" ]; then
  echo "$today"
else
  echo "${today}-${existing}"
fi
