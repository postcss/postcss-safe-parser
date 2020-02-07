#!/usr/bin/env node

let ciJobNumber = require('ci-job-number')
let real = require('postcss-parser-tests/real')

let safe = require('../build')

if (ciJobNumber() === 1) {
  real(() => true, [['Browserhacks', 'http://browserhacks.com/']], css => {
    return safe(css).toResult({ map: { annotation: false } })
  })
}
