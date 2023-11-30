#!/bin/bash

os=$(uname -s)

if [ "$os" = "Linux" ]; then
    sed -i 's|\"production\"!==process.env.NODE_ENV|true|g' ./packages/c2pa-wc/dist/components/Popover/Popover.js
elif [ "$os" = "Darwin" ]; then
    sed -i '' 's|\"production\"!==process.env.NODE_ENV|true|g' ./packages/c2pa-wc/dist/components/Popover/Popover.js
else
    echo "Unsupported operating system: $os"
fi
