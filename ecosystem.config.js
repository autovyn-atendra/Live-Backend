// module.exports = {
//     apps: [{
//         name: 'my-new-clustered-app',
//         script: 'index.js',
//         instances: 6,      // Number of clusters
//         exec_mode: 'cluster',  // Cluster mode
//     }]
// };


module.exports = {
    apps: [{
      name: "backend",
      script: "index.js",
      exec_mode: "cluster",
      instances: "4",
      restart_delay: 5000,
      max_restarts: 5,
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    }]
  };
  