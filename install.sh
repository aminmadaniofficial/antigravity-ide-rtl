#!/usr/bin/env bash
set -e

# Antigravity IDE RTL Installer Script
# Author: Amin Madani (https://aminmadani.xyz)

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}=== Antigravity IDE RTL Installer ===${NC}"

# Locate Antigravity IDE
POSSIBLE_PATHS=(
    "/opt/antigravity-ide/resources/app"
    "/usr/lib/antigravity-ide/resources/app"
    "/usr/share/antigravity-ide/resources/app"
    "$HOME/.local/share/antigravity-ide/resources/app"
    "$HOME/.antigravity-ide/resources/app"
)

APP_PATH=""
for p in "${POSSIBLE_PATHS[@]}"; do
    if [ -d "$p/out/vs" ]; then
        APP_PATH="$p"
        break
    fi
done

if [ -z "$APP_PATH" ]; then
    echo -e "${RED}Error: Antigravity IDE installation not found in default paths.${NC}"
    echo -e "Please specify the app directory: ./install.sh /path/to/antigravity-ide/resources/app"
    exit 1
fi

echo -e "${CYAN}Found Antigravity IDE at: ${APP_PATH}${NC}"

WORKBENCH_DIR="$APP_PATH/out/vs/workbench"
HTML_FILE="$APP_PATH/out/vs/code/electron-browser/workbench/workbench.html"
CSS_FILE="$WORKBENCH_DIR/workbench.desktop.main.css"

# Check write access
if [ ! -w "$WORKBENCH_DIR" ] || [ ! -w "$HTML_FILE" ]; then
    echo -e "${YELLOW}Notice: Write permission required for $APP_PATH.${NC}"
    echo -e "Please re-run this script with sudo: ${CYAN}sudo ./install.sh${NC}"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASSETS_DIR="$SCRIPT_DIR/assets"

# If assets dir doesn't exist locally (e.g. piped via curl), download them
if [ ! -d "$ASSETS_DIR" ]; then
    TEMP_DIR=$(mktemp -d)
    echo -e "Downloading latest assets from GitHub..."
    curl -fsSL "https://raw.githubusercontent.com/aminmadaniofficial/antigravity-ide-rtl/main/assets/Vazirmatn-Variable.woff2" -o "$TEMP_DIR/Vazirmatn-Variable.woff2"
    curl -fsSL "https://raw.githubusercontent.com/aminmadaniofficial/antigravity-ide-rtl/main/assets/antigravity-chat-rtl.css" -o "$TEMP_DIR/antigravity-chat-rtl.css"
    curl -fsSL "https://raw.githubusercontent.com/aminmadaniofficial/antigravity-ide-rtl/main/assets/antigravity-chat-rtl.js" -o "$TEMP_DIR/antigravity-chat-rtl.js"
    ASSETS_DIR="$TEMP_DIR"
fi

# 1. Backups
[ ! -f "$HTML_FILE.bak" ] && cp "$HTML_FILE" "$HTML_FILE.bak"
[ ! -f "$CSS_FILE.bak" ] && cp "$CSS_FILE" "$CSS_FILE.bak"

# 2. Copy files
cp -f "$ASSETS_DIR/Vazirmatn-Variable.woff2" "$WORKBENCH_DIR/"
cp -f "$ASSETS_DIR/antigravity-chat-rtl.css" "$WORKBENCH_DIR/"
cp -f "$ASSETS_DIR/antigravity-chat-rtl.js" "$WORKBENCH_DIR/"

# 3. Patch workbench.html
if ! grep -q "antigravity-chat-rtl.css" "$HTML_FILE"; then
    sed -i '/workbench.desktop.main.css/a \	<link rel="stylesheet" href="../../../workbench/antigravity-chat-rtl.css">' "$HTML_FILE"
fi

if ! grep -q "antigravity-chat-rtl.js" "$HTML_FILE"; then
    sed -i '/workbench.js/a <script src="../../../workbench/antigravity-chat-rtl.js" type="module"></script>' "$HTML_FILE"
fi

# 4. Patch workbench.desktop.main.css
if ! grep -q "ANTIGRAVITY-IDE RTL" "$CSS_FILE"; then
    cat "$ASSETS_DIR/antigravity-chat-rtl.css" >> "$CSS_FILE"
fi

echo -e "${GREEN}✨ Antigravity IDE RTL patch successfully applied!${NC}"
echo -e "Reload your Antigravity IDE window (Ctrl+Shift+P -> Developer: Reload Window) to enjoy native RTL."
