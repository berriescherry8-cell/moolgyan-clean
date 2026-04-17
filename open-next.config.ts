const config = {
  // Override default OpenNext configuration
  appBuildOutputPath: '.next',
  // Disable middleware if not needed
  middleware: {
    external: true
  },
  // Skip middleware manifest generation
  skipMiddleware: true
};

module.exports = config;
