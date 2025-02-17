(identifier) @variable
(variable) @constant
(comment) @comment
(command_name_def) @type
(command_name) @function.method.builtin

[
  "apply_parallel"
  "apply_parallel_channels"
  "apply_parallel_overlap"
  "apply_tiles"
  "apply_timeout"
  "check"
  "check3d"
  "continue"
  "break"
  "do"
  "done"
  "elif"
  "else"
  "fi"
  "error"
  "eval"
  "exec"
  "exec_out"
  "for"
  "foreach"
  "if"
  "local"
  "noarg"
  "onfail"
  "parallel"
  "progress"
  "quit"
  "repeat"
  "return"
  "rprogress"
  "run"
  "skip"
  "status"
  "while"
] @keyword

(string) @string
(integer) @number

[
  "="
; "=>"
; "->"
] @operator

[
  ","
;   ";"
;   "."
] @punctuation.delimiter

[
;   "("
;   ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket
