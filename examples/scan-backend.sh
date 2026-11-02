#!/bin/bash
# Escanear con perfil preconfigurado (backend)

curl -X POST http://localhost:3001/scan \
  -H "Content-Type: application/json" \
  -d '{
    "profile": "backend",
    "projectPath": "/Users/celara/reportes/backend"
  }' | jq .
