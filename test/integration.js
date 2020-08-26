#!/usr/bin/env node

let { testOnReal } = require('postcss-parser-tests')
let ciJobNumber = require('ci-job-number')

let safe = require('../lib/safe-parse')

if (ciJobNumber() === 1) {
  testOnReal(css => safe(css).toResult({ map: { annotation: false } }), [
    'https://raw.githubusercontent.com/' +
      '4ae9b8/browserhacks/gh-pages/assets/css/tests.css'
  ])
}
