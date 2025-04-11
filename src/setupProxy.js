const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/test-connection',
    createProxyMiddleware({
      target: 'https://example.com',
      changeOrigin: true,
      pathRewrite: { '^/test-connection': '' },
    })
  );
};
