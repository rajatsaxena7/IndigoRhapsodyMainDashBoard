import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        external: [],
        input: "index.html",
      },
    },
    // Ensure environment variables are available
    define: {
      // Make sure all VITE_ prefixed env vars are available
      ...Object.keys(env).reduce((prev, key) => {
        if (key.startsWith('VITE_')) {
          prev[`import.meta.env.${key}`] = JSON.stringify(env[key]);
        }
        return prev;
      }, {})
    },
    // Log environment loading
    onload: (id) => {
      if (id.includes('.env')) {
        console.log('📁 Loading environment file:', id);
      }
    }
  };
});
