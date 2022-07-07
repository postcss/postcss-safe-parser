let { eachTest, jsonify } = require('postcss-parser-tests')
let { equal, not } = require('uvu/assert')
let { test } = require('uvu')

let parse = require('../lib/safe-parse')

eachTest((name, css, json) => {
  if (name !== 'apply.css' && name !== 'custom-properties.css') {
    test('parses ' + name, () => {
      let parsed = jsonify(parse(css, { from: name }))
      equal(parsed, json)
    })
  }
})

test('fixes unclosed blocks in safe mode', () => {
  equal(
    parse('@media (screen) { a {\n').toString(),
    '@media (screen) { a {\n}}'
  )
  equal(parse('a { color').toString(), 'a { color}')
  equal(parse('a { color: black').first.first.prop, 'color')
})

test('fixes unnecessary block close in safe mode', () => {
  let root = parse('a {\n} }')
  equal(root.first.toString(), 'a {\n}')
  equal(root.raws.after, ' }')
})

test('fixes unclosed comment in safe mode', () => {
  let root = parse('a { /* b ')
  equal(root.toString(), 'a { /* b */}')
  equal(root.first.first.text, 'b')
})

test('fixes column and semicolumn case', () => {
  equal(parse('a{:;}').toString(), 'a{}')
})

test('fixes unclosed quote in safe mode', () => {
  equal(parse('a { content: "b').first.first.value, '"b')
})

test('fixes unclosed bracket', () => {
  equal(parse(':not(one() { }').toString(), ':not(one() { }')
})

test('fixes property without value in safe mode', () => {
  let root = parse('a { color: white; one }')
  equal(root.first.nodes.length, 1)
  equal(root.first.raws.semicolon, true)
  equal(root.first.raws.after, ' one ')
})

test('fixes 2 properties in safe mode', () => {
  let root = parse('a { color one: white; one }')
  equal(root.first.nodes.length, 1)
  equal(root.first.first.prop, 'color')
  equal(root.first.first.raws.between, ' one: ')
})

test('fixes nameless at-rule in safe mode', () => {
  let root = parse('@')
  equal(root.first.type, 'atrule')
  equal(root.first.name, '')
})

test('fixes property without semicolon in safe mode', () => {
  let root = parse('a { one: 1 two: 2 }')
  equal(root.first.nodes.length, 2)
  equal(root.toString(), 'a { one: 1; two: 2 }')
})

test('does not fall on missed semicolon in IE filter', () => {
  not.throws(() => {
    parse("a { one: two: progid:DX(a='1', b='2'); }")
  })
})

test('fixes double colon in safe mode', () => {
  let root = parse('a { one:: 1 }')
  equal(root.first.first.value, ': 1')
})

test('fixes colon instead of semicolon', () => {
  let root = parse('a { one: 1: } b { one: 1 : }')
  equal(root.toString(), 'a { one: 1: } b { one: 1 : }')
})

test.run()

