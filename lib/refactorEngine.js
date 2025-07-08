// @file: refactorEngine.js
// @directory: /lib
// @summary: AST-powered refactor analysis and fix proposals for Brew Da AI

import * as babel from '@babel/core';
import traverse from '@babel/traverse';
import parser from '@babel/parser';
import generate from '@babel/generator';

/**
 * Analyze a single JS/JSX file and generate fix suggestions
 * @param {string} filePath - Path to the file
 * @param {string} content - File content
 * @returns {object|null} Brew Da AI suggestion report
 */
export function analyzeFileForRefactor(filePath, content) {
    const suggestions = [];
    let ast;

    try {
        ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['jsx', 'classProperties'],
        });
    } catch (e) {
        return {
            file: filePath,
            issues: [`⚠️ Failed to parse: ${e.message}`],
            fix: 'Brew Da AI could not parse file.',
            status: 'error',
        };
    }

    const usedImports = new Set();
    const declaredImports = new Map();

    traverse(ast, {
        ImportDeclaration(path) {
            const source = path.node.source.value;
            path.node.specifiers.forEach((specifier) => {
                const localName = specifier.local.name;
                declaredImports.set(localName, source);
            });
        },
        Identifier(path) {
            usedImports.add(path.node.name);
        },
    });

    const unused = [];
    for (const [name, source] of declaredImports) {
        if (!usedImports.has(name)) {
            unused.push({ name, source });
        }
    }

    if (unused.length) {
        unused.forEach(({ name, source }) =>
            suggestions.push(`🧹 Unused import: ${name} from "${source}"`)
        );
    }

    // 🧠 TODO: Inject path realignment rules based on strategyRegistry.json or common aliases
    // e.g., fix relative to alias: ../../../components/Button → @/components/ui/Button

    if (!suggestions.length) {
        return null; // No issues detected
    }

    const filteredAst = babel.transformFromAstSync(ast, content, {
        plugins: [
            () => ({
                visitor: {
                    ImportDeclaration(path) {
                        const source = path.node.source.value;
                        const specifiers = path.node.specifiers;

                        const allUnused = specifiers.every(
                            (spec) => !usedImports.has(spec.local.name)
                        );

                        if (allUnused) {
                            path.remove();
                        }
                    },
                },
            }),
        ],
        retainLines: true,
        generatorOpts: { comments: true },
        configFile: false,
        babelrc: false,
        compact: false,
    });

    return {
        file: filePath,
        issues: suggestions,
        fix: 'Removed unused imports',
        summary: `Brew Da AI found ${unused.length} unused imports.`,
        status: 'refactor-candidate',
        patch: {
            before: content,
            after: filteredAst.code,
        },
    };
}