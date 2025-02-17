/**
 * @file Gmic grammar for tree-sitter
 * @author Anton Älgmyr
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

identifier = /[A-Za-z_][A-Za-z_0-9]*/

list_of = (rule, sep) => seq(rule, repeat1(seq(sep, rule)))
maybe_list_of = (rule, sep) => seq(rule, repeat(seq(sep, rule)))

module.exports = grammar({
  name: "gmic",

  conflicts: $ => [
    [$.command],
  ],

  rules: {
    source_file: $ => repeat(choice($.command, $.comment)),

    comment: _ => token(prec(-10, /#[^\n]*/)),

    command: $ => seq(
      alias($.identifier, $.command_name_def), ":",
      repeat(choice($.statement, $.comment)),
    ),

    statement: $ => choice(
      $.assignment,
      $.command_call,
    ),

    command_call: $ => seq(
      optional("+"),
      alias(choice($.keyword, $.identifier), $.command_name),
      optional($.selection),
      repeat($.expression),
      $.terminator,
    ),

    // Indexing.
    selection: $ => choice(
      seq(
        token.immediate("["),
        $._selection_list,
        "]",
      ),
      $.negative_index_shorthand,
    ),
    index: $ => seq(optional("-"), $.integer),
    percentage: $ => seq($.integer, "%"),
    _index_or_percentage: $ => choice($.index, $.percentage),
    index_range: $ => seq(
      $._index_or_percentage,
      "-",
      $._index_or_percentage,
      optional(seq(":", $.integer))
    ),
    _selection_list: $ => maybe_list_of(
      seq(
        optional($.negate_indexing),
        choice($.index, $.index_range, $.identifier),
      ),
      ",",
    ),
    negate_indexing: $ => "^",
    negative_index_shorthand: $ => choice(".", "..", "..."),

    expression: $ => choice(
      $.scalar_expression,
      $.array_expression,
    ),

    scalar_expression: $ => seq(
      optional(/[\-+]/),
      choice(
        $.integer,
        $.variable,
        $.math_environment,
        $.string,
        $.bare_string,
      ),
    ),

    array_expression: $ => seq(
      list_of(
        alias($.scalar_expression, $.array_item),
        ",",
      )
    ),


    math_environment: $ => seq(
      "{", 
        choice(
          $.math_expression,
          $.string,
        ),
      "}"
    ),

    // Super naive.
    math_expression: $ => choice(
      $.integer,
      $.unary_expression,
      $.binary_expression,
      $.identifier,  // Built-in
      $.variable,
    ),

    integer: $ => /\d+/,
    // Naive string.
    string: $ => /"[^"]*"/,
    
    unary_expression: $ => seq(/[+\-]/, $.math_expression),
    binary_expression: $ => choice(
      prec.left(2, seq($.math_expression, /[*/]/, $.math_expression)),
      prec.left(1, seq($.math_expression, /[\-+]/, $.math_expression)),
    ),

    variable: $ => choice(
        seq("$", identifier),
        /\$[0-9]/,
    ),


    assignment: $ => seq(
      $.identifier, "=", $.expression,
    ),

    identifier: $ => identifier,

    terminator : $ => "\n",

    // Bare string, should be low priority.
    bare_string: $ => /[/.a-zA-Z_\d][/.a-zA-Z_\d\-]*/,

    keyword: $ => choice(
      // Control flow
      "apply_parallel",
      "apply_parallel_channels",
      "apply_parallel_overlap",
      "apply_tiles",
      "apply_timeout",
      "check",
      "check3d",
      "continue",
      "break",
      "do",
      "done",
      "elif",
      "else",
      "fi",
      "error",
      "eval",
      "exec",
      "exec_out",
      "for",
      "foreach",
      "if",
      "local",
      "noarg",
      "onfail",
      "parallel",
      "progress",
      "quit",
      "repeat",
      "return",
      "rprogress",
      "run",
      "skip",
      "status",
      "while",
    ),
  }
});
