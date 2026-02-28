#!/bin/bash
# Test script to verify pg package is included in Next.js standalone output

echo "🔍 Checking if 'pg' package will be included in standalone output..."
echo ""

# Build Next.js
echo "📦 Building Next.js in standalone mode..."
pnpm build

if [ ! -d ".next/standalone" ]; then
  echo "❌ Standalone output not found!"
  exit 1
fi

echo "✅ Standalone output created"
echo ""

# Check if pg package exists
echo "🔎 Checking for 'pg' package in standalone output..."
if [ -d ".next/standalone/node_modules/pg" ]; then
  echo "✅ 'pg' package found in standalone output!"
  echo "   Location: .next/standalone/node_modules/pg"
  ls -la .next/standalone/node_modules/pg | head -10
else
  echo "❌ 'pg' package NOT found in standalone output!"
  echo ""
  echo "Available packages:"
  ls .next/standalone/node_modules/ | head -20
  exit 1
fi

echo ""
echo "🎉 Verification successful! The migration script should work."
