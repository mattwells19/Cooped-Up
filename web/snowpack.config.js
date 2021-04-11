/** @type {import("snowpack").SnowpackUserConfig } */
const httpProxy = require("http-proxy");

const proxy = httpProxy.createServer({
  target: "http://localhost:4000",
});

module.exports = {
  mount: {
    public: {
      url: "/",
      static: true,
    },
    src: {
      url: "/dist",
    },
  },
  alias: {
    "@components": "./src/components",
    "@icons": "./src/icons/index",
    "@utils": "./src/utils",
    "@hooks": "./src/hooks",
    "@contexts": "./src/contexts",
    "@images": "./src/images",
    "@pages": "./src/pages",
    "@GameState": "./src/GameState",
  },
  plugins: ["@snowpack/plugin-react-refresh", "@snowpack/plugin-dotenv", "@snowpack/plugin-typescript"],
  routes: [
    {
      src: "/socket.io/.*",
      dest: (req, res) => proxy.web(req, res),
    },
    {
      src: "/api/.*",
      dest: (req, res) => proxy.web(req, res),
    },
    /* Enable an SPA Fallback in development: */
    {
      match: "routes",
      src: ".*",
      dest: "/index.html",
    },
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    clean: false, // prevents the build directory from being deleted between builds
    out: "../build",
  },
};
