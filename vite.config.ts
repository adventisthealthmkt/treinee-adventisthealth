import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1]; // ex: treinee-adventisthealth
  const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

  // Só usa subpasta no build do Pages
  const base = isGitHubActions && repo ? `/${repo}/` : "/";

  return {
    base,
    server: {
      host: "::",
      port: 8080,
      hmr: { overlay: false },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
