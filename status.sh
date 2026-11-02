#!/bin/bash

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║          🔍 SonarQube + MCP Status Check                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Check Docker
echo -e "${YELLOW}[1/5] Docker${NC}"
if docker ps | grep -q sonarqube; then
    echo -e "${GREEN}✅ SonarQube container está corriendo${NC}"
else
    echo -e "${RED}❌ SonarQube container no está corriendo${NC}"
fi

# Check SonarQube API
echo -e "\n${YELLOW}[2/5] SonarQube API${NC}"
if curl -s http://localhost:9000/api/system/health | grep -q '"status":"UP"'; then
    echo -e "${GREEN}✅ SonarQube está disponible${NC}"
else
    echo -e "${RED}❌ SonarQube no responde${NC}"
fi

# Check MCP Health
echo -e "\n${YELLOW}[3/5] MCP Server${NC}"
if curl -s http://localhost:3001/health | grep -q '"status":"ok"'; then
    echo -e "${GREEN}✅ MCP está disponible${NC}"
else
    echo -e "${RED}❌ MCP no responde${NC}"
fi

# Check sonar-scanner
echo -e "\n${YELLOW}[4/5] sonar-scanner${NC}"
if command -v sonar-scanner &> /dev/null; then
    VERSION=$(sonar-scanner --version | head -1)
    echo -e "${GREEN}✅ sonar-scanner instalado: $VERSION${NC}"
else
    echo -e "${RED}❌ sonar-scanner no está instalado${NC}"
fi

# Check Profiles
echo -e "\n${YELLOW}[5/5] Perfiles disponibles${NC}"
PROFILES=$(curl -s http://localhost:3001/profiles | jq -r '.profiles[].name' 2>/dev/null)
if [ ! -z "$PROFILES" ]; then
    echo -e "${GREEN}✅ Perfiles encontrados:${NC}"
    echo "$PROFILES" | sed 's/^/   /'
else
    echo -e "${RED}❌ No se pudieron obtener los perfiles${NC}"
fi

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}URLs útiles:${NC}"
echo -e "   🌐 SonarQube:  ${GREEN}http://localhost:9000${NC}"
echo -e "   📡 MCP:        ${GREEN}http://localhost:3001${NC}"
echo -e "   🏥 Health:     ${GREEN}http://localhost:3001/health${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
