module.exports = {
  input: [
    '/**/*.{js,jsx,ts,tsx}',
    '!src/locales/**'
  ],
  output: './src/locales/$LOCALE/$NAMESPACE.json',
  options: {
    removeUnusedKeys: true,
    sort: true,
    func: {
      list: ['t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
  }
};
