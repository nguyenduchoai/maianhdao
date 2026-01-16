#!/bin/bash

# ==============================================================================
# 🔄 BIZINO AI DEV v3.0 - Universal Auto-Update
# ==============================================================================
# Automatically pull latest changes and update your selected platform
# Version: 3.0.0
# ==============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Configuration
REPO_URL="https://github.com/bizino/Bizino-Dev_Kit.git"
BIZINO_HOME="$HOME/.bizino-dev-kit"
CACHE_DIR="$BIZINO_HOME/cache"
CONFIG_FILE="$BIZINO_HOME/config"

# Global directories for each platform
GEMINI_GLOBAL_WORKFLOWS="$HOME/.gemini/antigravity/global_workflows"
CLAUDE_GLOBAL_COMMANDS="$HOME/.claude/commands"
CLAUDE_GLOBAL_CONFIG="$HOME/.claude"
VSCODE_GLOBAL_DIR="$HOME/.vscode-copilot/workflows"

# Embedded token (base64 encoded)
_ENCODED_TOKEN="Z2hwX0s2emx5UWRaYVo2aGdFT3VGcGxMaW9ZVGdLeDhCUDNXQ1Nhawo="
_EMBEDDED_TOKEN=$(echo "$_ENCODED_TOKEN" | base64 -d 2>/dev/null | tr -d '\n' || echo "")

# ==============================================================================
# Functions
# ==============================================================================

show_header() {
    clear
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════════════╗"
    echo "║   🔄 BIZINO AI DEV v3.0 - Auto Update                             ║"
    echo "╚═══════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
}

check_git() {
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ Git is not installed. Please install git first.${NC}"
        exit 1
    fi
}

get_token() {
    if [ -n "$_EMBEDDED_TOKEN" ]; then
        GITHUB_TOKEN="$_EMBEDDED_TOKEN"
        return 0
    fi
    return 1
}

load_config() {
    if [ -f "$CONFIG_FILE" ]; then
        source "$CONFIG_FILE"
        if [ -n "$PLATFORM" ]; then
            return 0
        fi
    fi
    return 1
}

clone_or_update_repo() {
    echo -e "${MAGENTA}[1/3] Fetching latest version...${NC}"
    
    # Construct authenticated URL
    if [ -n "$GITHUB_TOKEN" ]; then
        AUTH_URL="https://${GITHUB_TOKEN}@github.com/bizino/Bizino-Dev_Kit.git"
    else
        AUTH_URL="$REPO_URL"
    fi
    
    mkdir -p "$CACHE_DIR"
    
    if [ -d "$CACHE_DIR/.git" ]; then
        cd "$CACHE_DIR"
        git remote set-url origin "$AUTH_URL" 2>/dev/null || true
        git fetch origin main --quiet 2>/dev/null
        
        LOCAL=$(git rev-parse HEAD 2>/dev/null)
        REMOTE=$(git rev-parse origin/main 2>/dev/null)
        
        if [ "$LOCAL" = "$REMOTE" ]; then
            echo -e "${GREEN}  ✓ Already up to date!${NC}"
        else
            echo -e "${YELLOW}  ↓ New version available, updating...${NC}"
            git reset --hard origin/main --quiet
            echo -e "${GREEN}  ✓ Updated to latest version${NC}"
        fi
    else
        echo -e "${YELLOW}  ↓ First time setup, cloning repository...${NC}"
        rm -rf "$CACHE_DIR"
        git clone --depth 1 "$AUTH_URL" "$CACHE_DIR" --quiet 2>/dev/null
        if [ $? -ne 0 ]; then
            echo -e "${RED}  ✗ Clone failed. Check your internet connection.${NC}"
            exit 1
        fi
        echo -e "${GREEN}  ✓ Repository cloned${NC}"
    fi
    
    cd "$CACHE_DIR"
    CURRENT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    CURRENT_DATE=$(git log -1 --format=%ci 2>/dev/null | cut -d' ' -f1 || echo "unknown")
    echo -e "${CYAN}  Version: ${WHITE}$CURRENT_COMMIT${CYAN} ($CURRENT_DATE)${NC}"
    echo ""
}

update_platform() {
    local PLATFORM=$1
    
    case $PLATFORM in
        "antigravity")
            echo -e "${CYAN}  → Antigravity / Gemini${NC}"
            SOURCE_DIR="$CACHE_DIR/antigravity/.agent/workflows"
            GLOBAL_DIR="$GEMINI_GLOBAL_WORKFLOWS"
            ;;
        "claudekit")
            echo -e "${CYAN}  → Claude Code${NC}"
            SOURCE_DIR="$CACHE_DIR/claudekit/.claude/workflows"
            GLOBAL_DIR="$CLAUDE_GLOBAL_COMMANDS"
            # Also update global CLAUDE.md
            mkdir -p "$CLAUDE_GLOBAL_CONFIG"
            cp "$CACHE_DIR/claudekit/CLAUDE.md" "$CLAUDE_GLOBAL_CONFIG/CLAUDE.md" 2>/dev/null || true
            ;;
        "vscode-copilot")
            echo -e "${CYAN}  → VS Code Copilot${NC}"
            SOURCE_DIR="$CACHE_DIR/vscode-copilot/.agent/workflows"
            GLOBAL_DIR="$VSCODE_GLOBAL_DIR"
            ;;
    esac
    
    if [ -n "$GLOBAL_DIR" ] && [ -d "$SOURCE_DIR" ]; then
        mkdir -p "$GLOBAL_DIR"
        cp "$SOURCE_DIR/"*.md "$GLOBAL_DIR/" 2>/dev/null || true
        WORKFLOW_COUNT=$(ls "$GLOBAL_DIR/"*.md 2>/dev/null | wc -l | tr -d ' ')
        echo -e "${GREEN}     ✓ $WORKFLOW_COUNT items → $GLOBAL_DIR${NC}"
    fi
}

# ==============================================================================
# Main
# ==============================================================================

show_header
check_git

# Get token
if get_token; then
    echo -e "${GREEN}✓ Authentication ready${NC}"
else
    echo -e "${YELLOW}⚠️ Using public access${NC}"
fi
echo ""

# Clone/Update repository
clone_or_update_repo

# ==============================================================================
# Load saved platform or ask
# ==============================================================================
echo -e "${MAGENTA}[2/3] Checking configuration...${NC}"

if load_config; then
    echo -e "${GREEN}  ✓ Found saved platform: ${WHITE}$PLATFORM${NC}"
    
    case $PLATFORM in
        "antigravity") PLATFORMS=("antigravity") ;;
        "claudekit") PLATFORMS=("claudekit") ;;
        "vscode-copilot") PLATFORMS=("vscode-copilot") ;;
        "all") PLATFORMS=("antigravity" "claudekit" "vscode-copilot") ;;
        *)
            echo -e "${RED}  ✗ Unknown platform: $PLATFORM${NC}"
            exit 1
            ;;
    esac
else
    echo -e "${YELLOW}  ⚠ No saved configuration found.${NC}"
    echo -e "${YELLOW}  Please run install.sh first to select your platform.${NC}"
    echo ""
    echo -e "${WHITE}  Or choose now:${NC}"
    echo ""
    echo -e "  ${GREEN}1)${NC} ⚡ Antigravity / Gemini"
    echo -e "  ${GREEN}2)${NC} 🤖 Claude Code"
    echo -e "  ${GREEN}3)${NC} 💻 VS Code Copilot"
    echo -e "  ${GREEN}4)${NC} 🎯 All Platforms"
    echo ""
    read -p "$(echo -e ${YELLOW}Chọn [1-4]: ${NC})" PLATFORM_CHOICE
    
    case $PLATFORM_CHOICE in
        1) 
            PLATFORMS=("antigravity")
            PLATFORM="antigravity"
            ;;
        2) 
            PLATFORMS=("claudekit")
            PLATFORM="claudekit"
            ;;
        3) 
            PLATFORMS=("vscode-copilot")
            PLATFORM="vscode-copilot"
            ;;
        4) 
            PLATFORMS=("antigravity" "claudekit" "vscode-copilot")
            PLATFORM="all"
            ;;
        *)
            echo -e "${RED}Invalid option. Exiting.${NC}"
            exit 1
            ;;
    esac
    
    # Save the choice
    mkdir -p "$BIZINO_HOME"
    echo "PLATFORM=$PLATFORM" > "$CONFIG_FILE"
    echo "INSTALLED_DATE=$(date +%Y-%m-%d)" >> "$CONFIG_FILE"
    echo -e "${GREEN}  ✓ Platform saved for future updates${NC}"
fi

echo ""
echo -e "${MAGENTA}[3/3] Updating Global Workflows...${NC}"

for PLATFORM in "${PLATFORMS[@]}"; do
    update_platform "$PLATFORM"
done

# Update the update script itself
cp "$CACHE_DIR/update.sh" "$BIZINO_HOME/update.sh" 2>/dev/null || true
chmod +x "$BIZINO_HOME/update.sh" 2>/dev/null || true

echo ""

# ==============================================================================
# Summary
# ==============================================================================
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║      ✅ UPDATE COMPLETE!                                          ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${WHITE}📦 Updated Platforms:${NC}"
for P in "${PLATFORMS[@]}"; do
    echo -e "   ${GREEN}✓${NC} $P"
done
echo ""

echo -e "${WHITE}📊 Version:${NC}"
echo -e "   ${CYAN}$CURRENT_COMMIT ($CURRENT_DATE)${NC}"
echo ""

echo -e "${WHITE}💡 Next update:${NC}"
echo -e "   ${CYAN}~/.bizino-dev-kit/update.sh${NC}"
echo -e "   ${CYAN}(Your platform choice is saved, no need to select again!)${NC}"
echo ""

echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${WHITE}  Bizino AI DEV v3.0 - Premium Software Development, Automated${NC}"
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
