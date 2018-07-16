const Input = require('postcss/lib/input')

const SafeParser = require('./safe-parser')

module.exports = function safeParse (css, opts) {
  const input = new Input(css, opts)

  const parser = new SafeParser(input)
  parser.parse()

  return parser.root
}
