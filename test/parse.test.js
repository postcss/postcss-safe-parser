var cases = require('postcss-parser-tests');

var parse = require('../lib/safe-parse');

cases.each( (name, css, json) => {
    it('parses ' + name, () => {
        var parsed = cases.jsonify(parse(css, { from: name }));
        expect(parsed).toEqual(json);
    });
});

it('fixes unclosed blocks in safe mode', () => {
    expect(parse('@media (screen) { a {\n').toString())
        .toEqual('@media (screen) { a {\n}}');
    expect(parse('a { color').toString()).toEqual('a { color}');
    expect(parse('a { color: black').first.first.prop).toEqual('color');
});

it('fixes unnecessary block close in safe mode', () => {
    var root = parse('a {\n} }');
    expect(root.first.toString()).toEqual('a {\n}');
    expect(root.raws.after).toEqual(' }');
});

it('fixes unclosed comment in safe mode', () => {
    var root = parse('a { /* b ');
    expect(root.toString()).toEqual('a { /* b */}');
    expect(root.first.first.text).toEqual('b');
});

it('fixes unclosed quote in safe mode', () => {
    expect(parse('a { content: "b').first.first.value).toEqual('"b');
});

it('fixes unclosed bracket', () => {
    expect(parse(':not(one() { }').toString()).toEqual(':not(one() { }');
});

it('fixes property without value in safe mode', () => {
    var root = parse('a { color: white; one }');
    expect(root.first.nodes.length).toEqual(1);
    expect(root.first.raws.semicolon).toBeTruthy();
    expect(root.first.raws.after).toEqual(' one ');
});

it('fixes 2 properties in safe mode', () => {
    var root = parse('a { color one: white; one }');
    expect(root.first.nodes.length).toEqual(1);
    expect(root.first.first.prop).toEqual('color');
    expect(root.first.first.raws.between).toEqual(' one: ');
});

it('fixes nameless at-rule in safe mode', () => {
    var root = parse('@');
    expect(root.first.type).toEqual('atrule');
    expect(root.first.name).toEqual('');
});

it('fixes property without semicolon in safe mode', () => {
    var root = parse('a { one: 1 two: 2 }');
    expect(root.first.nodes.length).toEqual(2);
    expect(root.toString()).toEqual('a { one: 1; two: 2 }');
});

it('does not fall on missed semicolon in IE filter', () => {
    parse('a { one: two: progid:DX(a=\'1\', b=\'2\'); }');
});

it('fixes double colon in safe mode', () => {
    var root = parse('a { one:: 1 }');
    expect(root.first.first.value).toEqual(': 1');
});

it('fixes colon instead of semicolon', () => {
    var root = parse('a { one: 1: } b { one: 1 : }');
    expect(root.toString()).toEqual('a { one: 1 } b { one: 1  }');
});
