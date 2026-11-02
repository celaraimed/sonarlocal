# 🚀 Quick Reference - SonarQube + MCP

## 📋 Comandos Principales

```bash
# Inicio
cd ~/Desktop/sonarqube
./start.sh          # Inicia SonarQube + MCP

# Verificar estado
./status.sh

# Parar
./stop.sh

# Logs en vivo
docker logs -f sonarqube
```

## 🔗 URLs Rápidas

| Aplicación | URL | Usuario | Password |
|-----------|-----|---------|----------|
| SonarQube | http://localhost:9000 | admin | admin |
| MCP Health | http://localhost:3001/health | - | - |
| MCP Profiles | http://localhost:3001/profiles | - | - |

## 📊 Escanear Rápido

### Perfil Backend (Go)
```bash
cd ~/Desktop/sonarqube/examples
bash scan-backend.sh
```

### Perfil Frontend (JS/React)
```bash
cd ~/Desktop/sonarqube/examples
bash scan-frontend.sh
```

### Cualquier Proyecto (dinámico)
```bash
curl -X POST http://localhost:3001/scan-dynamic \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/ruta/proyecto",
    "projectKey": "mi-proyecto",
    "projectName": "Mi Proyecto",
    "sources": ["src"],
    "exclusions": [],
    "language": "go"
  }'
```

## 🔍 Ver Resultados

Después de escanear, accede a:
```
http://localhost:9000/dashboard?id=PROJECT_KEY
```

Ejemplos:
- Backend: `http://localhost:9000/dashboard?id=imed-portal-reportes-backend`
- Frontend: `http://localhost:9000/dashboard?id=imed-portal-reportes-frontend`

## 🛠️ Perfiles Disponibles

```bash
curl -s http://localhost:3001/profiles | jq
```

| Nombre | Key | Lenguaje | Carpetas |
|--------|-----|----------|----------|
| backend | imed-portal-reportes-backend | Go | src, internal, cmd |
| frontend | imed-portal-reportes-frontend | JS | src, pages, components |

## ⚙️ Personalizar Perfil

1. Edita: `~/Desktop/sonarqube/mcp/src/server.js`
2. Busca: `const PROFILES = {`
3. Agrega tu perfil:

```javascript
'mi-app': {
  projectKey: 'mi-app-key',
  projectName: 'Mi App',
  sources: ['src', 'app'],
  exclusions: ['**/*.test.js'],
  language: 'js',
}
```

4. Reinicia: `Ctrl+C` en la terminal de `start.sh`, luego `./start.sh`

## 🐛 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| "Connection refused" | Ejecuta `./start.sh` |
| Puerto 9000 ocupado | `lsof -i :9000` y `kill -9 <PID>` |
| sonar-scanner no existe | `brew install sonar-scanner` |
| Docker no corre | `docker --version` y reinicia Docker Desktop |
| MCP no responde | Verifica: `curl http://localhost:3001/health` |

## 📝 Variables de Escaneo Dinámico

```javascript
projectPath      // (obligatorio) Ruta al proyecto: "/ruta/proyecto"
projectKey       // (obligatorio) ID único: "mi-proyecto" (sin espacios)
projectName      // (obligatorio) Nombre legible: "Mi Proyecto"
sources          // (opcional) Carpetas a analizar: ["src", "lib"]
exclusions       // (opcional) Patrones a excluir: ["**/*test*", "**/vendor/**"]
language         // (opcional) Lenguaje: "go", "js", "java", etc
```

## 🔐 Agregar Token (Opcional)

1. SonarQube → Admin → Security → Tokens
2. Copiar token
3. Editar `start.sh`:

```bash
export SONARQUBE_TOKEN="tu_token_aqui"
```

4. Reiniciar

## 📚 Documentación Completa

- **README.md** - Guía completa
- **ADVANCED.md** - Configuración avanzada
- **docker-compose.yml** - Configuración Docker

---

**Estado**: ✅ Listo para usar
**Última actualización**: 2026-07-08
