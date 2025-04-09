module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  mode: 'development',
  entry: './src/main.js',
  devtool: 'source-map', // ✅ ajoute cette ligne ici
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
};