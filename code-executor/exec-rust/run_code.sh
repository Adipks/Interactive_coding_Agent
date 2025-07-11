#!/bin/bash

# Don't exit on errors, handle them explicitly
mkdir -p /tmp/code
cd /tmp/code

echo "📁 Writing Rust code..."
# Clear the file first
> main.rs
# Read input until EOF marker, remove the marker, and save to file
{
    while IFS= read -r line; do
        if [[ "$line" == *"__EOF__"* ]]; then
            # Remove the __EOF__ marker and any content after it
            remaining="${line%__EOF__*}"
            if [[ -n "$remaining" ]]; then
                printf '%s\n' "$remaining" >> main.rs
            fi
            break
        else
            printf '%s\n' "$line" >> main.rs
        fi
    done
} >/dev/null

echo "🛠️  Compiling Rust..."
rustc main.rs -o main.out 2> error.log

if [ -s error.log ]; then
    echo "❌ Compilation errors:"
    cat error.log
    exit 1
else
    echo "🚀 Running your Rust program..."
    # Ensure output is flushed immediately
    stdbuf -o0 -e0 ./main.out
    EXIT_CODE=$?
    echo ""
    echo "✅ Program finished with exit code: $EXIT_CODE"
fi
