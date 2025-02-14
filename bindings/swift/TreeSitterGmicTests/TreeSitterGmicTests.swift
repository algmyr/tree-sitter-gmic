import XCTest
import SwiftTreeSitter
import TreeSitterGmic

final class TreeSitterGmicTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_gmic())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Gmic grammar")
    }
}
