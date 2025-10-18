// Environment validation and utilities
import { ENV_CONFIG, ENVIRONMENT } from './environment';

// Validate required environment variables
export const validateEnvironment = () => {
    const errors = [];

    // Check if API_BASE_URL is set
    if (!ENV_CONFIG.API_BASE_URL) {
        errors.push('API_BASE_URL is not configured');
    }

    // Check if API_BASE_URL is a valid URL
    try {
        new URL(ENV_CONFIG.API_BASE_URL);
    } catch (error) {
        errors.push('API_BASE_URL is not a valid URL');
    }

    // Check if API_TIMEOUT is a number
    if (isNaN(ENV_CONFIG.API_TIMEOUT) || ENV_CONFIG.API_TIMEOUT <= 0) {
        errors.push('API_TIMEOUT must be a positive number');
    }

    if (errors.length > 0) {
        console.error('❌ Environment validation failed:', errors);
        throw new Error(`Environment configuration errors: ${errors.join(', ')}`);
    }

    console.log('✅ Environment validation passed');
    return true;
};

// Get environment-specific features
export const getEnvironmentFeatures = () => {
    const features = {
        development: {
            enableDebugLogs: true,
            enableErrorBoundary: true,
            enableHotReload: true,
            enableDevTools: true,
            logApiCalls: true,
            logPerformance: true
        },
        staging: {
            enableDebugLogs: true,
            enableErrorBoundary: true,
            enableHotReload: false,
            enableDevTools: false,
            logApiCalls: true,
            logPerformance: false
        },
        production: {
            enableDebugLogs: false,
            enableErrorBoundary: true,
            enableHotReload: false,
            enableDevTools: false,
            logApiCalls: false,
            logPerformance: false
        }
    };

    return features[ENVIRONMENT] || features.development;
};

// Check if feature is enabled for current environment
export const isFeatureEnabled = (feature) => {
    const features = getEnvironmentFeatures();
    return features[feature] || false;
};

// Get environment-specific API endpoints
export const getApiEndpoints = () => {
    const baseEndpoints = {
        auth: '/auth',
        users: '/user',
        orders: '/order',
        products: '/products',
        designers: '/designer',
        payments: '/payment',
        categories: '/category',
        subcategories: '/subcategory',
        banners: '/banner',
        blogs: '/blogs',
        queries: '/queries',
        videos: '/videos'
    };

    // Add environment-specific endpoints if needed
    if (ENVIRONMENT === 'staging') {
        return {
            ...baseEndpoints,
            // Add staging-specific endpoints
            health: '/health/staging'
        };
    }

    return baseEndpoints;
};

// Initialize environment
export const initializeEnvironment = () => {
    try {
        validateEnvironment();

        const features = getEnvironmentFeatures();
        const endpoints = getApiEndpoints();

        console.log('🚀 Environment initialized:', {
            environment: ENVIRONMENT,
            features: Object.keys(features).filter(key => features[key]),
            apiBaseUrl: ENV_CONFIG.API_BASE_URL,
            timeout: ENV_CONFIG.API_TIMEOUT
        });

        return {
            config: ENV_CONFIG,
            features,
            endpoints
        };
    } catch (error) {
        console.error('❌ Failed to initialize environment:', error);
        throw error;
    }
};

// Export environment utilities
export {
    ENV_CONFIG,
    ENVIRONMENT
};
