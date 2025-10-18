# Environment Configuration

This project supports multiple environments with different configurations using a single `.env` file.

## Environment Setup

### 1. Create Single Environment File

Create a single `.env` file in your project root:

#### `.env`
```env
# Environment Configuration
VITE_PUBLIC_ENVIRONMENT=development
VITE_PUBLIC_BASE_URL_TEST=https://indigo-rhapsody-backend-vzge.vercel.app
VITE_PUBLIC_BASE_URL_PROD=https://indigo-rhapsody-backend-ten.vercel.app

# Optional Configuration
VITE_API_TIMEOUT=30000
VITE_APP_DEBUG=true
VITE_APP_NAME=Indigo Rhapsody Dashboard
VITE_APP_VERSION=1.0.0
```

### 2. Available Scripts

```bash
# Development
npm run dev                    # Default development (uses VITE_PUBLIC_ENVIRONMENT)
npm run dev:staging           # Development with staging config
npm run dev:production        # Development with production config

# Build
npm run build                 # Default build
npm run build:staging        # Build for staging
npm run build:production     # Build for production

# Preview
npm run preview              # Default preview
npm run preview:staging     # Preview staging build
npm run preview:production  # Preview production build
```

### 3. Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_PUBLIC_ENVIRONMENT` | Environment name (development/staging/production) | `development` | No |
| `VITE_PUBLIC_BASE_URL_TEST` | Test/Development API URL | `https://indigo-rhapsody-backend-vzge.vercel.app` | Yes |
| `VITE_PUBLIC_BASE_URL_PROD` | Production API URL | `https://indigo-rhapsody-backend-ten.vercel.app` | Yes |
| `VITE_API_TIMEOUT` | API timeout in ms | `30000` | No |
| `VITE_APP_DEBUG` | Enable debug logs | `true` | No |

### 4. Usage in Code

```javascript
import { API_BASE_URL, ENVIRONMENT, DEBUG } from './config/environment';

// Use environment-specific configuration
console.log('Current environment:', ENVIRONMENT);
console.log('API Base URL:', API_BASE_URL);

// Check if debug is enabled
if (DEBUG) {
  console.log('Debug mode enabled');
}
```

### 5. How It Works

The system automatically selects the correct API URL based on the environment:

- **Development/Staging**: Uses `VITE_PUBLIC_BASE_URL_TEST` (https://indigo-rhapsody-backend-vzge.vercel.app)
- **Production**: Uses `VITE_PUBLIC_BASE_URL_PROD` (https://indigo-rhapsody-backend-ten.vercel.app)

You only need to change `VITE_PUBLIC_ENVIRONMENT` to switch between environments:
- `development` → Uses test URL
- `staging` → Uses test URL  
- `production` → Uses production URL

### 5. Environment Features

Each environment has different features enabled:

#### Development
- ✅ Debug logs
- ✅ Error boundary
- ✅ Hot reload
- ✅ Dev tools
- ✅ API call logging
- ✅ Performance logging

#### Staging
- ✅ Debug logs
- ✅ Error boundary
- ❌ Hot reload
- ❌ Dev tools
- ✅ API call logging
- ❌ Performance logging

#### Production
- ❌ Debug logs
- ✅ Error boundary
- ❌ Hot reload
- ❌ Dev tools
- ❌ API call logging
- ❌ Performance logging

### 6. Validation

The environment configuration is automatically validated on startup. If there are any issues, the application will log errors and may fail to start.

### 7. Fallbacks

If environment variables are not set, the system will use default values from the configuration files.
