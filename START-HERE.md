# 🚀 START HERE - SonarQube + MCP Setup

**¡Bienvenido! Tu setup está 100% listo. Comienza aquí.**

## ⚡ Inicio Rápido (2 minutos)

### Paso 1: Requisitos (verifica esto primero)

```bash
# Abre Terminal y ejecuta:
docker --version          # Necesitas Docker
sonar-scanner --version   # Necesitas sonar-scanner
node --version            # Necesitas Node.js 14+
```

**¿No tienes algo?**
- Docker: https://www.docker.com/products/docker-desktop
- sonar-scanner: `brew install sonar-scanner`
- Node.js: https://nodejs.org (14+)

### Paso 2: Inicia todo (comando único)

```bash
cd ~/Desktop/sonarqube
./start.sh
```

**Espera ~40 segundos** mientras SonarQube se levanta. Verás output en la terminal.

### Paso 3: Accede a SonarQube

```
http://localhost:9000
Usuario: admin
Password: admin
```

### Paso 4: Escanea tu primer proyecto (en OTRA terminal)

```bash
cd ~/Desktop/sonarqube/examples
bash scan-backend.sh
```

### Paso 5: Ver resultados

```
http://localhost:9000/dashboard?id=imed-portal-reportes-backend
```

**¡Listo!** 🎉

---

## 📚 Documentación (en orden de lectura)

1. **README.md** - Guía completa
2. **QUICK-REFERENCE.md** - Comandos rápidos
3. **HELP.txt** - Ayuda y troubleshooting
4. **ADVANCED.md** - Config avanzada
5. **SETUP-CHECKLIST.md** - Verificación detallada

---

## 🎯 Lo que tienes

### ✅ SonarQube
- Versión: 10.3-community
- Puerto: 9000
- Base de datos: H2 embedded (persiste datos)
- Dashboard: análisis de código en tiempo real

### ✅ MCP Server
- Puerto: 3001
- Lenguaje: Node.js (sin dependencias, nativo)
- Dos modos:
  1. **Perfiles preconfigurados** (backend Go, frontend JS)
  2. **Dinámico** (cualquier proyecto/PATH)

### ✅ Ejemplos listos
- scan-backend.sh - Escanear proyectos Go
- scan-frontend.sh - Escanear proyectos JavaScript
- scan-dynamic-template.sh - Plantilla para personalizar
- list-profiles.sh - Ver perfiles disponibles
- health-check.sh - Verificar estado

### ✅ Automatización
- start.sh - Inicia todo con un comando
- stop.sh - Detiene todo limpiamente
- status.sh - Verifica estado de todo

---

## 🔗 URLs principales

| Componente | URL | Notas |
|-----------|-----|-------|
| SonarQube UI | http://localhost:9000 | admin/admin |
| MCP Health | http://localhost:3001/health | API status |
| MCP Profiles | http://localhost:3001/profiles | Listar perfiles |

---

## 🚀 Casos de uso comunes

### "Quiero analizar mi proyecto Go"
```bash
cd ~/Desktop/sonarqube/examples
bash scan-backend.sh
```

### "Quiero analizar mi proyecto JavaScript"
```bash
cd ~/Desktop/sonarqube/examples
bash scan-frontend.sh
```

### "Quiero analizar cualquier proyecto"
```bash
curl -X POST http://localhost:3001/scan-dynamic \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/ruta/a/tu/proyecto",
    "projectKey": "my-project",
    "projectName": "My Project",
    "sources": ["src"],
    "language": "go"
  }'
```

### "Quiero ver mis perfiles"
```bash
curl http://localhost:3001/profiles
```

### "Quiero agregar un nuevo perfil"

1. Edita: `~/Desktop/sonarqube/mcp/src/server.js`
2. Busca: `const PROFILES = {`
3. Agrega:
```javascript
'mi-app': {
  projectKey: 'mi-app-key',
  projectName: 'Mi App',
  sources: ['src', 'lib'],
  exclusions: ['**/*.test.js'],
  language: 'js',
}
```
4. Guarda y reinicia: `Ctrl+C` luego `./start.sh`

---

## ❓ Preguntas frecuentes

**P: ¿Puedo analizar cualquier proyecto?**  
R: Sí. Usa `/scan-dynamic` con la ruta del proyecto que quieras.

**P: ¿Los datos persisten?**  
R: Sí. SonarQube usa Docker volumes que persisten entre reinicios.

**P: ¿Puedo usar tokens de autenticación?**  
R: Sí. Edita `start.sh` y agrega `export SONARQUBE_TOKEN="..."`

**P: ¿Cuánto espacio ocupa?**  
R: ~88 KB locales + ~500 MB de Docker images. Minimal.

**P: ¿Funciona sin internet?**  
R: Sí, es completamente local. Necesitas internet solo para descargar Docker image la primera vez.

---

## 🆘 Troubleshooting rápido

**❌ "Connection refused" en localhost:9000**
```bash
# Verifica que SonarQube está corriendo
docker ps | grep sonarqube

# Si no está, inicia
./start.sh
```

**❌ "sonar-scanner: command not found"**
```bash
brew install sonar-scanner
sonar-scanner --version
```

**❌ "Port 9000 already in use"**
```bash
lsof -i :9000
kill -9 <PID>
# O cambiar puerto en docker-compose.yml
```

**❌ MCP no responde**
```bash
curl http://localhost:3001/health
# Si no funciona, revisa logs en la terminal de start.sh
```

---

## 🎓 Próximos pasos (recomendado)

1. ✅ Ejecuta `./start.sh`
2. ✅ Abre http://localhost:9000
3. ✅ Ejecuta `bash examples/scan-backend.sh`
4. ✅ Ve los resultados en SonarQube
5. ✅ Lee ADVANCED.md para personalización
6. ✅ Integra con OpenCode (opcional)

---

## 📖 Documentación completa

Todo está en `~/Desktop/sonarqube/`:

```
├── README.md           ← Guía completa
├── QUICK-REFERENCE.md  ← Comandos rápidos
├── HELP.txt            ← Ayuda y FAQ
├── ADVANCED.md         ← Config avanzada
├── SETUP-CHECKLIST.md  ← Verificación
└── START-HERE.md       ← Este archivo
```

---

## 🔥 El momento ha llegado

```bash
cd ~/Desktop/sonarqube
./start.sh
```

**Luego abre:** http://localhost:9000

**¡Disfruta!** 🎉

---

**Dudas?** Consulta README.md o HELP.txt

Última actualización: 2026-07-08
