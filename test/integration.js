#!/usr/bin/env node

let ciJobNumber = require('ci-job-number')
let real = require('postcss-parser-tests/real')

let safe = require('../build')

const BROWSERHACKS =
  'https://raw.githubusercontent.com/maste/browserhacks/gh-pages/' +
  'assets/css/tests.css'

if (ciJobNumber() === 1) {
  real(() => true, [['Browserhacks', BROWSERHACKS]], css => {
    return safe(css).toResult({ map: { annotation: false } })
  })
}
