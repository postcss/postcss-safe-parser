import tokenize from '../lib/safe-tokenize';

import { expect } from 'chai';
import   Input    from 'postcss/lib/input';

let test = (css, tokens) => {
    expect(tokenize(new Input(css))).to.eql(tokens);
};

describe('Safe Tokenizer', () => {

    it('fixes unclosed string in safe mode', () => {
        test('"', [ ['string', '""', 1, 1, 1, 2] ]);
    });

    it('fixes unclosed comment in safe mode', () => {
        test('/*', [ ['comment', '/**/', 1, 1, 1, 4] ]);
    });

});
