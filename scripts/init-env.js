#!/usr/bin/env node

/**
 * Environment Initialization Script
 * Creates .env file if it doesn't exist
 */

const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '..', '.env');

// Default production environment
const defaultEnv = {
    VITE_CURRENT_ENV: 'production',
    VITE_API_BASE_URL_PRODUCTION: 'https://indigo-rhapsody-backend-ten.vercel.app',
    VITE_API_BASE_URL_TESTING: 'https://indigo-rhapsody-backend-test.vercel.app'
};

function createDefaultEnvFile() {
    if (fs.existsSync(envFile)) {
        console.log('✅ .env file already exists');
        return;
    }

    const envContent = Object.entries(defaultEnv)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    fs.writeFileSync(envFile, envContent);
    console.log('✅ Created default .env file with production settings');
    console.log(`📁 Environment file: ${envFile}`);
    console.log('🔗 API Base URL: https://indigo-rhapsody-backend-ten.vercel.app');
}

function showEnvFileStatus() {
    if (fs.existsSync(envFile)) {
        const content = fs.readFileSync(envFile, 'utf8');
        console.log('📋 Current .env file contents:');
        console.log('=====================================');
        console.log(content);
        console.log('=====================================');
    } else {
        console.log('❌ No .env file found');
    }
}

// Main execution
const action = process.argv[2];

switch (action) {
    case 'create':
        createDefaultEnvFile();
        break;
    case 'status':
        showEnvFileStatus();
        break;
    default:
        console.log('🔧 Environment Initialization Script');
        console.log('Usage:');
        console.log('  node scripts/init-env.js create  - Create default .env file');
        console.log('  node scripts/init-env.js status   - Show current .env file');
        break;
}
