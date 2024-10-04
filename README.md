# PostCSS Safe Parser

<img align="right" width="135" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="https://postcss.org/logo-leftp.svg">

A fault-tolerant CSS parser for [PostCSS], which will find & fix syntax errors,
capable of parsing any input. It is useful for:

* Parse legacy code with many hacks. For example, it can parse all examples
  from [Browserhacks].
* Works with demo tools with live input like [Autoprefixer demo].

[Autoprefixer demo]: http://simevidas.jsbin.com/gufoko/quiet
[Browserhacks]:      http://browserhacks.com/
[PostCSS]:           https://github.com/postcss/postcss

<img src="https://cdn.evilmartians.com/badges/logo-no-label.svg" alt="" width="22" height="16" />  Made at <b><a href="https://evilmartians.com/devtools?utm_source=postcss-safe-parser&utm_campaign=devtools-button&utm_medium=github">Evil Martians</a></b>, product consulting for <b>developer tools</b>.


## Usage

```js
const safe = require('postcss-safe-parser')

const badCss = 'a {'

postcss(plugins).process(badCss, { parser: safe }).then(result => {
  result.css //= 'a {}'
})
```


## Security Contact

To report a security vulnerability, please use the [Tidelift security contact].
Tidelift will coordinate the fix and disclosure.

[Tidelift security contact]: https://tidelift.com/security

