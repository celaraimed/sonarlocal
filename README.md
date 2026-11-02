# 🔍 SonarQube + MCP Setup

Una configuración completa de **SonarQube en Docker** + **MCP Server** para OpenCode que permite analizar dinámicamente cualquier proyecto.

## 📁 Estructura

```
sonarqube/
├── docker-compose.yml          # Configuración Docker de SonarQube
├── start.sh                     # Script para iniciar todo
├── stop.sh                      # Script para detener todo
├── mcp/
│   ├── src/
│   │   └── server.js           # Servidor MCP Node.js
│   ├── package.json            # Dependencias MCP
│   └── templates/              # (para futuras plantillas)
├── docker-config/              # (para config de SonarQube si es necesaria)
├── examples/                   # Scripts de ejemplo para usar el MCP
└── docs/                       # Documentación

```

## ⚡ Quick Start

### 1. Verificar requisitos

```bash
# Docker
docker --version

# sonar-scanner (si no lo tienes, instálalo)
brew install sonar-scanner
```

### 2. Iniciar todo

```bash
cd ~/Desktop/sonarqube
chmod +x start.sh
./start.sh
```

Esto:
- ✅ Inicia SonarQube en Docker (puerto 9000)
- ✅ Inicia el MCP Server (puerto 3001)
- ⏳ Espera a que SonarQube esté listo (~40 segundos)

### 3. Acceder a SonarQube

```
http://localhost:9000
```

**Credenciales default:**
- Usuario: `admin`
- Password: `admin`

## 🚀 Uso del MCP

### Opción A: Escanear con Perfil Preconfigurado

```bash
# Backend
cd ~/Desktop/sonarqube/examples
bash scan-backend.sh

# Frontend
bash scan-frontend.sh
```

**Perfiles disponibles:**
- `backend`: Go code (sources: src, internal, cmd)
- `frontend`: JavaScript/React (sources: src, pages, components)

### Opción B: Escaneo Dinámico (Cualquier Proyecto)

```bash
curl -X POST http://localhost:3001/scan-dynamic \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/ruta/a/tu/proyecto",
    "projectKey": "mi-proyecto",
    "projectName": "Mi Proyecto",
    "sources": ["src", "lib"],
    "exclusions": ["**/*_test.go", "**/vendor/**"],
    "language": "go"
  }'
```

Respuesta:
```json
{
  "success": true,
  "message": "✅ Escaneo dinámico completado: Mi Proyecto",
  "projectKey": "mi-proyecto",
  "sonarqubeUrl": "http://localhost:9000/dashboard?id=mi-proyecto"
}
```

## 📡 Endpoints del MCP

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | `/health` | Estado del MCP + SonarQube |
| GET    | `/profiles` | Lista de perfiles preconfigurados |
| POST   | `/scan` | Escanear con perfil preconfigurado |
| POST   | `/scan-dynamic` | Escanear con configuración personalizada |

## 🔧 Variables de Entorno

En `start.sh` puedes personalizar:

```bash
export SONARQUBE_HOST="http://localhost:9000"      # Host de SonarQube
export MCP_PORT=3001                               # Puerto del MCP
export SONARQUBE_TOKEN=""                          # Token API (opcional)
```

## 🛑 Detener todo

```bash
cd ~/Desktop/sonarqube
bash stop.sh
```

## 📊 Ver resultados

Después de escanear, accede a:

```
http://localhost:9000/dashboard?id=TU_PROJECT_KEY
```

Ejemplos:
- Backend: `http://localhost:9000/dashboard?id=imed-portal-reportes-backend`
- Frontend: `http://localhost:9000/dashboard?id=imed-portal-reportes-frontend`

## 🔑 Agregar Token API (Opcional)

1. Ve a SonarQube → Admin → Security → Tokens
2. Genera un token
3. Edita `start.sh` y agrega:

```bash
export SONARQUBE_TOKEN="tu_token_aqui"
```

O crea un archivo `.env` en la raíz:

```
SONARQUBE_HOST=http://localhost:9000
SONARQUBE_TOKEN=tu_token_aqui
MCP_PORT=3001
```

## 🐛 Troubleshooting

### SonarQube no inicia
```bash
# Ver logs
docker logs sonarqube

# Reiniciar
docker-compose restart
```

### sonar-scanner no funciona
```bash
# Verificar instalación
sonar-scanner --version

# Reinstalar
brew uninstall sonar-scanner
brew install sonar-scanner
```

### MCP no responde
```bash
# Verificar estado
curl -s http://localhost:3001/health | jq

# Ver logs en la terminal donde corre start.sh
```

### Puerto 9000 ocupado
```bash
# Ver qué usa el puerto
lsof -i :9000

# Cambiar puerto en docker-compose.yml
# Cambiar: "9000:9000" por "9001:9000"
```

## 📚 Integración con OpenCode

Para usar el MCP desde OpenCode, edita `~/.config/opencode/opencode.json`:

```json
{
  "mcp": {
    "servers": {
      "sonarqube": {
        "command": "node",
        "args": ["/Users/celara/Desktop/sonarqube/mcp/src/server.js"],
        "env": {
          "SONARQUBE_HOST": "http://localhost:9000",
          "SONARQUBE_TOKEN": ""
        }
      }
    }
  }
}
```

## 🎯 Próximos Pasos

- [ ] Agregar soporte para más lenguajes (Python, Java, C#)
- [ ] Crear skill para OpenCode que integre SonarQube
- [ ] Webhook para escaneos automáticos en PRs
- [ ] Migrar a PostgreSQL para producción

## 📞 Soporte

Para problemas:
1. Revisa los logs: `docker logs -f sonarqube`
2. Verifica conectividad: `curl http://localhost:9000`
3. Comprueba permisos de archivos: `chmod +x *.sh`

---

**Creado**: 2026-07-08
**Estado**: Ready for use ✅
