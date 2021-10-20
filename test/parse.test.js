let { eachTest, jsonify } = require('postcss-parser-tests')

let parse = require('../lib/safe-parse')

eachTest((name, css, json) => {
  if (name !== 'apply.css' && name !== 'custom-properties.css') {
    it('parses ' + name, () => {
      let parsed = jsonify(parse(css, { from: name }))
      expect(parsed).toEqual(json)
    })
  }
})

it('fixes unclosed blocks in safe mode', () => {
  expect(parse('@media (screen) { a {\n').toString()).toBe(
    '@media (screen) { a {\n}}'
  )
  expect(parse('a { color').toString()).toBe('a { color}')
  expect(parse('a { color: black').first.first.prop).toBe('color')
})

it('fixes unnecessary block close in safe mode', () => {
  let root = parse('a {\n} }')
  expect(root.first.toString()).toBe('a {\n}')
  expect(root.raws.after).toBe(' }')
})

it('fixes unclosed comment in safe mode', () => {
  let root = parse('a { /* b ')
  expect(root.toString()).toBe('a { /* b */}')
  expect(root.first.first.text).toBe('b')
})

it('fixes column and semicolumn case', () => {
  expect(parse('a{:;}').toString()).toBe('a{}')
})

it('fixes unclosed quote in safe mode', () => {
  expect(parse('a { content: "b').first.first.value).toBe('"b')
})

it('fixes unclosed bracket', () => {
  expect(parse(':not(one() { }').toString()).toBe(':not(one() { }')
})

it('fixes property without value in safe mode', () => {
  let root = parse('a { color: white; one }')
  expect(root.first.nodes).toHaveLength(1)
  expect(root.first.raws.semicolon).toBe(true)
  expect(root.first.raws.after).toBe(' one ')
})

it('fixes 2 properties in safe mode', () => {
  let root = parse('a { color one: white; one }')
  expect(root.first.nodes).toHaveLength(1)
  expect(root.first.first.prop).toBe('color')
  expect(root.first.first.raws.between).toBe(' one: ')
})

it('fixes nameless at-rule in safe mode', () => {
  let root = parse('@')
  expect(root.first.type).toBe('atrule')
  expect(root.first.name).toBe('')
})

it('fixes property without semicolon in safe mode', () => {
  let root = parse('a { one: 1 two: 2 }')
  expect(root.first.nodes).toHaveLength(2)
  expect(root.toString()).toBe('a { one: 1; two: 2 }')
})

it('does not fall on missed semicolon in IE filter', () => {
  expect(() => {
    parse("a { one: two: progid:DX(a='1', b='2'); }")
  }).not.toThrow()
})

it('fixes double colon in safe mode', () => {
  let root = parse('a { one:: 1 }')
  expect(root.first.first.value).toBe(': 1')
})

it('fixes colon instead of semicolon', () => {
  let root = parse('a { one: 1: } b { one: 1 : }')
  expect(root.toString()).toBe('a { one: 1: } b { one: 1 : }')
})
