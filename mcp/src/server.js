#!/usr/bin/env node

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const SONARQUBE_HOST = process.env.SONARQUBE_HOST || 'http://localhost:9000';
const SONARQUBE_TOKEN = process.env.SONARQUBE_TOKEN || '';

// Perfiles preconfigurados
const PROFILES = {
  'backend': {
    projectKey: 'imed-portal-reportes-backend',
    projectName: 'iMed Portal Reportes - Backend',
    sources: ['src', 'internal', 'cmd'],
    exclusions: ['**/*_test.go', '**/vendor/**'],
    language: 'go',
  },
  'frontend': {
    projectKey: 'imed-portal-reportes-frontend',
    projectName: 'iMed Portal Reportes - Frontend',
    sources: ['src', 'pages', 'components'],
    exclusions: ['**/node_modules/**', '**/*.test.js', '**/*.test.jsx'],
    language: 'js',
  }
};

// Construir comando sonar-scanner
function buildSonarCommand(profile, projectPath) {
  const args = [
    `-Dsonar.projectKey=${profile.projectKey}`,
    `-Dsonar.projectName=${profile.projectName}`,
    `-Dsonar.sources=${profile.sources.join(',')}`,
    `-Dsonar.host.url=${SONARQUBE_HOST}`,
    `-Dsonar.working.directory=${path.join(projectPath, '.sonar')}`,
  ];

  if (profile.exclusions.length > 0) {
    args.push(`-Dsonar.exclusions=${profile.exclusions.join(',')}`);
  }

  if (SONARQUBE_TOKEN) {
    args.push(`-Dsonar.login=${SONARQUBE_TOKEN}`);
  }

  return args;
}

// Ejecutar escaneo
function runScan(profile, projectPath) {
  return new Promise((resolve, reject) => {
    const args = buildSonarCommand(profile, projectPath);
    
    console.log(`\n📊 Iniciando escaneo: ${profile.projectName}`);
    console.log(`📁 Ruta: ${projectPath}`);
    console.log(`🔧 Comando: sonar-scanner ${args.join(' ')}\n`);

    const scanner = spawn('sonar-scanner', args, {
      cwd: projectPath,
      stdio: 'inherit'
    });

    scanner.on('close', (code) => {
      if (code === 0) {
        resolve({
          success: true,
          message: `✅ Escaneo completado para ${profile.projectName}`,
          projectKey: profile.projectKey,
          sonarqubeUrl: `${SONARQUBE_HOST}/dashboard?id=${profile.projectKey}`
        });
      } else {
        reject(new Error(`❌ Escaneo falló con código ${code}`));
      }
    });

    scanner.on('error', (err) => {
      reject(new Error(`Error al ejecutar sonar-scanner: ${err.message}`));
    });
  });
}

// Escaneo dinámico (sin perfil predefinido)
function buildDynamicScanCommand(config, projectPath) {
  const {
    projectKey,
    projectName,
    sources = ['src'],
    exclusions = [],
    language = 'other'
  } = config;

  const args = [
    `-Dsonar.projectKey=${projectKey}`,
    `-Dsonar.projectName=${projectName}`,
    `-Dsonar.sources=${Array.isArray(sources) ? sources.join(',') : sources}`,
    `-Dsonar.host.url=${SONARQUBE_HOST}`,
    `-Dsonar.working.directory=${path.join(projectPath, '.sonar')}`,
  ];

  if (exclusions.length > 0) {
    args.push(`-Dsonar.exclusions=${exclusions.join(',')}`);
  }

  if (SONARQUBE_TOKEN) {
    args.push(`-Dsonar.login=${SONARQUBE_TOKEN}`);
  }

  return args;
}

// Rutas MCP
const routes = {
  '/scan': async (req, res) => {
    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end('Method not allowed');
      return;
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { profile, projectPath } = JSON.parse(body);

        if (!projectPath) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Missing projectPath' }));
          return;
        }

        if (!fs.existsSync(projectPath)) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: `Project path not found: ${projectPath}` }));
          return;
        }

        if (!profile || !PROFILES[profile]) {
          res.writeHead(400);
          res.end(JSON.stringify({ 
            error: `Profile not found. Available: ${Object.keys(PROFILES).join(', ')}` 
          }));
          return;
        }

        const result = await runScan(PROFILES[profile], projectPath);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  },

  '/scan-dynamic': async (req, res) => {
    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end('Method not allowed');
      return;
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const {
          projectPath,
          projectKey,
          projectName,
          sources,
          exclusions,
          language
        } = JSON.parse(body);

        if (!projectPath || !projectKey || !projectName) {
          res.writeHead(400);
          res.end(JSON.stringify({ 
            error: 'Missing required fields: projectPath, projectKey, projectName' 
          }));
          return;
        }

        if (!fs.existsSync(projectPath)) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: `Project path not found: ${projectPath}` }));
          return;
        }

        const args = buildDynamicScanCommand({
          projectKey,
          projectName,
          sources: sources || ['src'],
          exclusions: exclusions || [],
          language: language || 'other'
        }, projectPath);

        console.log(`\n🔍 Escaneo dinámico: ${projectName}`);
        console.log(`📁 Ruta: ${projectPath}`);
        console.log(`🔑 Key: ${projectKey}\n`);

        const scanner = spawn('sonar-scanner', args, {
          cwd: projectPath,
          stdio: 'inherit'
        });

        scanner.on('close', (code) => {
          if (code === 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              message: `✅ Escaneo dinámico completado: ${projectName}`,
              projectKey,
              sonarqubeUrl: `${SONARQUBE_HOST}/dashboard?id=${projectKey}`
            }));
          } else {
            res.writeHead(500);
            res.end(JSON.stringify({ 
              error: `Escaneo falló con código ${code}` 
            }));
          }
        });

        scanner.on('error', (err) => {
          res.writeHead(500);
          res.end(JSON.stringify({ 
            error: `Error al ejecutar sonar-scanner: ${err.message}` 
          }));
        });
      } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  },

  '/profiles': (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      profiles: Object.entries(PROFILES).map(([name, config]) => ({
        name,
        projectKey: config.projectKey,
        projectName: config.projectName,
        language: config.language,
        sources: config.sources,
        exclusions: config.exclusions
      }))
    }));
  },

  '/health': (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok',
      sonarqubeHost: SONARQUBE_HOST,
      authenticated: !!SONARQUBE_TOKEN,
      timestamp: new Date().toISOString()
    }));
  },

  '/api/projects': (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      available_profiles: Object.keys(PROFILES),
      endpoints: {
        scan_with_profile: 'POST /scan',
        scan_dynamic: 'POST /scan-dynamic',
        list_profiles: 'GET /profiles',
        health: 'GET /health'
      }
    }));
  }
};

// Servidor
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const handler = routes[req.url];
  if (handler) {
    handler(req, res);
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
});

const PORT = process.env.MCP_PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🔍 SonarQube MCP Server iniciado`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🏠 SonarQube Host: ${SONARQUBE_HOST}`);
  console.log(`🔐 Autenticado: ${SONARQUBE_TOKEN ? 'Sí ✅' : 'No (anónimo)'}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📋 Perfiles disponibles: ${Object.keys(PROFILES).join(', ')}`);
  console.log(`\n🔗 Endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`   GET  http://localhost:${PORT}/profiles`);
  console.log(`   POST http://localhost:${PORT}/scan`);
  console.log(`   POST http://localhost:${PORT}/scan-dynamic`);
  console.log(`\n`);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Cerrando SonarQube MCP Server...');
  server.close();
  process.exit(0);
});
