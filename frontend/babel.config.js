module.exports = {
  presets: [
    ['@vue/app', {
      target: 'IE 10',
      polyfills: [
        'es.array.includes',
        'es.array.from'
      ]
    }]
  ]
}
