import tokenize from '../lib/safe-tokenize';

import Input from 'postcss/lib/input';
import test  from 'ava';

function run(t, css, tokens) {
    t.deepEqual(tokenize(new Input(css)), tokens);
}

test('fixes unclosed string in safe mode', t => {
    run(t, '"', [ ['string', '""', 1, 1, 1, 2] ]);
});

test('fixes unclosed comment in safe mode', t => {
    run(t, '/*', [ ['comment', '/**/', 1, 1, 1, 4] ]);
});
