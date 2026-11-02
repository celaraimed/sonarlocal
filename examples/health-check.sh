#!/bin/bash
# Verificar estado del MCP

curl -s http://localhost:3001/health | jq .
