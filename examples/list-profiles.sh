#!/bin/bash
# Ver perfiles disponibles

curl -s http://localhost:3001/profiles | jq .
