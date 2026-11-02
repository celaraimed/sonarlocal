# ✅ Setup Checklist

Usa esta lista para verificar que todo esté funcionando correctamente.

## 🔧 Pre-requisitos

- [ ] Docker instalado (`docker --version`)
- [ ] Node.js 14+ instalado (`node --version`)
- [ ] sonar-scanner instalado (`sonar-scanner --version`)
  - Si no: `brew install sonar-scanner`

## 🚀 Primera Ejecución

- [ ] `cd ~/Desktop/sonarqube`
- [ ] `chmod +x start.sh stop.sh status.sh examples/*.sh`
- [ ] `./start.sh`
- [ ] Esperar ~40 segundos a que SonarQube esté listo
- [ ] Ver el output final del MCP Server

## 🌐 Verificar Conectividad

- [ ] http://localhost:9000 abre SonarQube UI
  - Usuario: `admin`
  - Password: `admin`
- [ ] http://localhost:3001/health retorna `{"status":"ok"}`
- [ ] http://localhost:3001/profiles retorna lista de perfiles

## 📊 Primer Escaneo

### Opción A: Con Perfil Preconfigurado
```bash
cd ~/Desktop/sonarqube/examples
bash scan-backend.sh
```

- [ ] El escaneo termina sin errores
- [ ] Se ve el dashboard en SonarQube

### Opción B: Escaneo Dinámico
```bash
curl -X POST http://localhost:3001/scan-dynamic \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/Users/celara/reportes",
    "projectKey": "test-project",
    "projectName": "Test Project",
    "sources": ["frontend", "backend"],
    "exclusions": [],
    "language": "go"
  }'
```

- [ ] Respuesta con `"success": true`
- [ ] URL del proyecto en la respuesta

## 🛑 Detención Correcta

- [ ] `./stop.sh` funciona sin errores
- [ ] Docker container se detiene: `docker ps | grep sonarqube` (vacío)

## 🔄 Reinicio

- [ ] `./start.sh` nuevamente inicia sin errores
- [ ] Datos persisten: los proyectos anteriores siguen en SonarQube

## 📋 Personalización (Opcional)

- [ ] Agregué un nuevo perfil a `mcp/src/server.js`
- [ ] El perfil aparece en `/profiles`
- [ ] Puedo escanear con el nuevo perfil

## 🔐 Token API (Opcional)

- [ ] Generé un token en SonarQube (Admin → Security → Tokens)
- [ ] Agregué el token a `start.sh`: `export SONARQUBE_TOKEN="..."`
- [ ] El MCP se inicia con token autenticado

## 📚 Documentación

- [ ] Leí README.md
- [ ] Consulté QUICK-REFERENCE.md para comandos rápidos
- [ ] Revisé ADVANCED.md para configuración avanzada

## 🐛 Troubleshooting

Si algo no funciona:

1. [ ] Ejecuté `./status.sh` para ver el estado general
2. [ ] Revisé logs: `docker logs -f sonarqube`
3. [ ] Probé: `curl http://localhost:3001/health`
4. [ ] Verifiqué que sonar-scanner está en PATH: `which sonar-scanner`
5. [ ] Consulté TROUBLESHOOTING en README.md

## ✨ Listo!

- [ ] Todo funciona
- [ ] Puedo escanear proyectos
- [ ] Veo resultados en SonarQube
- [ ] Tengo documentación clara

---

**Fecha de Setup**: _______________
**Versión de SonarQube**: 10.3-community
**Versión de MCP**: 1.0.0

