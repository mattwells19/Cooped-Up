/** @type {import("snowpack").SnowpackUserConfig } */
const httpProxy = require("http-proxy");

const proxy = httpProxy.createServer({ target: "http://localhost:4000" });

module.exports = {
  mount: {
    public: { url: "/", static: true },
    src: { url: "/dist" },
  },
  plugins: [
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-dotenv",
    "@snowpack/plugin-typescript",
    "@snowpack/plugin-postcss",
  ],
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
    /* ... */
  },
};
