module.exports = {
    async rewrites() {
      return [
        {
          source: '/apii/:path*',
          destination: 'http://172.17.0.1:4500/api/:path*' // Proxy to Backend
        }
      ]
    }
  }