#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
echo "AMI Etsy Ops v0.1 — standalone setup"
if ! command -v corepack >/dev/null 2>&1; then echo "Node/Corepack is required."; exit 1; fi
if [ ! -f .env.local ]; then cp .env.example .env.local; echo "Created .env.local from template."; fi
corepack pnpm install
corepack pnpm build
echo "✅ AMI Etsy Ops v0.1 production build passed."
echo "Next: configure .env.local + Supabase, then deploy this folder as a NEW Vercel project."
read -r -p "Press Enter to close..." _
