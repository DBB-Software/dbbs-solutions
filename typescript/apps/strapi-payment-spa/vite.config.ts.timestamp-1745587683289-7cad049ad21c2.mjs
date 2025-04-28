// vite.config.ts
import { defineConfig, loadEnv } from "file:///Users/dmytro/projects/dbbs/platform/node_modules/vite/dist/node/index.js";
import react from "file:///Users/dmytro/projects/dbbs/platform/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { TanStackRouterVite } from "file:///Users/dmytro/projects/dbbs/platform/node_modules/@tanstack/router-plugin/dist/esm/vite.js";
import { visualizer } from "file:///Users/dmytro/projects/dbbs/platform/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "STRAPI_PAYMENT");
  return {
    plugins: [
      TanStackRouterVite(),
      react(),
      visualizer({
        filename: "./dist/stats.html",
        gzipSize: true,
        brotliSize: true
      })
    ],
    envPrefix: "STRAPI_PAYMENT",
    define: {
      ...Object.keys(env).reduce(
        (prev, key) => ({
          ...prev,
          [`process.env.${key}`]: JSON.stringify(env[key])
        }),
        {}
      )
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZG15dHJvL3Byb2plY3RzL2RiYnMvcGxhdGZvcm0vdHlwZXNjcmlwdC9hcHBzL3N0cmFwaS1wYXltZW50LXNwYVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RteXRyby9wcm9qZWN0cy9kYmJzL3BsYXRmb3JtL3R5cGVzY3JpcHQvYXBwcy9zdHJhcGktcGF5bWVudC1zcGEvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RteXRyby9wcm9qZWN0cy9kYmJzL3BsYXRmb3JtL3R5cGVzY3JpcHQvYXBwcy9zdHJhcGktcGF5bWVudC1zcGEvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHR5cGUgeyBQbHVnaW5PcHRpb24gfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgVGFuU3RhY2tSb3V0ZXJWaXRlIH0gZnJvbSAnQHRhbnN0YWNrL3JvdXRlci1wbHVnaW4vdml0ZSdcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJ1NUUkFQSV9QQVlNRU5UJylcblxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIFRhblN0YWNrUm91dGVyVml0ZSgpLFxuICAgICAgcmVhY3QoKSxcbiAgICAgIHZpc3VhbGl6ZXIoe1xuICAgICAgICBmaWxlbmFtZTogJy4vZGlzdC9zdGF0cy5odG1sJyxcbiAgICAgICAgZ3ppcFNpemU6IHRydWUsXG4gICAgICAgIGJyb3RsaVNpemU6IHRydWVcbiAgICAgIH0pIGFzIFBsdWdpbk9wdGlvblxuICAgIF0sXG4gICAgZW52UHJlZml4OiAnU1RSQVBJX1BBWU1FTlQnLFxuICAgIGRlZmluZToge1xuICAgICAgLi4uT2JqZWN0LmtleXMoZW52KS5yZWR1Y2UoXG4gICAgICAgIChwcmV2LCBrZXkpID0+ICh7XG4gICAgICAgICAgLi4ucHJldixcbiAgICAgICAgICBbYHByb2Nlc3MuZW52LiR7a2V5fWBdOiBKU09OLnN0cmluZ2lmeShlbnZba2V5XSlcbiAgICAgICAgfSksXG4gICAgICAgIHt9XG4gICAgICApXG4gICAgfVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1WSxTQUFTLGNBQWMsZUFBZTtBQUU3YSxPQUFPLFdBQVc7QUFDbEIsU0FBUywwQkFBMEI7QUFDbkMsU0FBUyxrQkFBa0I7QUFHM0IsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxnQkFBZ0I7QUFFekQsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLE1BQ1AsbUJBQW1CO0FBQUEsTUFDbkIsTUFBTTtBQUFBLE1BQ04sV0FBVztBQUFBLFFBQ1QsVUFBVTtBQUFBLFFBQ1YsVUFBVTtBQUFBLFFBQ1YsWUFBWTtBQUFBLE1BQ2QsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxNQUNOLEdBQUcsT0FBTyxLQUFLLEdBQUcsRUFBRTtBQUFBLFFBQ2xCLENBQUMsTUFBTSxTQUFTO0FBQUEsVUFDZCxHQUFHO0FBQUEsVUFDSCxDQUFDLGVBQWUsR0FBRyxFQUFFLEdBQUcsS0FBSyxVQUFVLElBQUksR0FBRyxDQUFDO0FBQUEsUUFDakQ7QUFBQSxRQUNBLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
