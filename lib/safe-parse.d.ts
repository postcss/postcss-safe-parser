import type { Parser } from 'postcss'

/**
 * A fault-tolerant CSS parser for [PostCSS], which will find & fix syntax
 * errors, capable of parsing any input.
 */
declare const safe: Parser

export = safe
