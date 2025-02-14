/**
 * @file Gmic grammar for tree-sitter
 * @author Anton Älgmyr
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "gmic",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
