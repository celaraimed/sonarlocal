# Configuración Avanzada de SonarQube MCP

## Personalizar Perfiles

Para agregar más perfiles, edita `mcp/src/server.js` y busca la sección `PROFILES`:

```javascript
const PROFILES = {
  'tu-nuevo-perfil': {
    projectKey: 'mi-proyecto-key',
    projectName: 'Mi Proyecto',
    sources: ['src', 'lib'],
    exclusions: ['**/*test*', '**/node_modules/**'],
    language: 'java', // go, js, python, java, csharp, etc
  }
};
```

Luego reinicia el MCP: Ctrl+C y ejecuta `./start.sh`

## Lenguajes Soportados por SonarQube Community

- JavaScript
- TypeScript
- Python
- Go
- Java
- C#
- SQL
- HTML
- CSS/SCSS/LESS
- XML
- YAML

## Configuración de SonarQube en Docker

Si necesitas cambiar configuración de SonarQube:

1. Edita `docker-compose.yml`
2. Agrega variables de entorno bajo `environment:`

```yaml
environment:
  - SONAR_SCANNER_OPTS=-Xmx1024m
  - SONARQUBE_JDBC_URL=jdbc:h2:tcp://localhost:9092/sonarqube
```

3. Reinicia: `docker-compose restart sonarqube`

## Pasar Perfiles a OpenCode (via MCP)

Cuando OpenCode consulte `/profiles`, obtiene:

```json
{
  "profiles": [
    {
      "name": "backend",
      "projectKey": "imed-portal-reportes-backend",
      "projectName": "iMed Portal Reportes - Backend",
      "language": "go",
      "sources": ["src", "internal", "cmd"],
      "exclusions": ["**/*_test.go", "**/vendor/**"]
    }
  ]
}
```

OpenCode puede usar esto para:
- Mostrar perfiles disponibles
- Pre-llenar formularios
- Sugerir análisis basados en extensión de archivos

## Variables para Proyectos Dinámicos

```javascript
{
  "projectPath": "/ruta/proyecto",              // Requerido
  "projectKey": "unique-project-key",            // Requerido (sin espacios)
  "projectName": "Nombre Legible",               // Requerido
  "sources": ["src", "app"],                     // Array o string
  "exclusions": ["**/*test*"],                   // Array (opcional)
  "language": "go"                               // Opcional
}
```

## Integración con CI/CD

Para ejecutar desde GitHub Actions / GitLab CI:

```yaml
- name: SonarQube Scan
  run: |
    curl -X POST http://sonarqube-server:3001/scan-dynamic \
      -H "Content-Type: application/json" \
      -d '{
        "projectPath": "${{ github.workspace }}",
        "projectKey": "${{ github.repository }}",
        "projectName": "${{ github.event.repository.name }}",
        "sources": ["src"],
        "language": "go"
      }'
```

## Monitoreo y Logs

### Logs de SonarQube
```bash
docker logs -f sonarqube
docker logs --tail=100 sonarqube  # Últimas 100 líneas
```

### Logs del MCP
Los logs del MCP se muestran en la terminal donde ejecutaste `./start.sh`

## Backup de Datos

SonarQube almacena datos en volúmenes Docker. Para backup:

```bash
docker-compose exec sonarqube sh -c 'tar czf - /opt/sonarqube/data' > sonarqube-backup.tar.gz
```

Para restaurar:
```bash
docker-compose exec sonarqube sh -c 'tar xzf - -C /opt/sonarqube' < sonarqube-backup.tar.gz
```

---

Último actualizado: 2026-07-08
