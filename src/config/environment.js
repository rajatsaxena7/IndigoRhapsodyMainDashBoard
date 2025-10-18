// Environment Configuration
const config = {
    production: {
        API_BASE_URL: import.meta.env.VITE_API_BASE_URL_PRODUCTION || 'https://indigo-rhapsody-backend-ten.vercel.app',
        API_TIMEOUT: 30000,
        DEBUG: false,
        APP_NAME: 'Indigo Rhapsody Dashboard',
        VERSION: '1.0.0'
    },
    development: {
        API_BASE_URL: import.meta.env.VITE_API_BASE_URL_DEVELOPMENT || 'https://indigo-rhapsody-backend-test.vercel.app',
        API_TIMEOUT: 30000,
        DEBUG: true,
        APP_NAME: 'Indigo Rhapsody Dashboard (Testing)',
        VERSION: '1.0.0'
    }
};

// Get current environment from Vite environment variables or default to production
const getCurrentEnvironment = () => {
    // Debug: Log all available environment variables
    console.log('🔍 All Environment Variables:', {
        VITE_CURRENT_ENV: import.meta.env.VITE_CURRENT_ENV,
        VITE_API_BASE_URL_PRODUCTION: import.meta.env.VITE_API_BASE_URL_PRODUCTION,
        VITE_API_BASE_URL_TESTING: import.meta.env.VITE_API_BASE_URL_TESTING,
        VITE_API_BASE_URL_DEVELOPMENT: import.meta.env.VITE_API_BASE_URL_DEVELOPMENT,
        allEnvKeys: Object.keys(import.meta.env),
        mode: import.meta.env.MODE,
        dev: import.meta.env.DEV,
        prod: import.meta.env.PROD
    });

    // Check for VITE_CURRENT_ENV first (from your script)
    const currentEnv = import.meta.env.VITE_CURRENT_ENV;
    if (currentEnv && config[currentEnv]) {
        console.log('🌍 Environment detected from VITE_CURRENT_ENV:', currentEnv);
        return currentEnv;
    }

    // Check for VITE_API_BASE_URL_PRODUCTION to determine production
    if (import.meta.env.VITE_API_BASE_URL_PRODUCTION) {
        console.log('🌍 Environment detected as production from VITE_API_BASE_URL_PRODUCTION');
        return 'production';
    }

    // Check for VITE_API_BASE_URL_TESTING to determine development
    if (import.meta.env.VITE_API_BASE_URL_TESTING) {
        console.log('🌍 Environment detected as development from VITE_API_BASE_URL_TESTING');
        return 'development';
    }

    // Check for VITE_API_BASE_URL_DEVELOPMENT to determine development
    if (import.meta.env.VITE_API_BASE_URL_DEVELOPMENT) {
        console.log('🌍 Environment detected as development from VITE_API_BASE_URL_DEVELOPMENT');
        return 'development';
    }

    // Check if we're in development mode and no .env file is loaded
    if (import.meta.env.DEV && Object.keys(import.meta.env).length <= 5) {
        console.warn('⚠️ WARNING: No .env file detected!');
        console.warn('📁 Please run: node scripts/switch-env.js production');
        console.warn('📁 Or create a .env file manually with:');
        console.warn('VITE_CURRENT_ENV=production');
        console.warn('VITE_API_BASE_URL_PRODUCTION=https://indigo-rhapsody-backend-ten.vercel.app');
    }

    // Default to production
    console.log('🌍 No environment detected, defaulting to production');
    return 'production';
};

// Get environment-specific configuration
export const getEnvironmentConfig = () => {
    const currentEnv = getCurrentEnvironment();
    const envConfig = config[currentEnv];

    console.log('🔧 Environment Configuration:', {
        detectedEnvironment: currentEnv,
        apiBaseUrl: envConfig.API_BASE_URL,
        viteCurrentEnv: import.meta.env.VITE_CURRENT_ENV,
        viteApiBaseUrlProduction: import.meta.env.VITE_API_BASE_URL_PRODUCTION,
        viteApiBaseUrlTesting: import.meta.env.VITE_API_BASE_URL_TESTING
    });

    // Override with environment variables if they exist
    const overrides = {
        API_BASE_URL: envConfig.API_BASE_URL, // Already uses the correct URL based on environment
        API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT || envConfig.API_TIMEOUT,
        DEBUG: import.meta.env.VITE_APP_DEBUG === 'true' || envConfig.DEBUG,
        APP_NAME: import.meta.env.VITE_APP_NAME || envConfig.APP_NAME,
        VERSION: import.meta.env.VITE_APP_VERSION || envConfig.VERSION
    };

    const finalConfig = {
        ...envConfig,
        ...overrides,
        ENVIRONMENT: currentEnv
    };

    console.log('✅ Final Configuration:', {
        environment: finalConfig.ENVIRONMENT,
        apiBaseUrl: finalConfig.API_BASE_URL,
        debug: finalConfig.DEBUG
    });

    return finalConfig;
};

// Export current configuration
export const ENV_CONFIG = getEnvironmentConfig();

// Export individual configs for convenience
export const {
    API_BASE_URL,
    API_TIMEOUT,
    DEBUG,
    APP_NAME,
    VERSION,
    ENVIRONMENT
} = ENV_CONFIG;

// Log current environment in development
if (DEBUG) {
    console.log('🌍 Environment Configuration:', {
        environment: ENVIRONMENT,
        apiBaseUrl: API_BASE_URL,
        debug: DEBUG
    });
}
