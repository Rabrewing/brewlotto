#!/bin/bash

echo "🎯 BrewLotto Strategy Scaffolder"
read -p "Enter game name (e.g. Pick3): " GAME
read -p "Enter strategy name (e.g. Poisson): " STRATEGY

FILENAME="analyze${GAME}.js"
HEADER="/*
 * File: /utils/$FILENAME
 * Purpose: Generate smart $STRATEGY picks for $GAME
 * Created: $(date -Iminutes)
 */"

echo "Creating /utils/$FILENAME..."
echo -e "$HEADER\n\n// TODO: Add $STRATEGY-based prediction logic\n\nmodule.exports = function analyze${GAME}() {\n  return [];\n}" > "utils/$FILENAME"

echo "- [ ] Implement $STRATEGY strategy for $GAME in /utils/$FILENAME" >> "docs/TODO.md"

echo "Scaffold complete. Opened $FILENAME for editing."