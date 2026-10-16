#!/usr/bin/env bash
# Automated tests for Modasr Hubot Bilingual Installer & Deployment Manager

echo "=== RUNNING MODASR HUBOT INSTALLER TEST SUITE ==="

if bash -n install.sh; then
  echo "[PASS] install.sh syntax check passed"
else
  echo "[FAIL] install.sh syntax check failed"
  exit 1
fi

if [ -f "locales/fa.sh" ] && [ -f "locales/en.sh" ]; then
  echo "[PASS] Bilingual locale files exist"
else
  echo "[FAIL] Locale files missing"
  exit 1
fi

if bash install.sh --status > /dev/null 2>&1; then
  echo "[PASS] install.sh --status executed successfully"
else
  echo "[FAIL] install.sh --status failed"
  exit 1
fi

for doc in README.md README_FA.md INSTALL_GUIDE_FA.md INSTALL_GUIDE_EN.md; do
  if [ -f "$doc" ]; then
    echo "[PASS] Documentation file $doc exists"
  else
    echo "[FAIL] Documentation file $doc missing"
    exit 1
  fi
done

echo "=== ALL INSTALLER TESTS PASSED SUCCESSFULLY ==="
