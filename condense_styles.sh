#!/bin/bash

# Function to reduce CSS values by 20%
condense_css() {
    local file=$1
    
    # Reduce padding values (e.g., padding: 30px -> padding: 24px)
    sed -i -E 's/padding: ([0-9]+)px/padding: $((\1 * 80 \/ 100))px/g' "$file"
    sed -i -E 's/padding: ([0-9]+)px ([0-9]+)px/padding: $((\1 * 80 \/ 100))px $((\2 * 80 \/ 100))px/g' "$file"
    
    # Reduce margin values
    sed -i -E 's/margin: ([0-9]+)px/margin: $((\1 * 80 \/ 100))px/g' "$file"
    
    # Reduce gap values
    sed -i -E 's/gap: ([0-9]+)px/gap: $((\1 * 80 \/ 100))px/g' "$file"
    
    # Reduce font-size values
    sed -i -E 's/font-size: ([0-9]+(\.[0-9]+)?)rem/font-size: \1rem/g' "$file"
}

# This approach won't work well with sed calculations
# Let me use awk instead for better math
