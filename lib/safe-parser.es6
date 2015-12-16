import Parser from 'postcss/lib/parser';

import safeTokenizer from './safe-tokenize';

export default class SafeParser extends Parser {

    tokenize() {
        this.tokens = safeTokenizer(this.input);
    }

    unclosedBracket() { }

    unknownWord(start) {
        let buffer   = this.tokens.slice(start, this.pos + 1);
        this.spaces += buffer.map( i => i[1] ).join('');
    }

    unexpectedClose() {
        this.current.raws.after += '}';
    }

    doubleColon() { }

    unnamedAtrule(node) {
        node.name = '';
    }

    precheckMissedSemicolon(tokens) {
        let colon = this.colon(tokens);
        if ( colon === false ) return;

        let split;
        for ( split = colon - 1; split >= 0; split-- ) {
            if ( tokens[split][0] === 'word' ) break;
        }
        for ( split -= 1; split >= 0; split-- ) {
            if ( tokens[split][0] !== 'space' ) {
                split += 1;
                break;
            }
        }
        let other = tokens.splice(split, tokens.length - split);
        this.decl(other);
    }

    checkMissedSemicolon() { }

    endFile() {
        if ( this.current.nodes && this.current.nodes.length ) {
            this.current.raws.semicolon = this.semicolon;
        }
        this.current.raws.after = (this.current.raws.after || '') + this.spaces;

        while ( this.current.parent ) {
            this.current = this.current.parent;
            this.current.raws.after = '';
        }
    }

}
