#!/usr/bin/env node

let real = require('postcss-parser-tests/real')

let safe = require('./build')

real(() => true, [['Browserhacks', 'http://browserhacks.com/']], css => {
  return safe(css).toResult({ map: { annotation: false } })
})
