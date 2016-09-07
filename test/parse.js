import parse from '../lib/safe-parse';

import cases from 'postcss-parser-tests';
import test  from 'ava';

cases.each( (name, css, json) => {
    test('parses ' + name, t => {
        let parsed = cases.jsonify(parse(css, { from: name }));
        t.deepEqual(parsed, json);
    });
});

test('fixes unclosed blocks in safe mode', t => {
    t.deepEqual(parse('@media (screen) { a {\n').toString(),
                '@media (screen) { a {\n}}');
    t.deepEqual(parse('a { color').toString(), 'a { color}');
    t.deepEqual(parse('a { color: black').first.first.prop, 'color');
});

test('fixes unnecessary block close in safe mode', t => {
    let root = parse('a {\n} }');
    t.deepEqual(root.first.toString(), 'a {\n}');
    t.deepEqual(root.raws.after, ' }');
});

test('fixes unclosed comment in safe mode', t => {
    let root = parse('a { /* b ');
    t.deepEqual(root.toString(), 'a { /* b */}');
    t.deepEqual(root.first.first.text, 'b');
});

test('fixes unclosed quote in safe mode', t => {
    t.deepEqual(parse('a { content: "b').first.first.value, '"b');
});

test('fixes unclosed bracket', t => {
    t.deepEqual(parse(':not(one() { }').toString(), ':not(one() { }');
});

test('fixes property without value in safe mode', t => {
    let root = parse('a { color: white; one }');
    t.deepEqual(root.first.nodes.length, 1);
    t.true(root.first.raws.semicolon);
    t.deepEqual(root.first.raws.after, ' one ');
});

test('fixes 2 properties in safe mode', t => {
    let root = parse('a { color one: white; one }');
    t.deepEqual(root.first.nodes.length, 1);
    t.deepEqual(root.first.first.prop, 'color');
    t.deepEqual(root.first.first.raws.between, ' one: ');
});

test('fixes nameless at-rule in safe mode', t => {
    let root = parse('@');
    t.deepEqual(root.first.type, 'atrule');
    t.deepEqual(root.first.name, '');
});

test('fixes property without semicolon in safe mode', t => {
    let root = parse('a { one: 1 two: 2 }');
    t.deepEqual(root.first.nodes.length, 2);
    t.deepEqual(root.toString(), 'a { one: 1; two: 2 }');
});

test('fixes double colon in safe mode', t => {
    let root = parse('a { one:: 1 }');
    t.deepEqual(root.first.first.value, ': 1');
});
