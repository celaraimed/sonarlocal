#!/bin/bash
# Escanear con perfil preconfigurado (frontend)

curl -X POST http://localhost:3001/scan \
  -H "Content-Type: application/json" \
  -d '{
    "profile": "frontend",
    "projectPath": "/Users/celara/reportes/frontend"
  }' | jq .
