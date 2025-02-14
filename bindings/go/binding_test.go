package tree_sitter_gmic_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_gmic "github.com/tree-sitter/tree-sitter-gmic/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_gmic.Language())
	if language == nil {
		t.Errorf("Error loading Gmic grammar")
	}
}
