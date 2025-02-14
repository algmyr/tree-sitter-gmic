/**
 * @file Gmic grammar for tree-sitter
 * @author Anton Älgmyr
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

identifier = /[A-Za-z_][A-Za-z_0-9]*/

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
      $.if_statement,
      $.command_call,
    ),

    command_call: $ => seq(
      optional("+"),
      alias($.identifier, $.command_name),
      optional($.indexing),
      repeat($.array_expression),
      $.terminator,
    ),

    indexing: $ => seq(token.immediate("["), $.expression, "]"),

    if_statement: $ => seq(
      "if", alias($.string, $.condition), repeat($.statement),
      optional(seq("elif", alias($.string, $.condition), repeat($.statement))),
      optional(seq("else", repeat($.statement))),
      "fi"
    ),

    expression: $ => seq(
      optional(/[\-+]/),
      choice(
        $.integer,
        $.variable,
        $.math_environment,
        $.string,
        $.bare_string,
      ),
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
      $.identifier, "=", $.array_expression,
    ),

    array_expression: $ => seq(
      $.expression, repeat(seq(",", $.expression)),
    ),

    identifier: $ => identifier,

    terminator : $ => "\n",

    // Bare string, should be low priority.
    bare_string: $ => /[/.a-zA-Z_\d][/.a-zA-Z_\d\-]*/,
  }
});
