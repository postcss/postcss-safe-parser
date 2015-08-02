import parse from '../lib/safe-parse';

import { expect } from 'chai';
import   cases    from 'postcss-parser-tests';

describe('Safe Parser', () => {

    cases.each( (name, css, json) => {
        it('parses ' + name, () => {
            let parsed = cases.jsonify(parse(css, { from: name }));
            expect(parsed).to.eql(json);
        });
    });

    it('fixes unclosed blocks in safe mode', () => {
        expect(parse('@media (screen) { a {\n').toString())
            .to.eql('@media (screen) { a {\n}}');

        expect(parse('a { color').toString()).to.eql('a { color}');

        expect(parse('a { color: black').first.first.prop).to.eql('color');
    });

    it('fixes unnecessary block close in safe mode', () => {
        let root = parse('a {\n} }');
        expect(root.first.toString()).to.eql('a {\n}');
        expect(root.raw.after).to.eql(' }');
    });

    it('fixes unclosed comment in safe mode', () => {
        let root = parse('a { /* b ');
        expect(root.toString()).to.eql('a { /* b */}');
        expect(root.first.first.text).to.eql('b');
    });

    it('fixes unclosed quote in safe mode', () => {
        expect(parse('a { content: "b').toString()).to.eql('a { content: "b"}');
    });

    it('fixes unclosed bracket', () => {
        expect(parse(':not(one() { }').raw.after).to.eql(':not(one() { }');
    });

    it('fixes property without value in safe mode', () => {
        let root = parse('a { color: white; one }');
        expect(root.first.nodes.length).to.eql(1);
        expect(root.first.raw.semicolon).to.be.true;
        expect(root.first.raw.after).to.eql(' one ');
    });

    it('fixes 2 properties in safe mode', () => {
        let root = parse('a { one color: white; one }');
        expect(root.first.nodes.length).to.eql(1);
        expect(root.first.first.prop).to.eql('color');
        expect(root.first.first.raw.before).to.eql(' one ');
    });

    it('fixes nameless at-rule in safe mode', () => {
        let root = parse('@');
        expect(root.first.type).to.eql('atrule');
        expect(root.first.name).to.eql('');
    });

    it('fixes property without semicolon in safe mode', () => {
        let root = parse('a { one: 1 two: 2 }');
        expect(root.first.nodes.length).to.eql(2);
        expect(root.toString()).to.eql('a { one: 1; two: 2 }');
    });

    it('fixes double colon in safe mode', () => {
        let root = parse('a { one:: 1 }');
        expect(root.first.first.value).to.eql(': 1');
    });

});
