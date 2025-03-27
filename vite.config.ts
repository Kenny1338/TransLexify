import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  console.log("Vite mode:", mode);
  console.log("OpenAI API Key exists:", !!env.VITE_OPENAI_API_KEY);
  console.log("OpenAI API Key exists in process.env:", !!process.env.VITE_OPENAI_API_KEY);
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Use env instead of process.env
      'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(env.VITE_OPENAI_API_KEY || "")
    }
  };
});
