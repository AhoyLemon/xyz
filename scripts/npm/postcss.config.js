module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['last 4 versions'],
      grid: 'autoplace',
      flexbox: true
    })
  ]
}