module.exports = {
  apps: [{
    name: 'viazo-pm2',
    script: 'node_modules/.bin/next',
    args: 'start -p 5356',
    cwd: '/www/wwwroot/Viazo-Shoes',
    env: {
      NODE_ENV: 'production',
      PORT: '5356'
    }
  }]
};
