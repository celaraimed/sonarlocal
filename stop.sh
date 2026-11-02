#!/bin/bash

BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║          🛑 Deteniendo SonarQube + MCP                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

docker-compose down
echo -e "${GREEN}✅ SonarQube detenido${NC}\n"

echo -e "${GREEN}✅ Todos los servicios cerrados${NC}"
