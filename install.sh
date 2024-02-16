#!/bin/zsh

echo "alias deploy=\"pnpm -C $(pwd) build && node $(pwd)/dist/index.js\"" >> ~/.zshrc

source ~/.zshrc
