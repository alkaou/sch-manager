const { createProxyMiddleware } = require('http-proxy-middleware');

const apiProxy = createProxyMiddleware({
  target: 'http://www.example.org',
  changeOrigin: true,
});

// 'apiProxy' is now ready to be used as middleware in a server.
console.log(apiProxy);