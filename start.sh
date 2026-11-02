#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║          🔍 SonarQube + MCP Setup                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Verificar Docker
echo -e "${YELLOW}[1/4] Verificando Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker encontrado${NC}\n"

# Verificar sonar-scanner
echo -e "${YELLOW}[2/4] Verificando sonar-scanner...${NC}"
if ! command -v sonar-scanner &> /dev/null; then
    echo -e "${RED}❌ sonar-scanner no está instalado${NC}"
    echo -e "${YELLOW}Instálalo con: brew install sonar-scanner${NC}"
    exit 1
fi
echo -e "${GREEN}✅ sonar-scanner encontrado${NC}"
sonar-scanner --version
echo ""

# Iniciar SonarQube
echo -e "${YELLOW}[3/4] Iniciando SonarQube con Docker...${NC}"
cd "$SCRIPT_DIR"
docker-compose up -d
echo -e "${GREEN}✅ SonarQube iniciado${NC}\n"

# Esperar a que SonarQube esté listo
echo -e "${YELLOW}[4/4] Esperando a que SonarQube esté disponible...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:9000/api/system/health | grep -q '"status":"UP"'; then
        echo -e "${GREEN}✅ SonarQube está lista${NC}\n"
        break
    fi
    echo -n "."
    sleep 2
done

# Iniciar MCP
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Iniciando MCP Server...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

cd "$SCRIPT_DIR/mcp"
export SONARQUBE_HOST="http://localhost:9000"
export MCP_PORT=3001

node src/server.js
