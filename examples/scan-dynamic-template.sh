#!/bin/bash
# Escaneo dinámico - especifica cualquier proyecto, fuentes y exclusiones

curl -X POST http://localhost:3001/scan-dynamic \
  -H "Content-Type: application/json" \
  -d '{
    "projectPath": "/ruta/a/tu/proyecto",
    "projectKey": "my-custom-project",
    "projectName": "Mi Proyecto Custom",
    "sources": ["src", "lib"],
    "exclusions": ["**/*test.go", "**/vendor/**"],
    "language": "go"
  }' | jq .
