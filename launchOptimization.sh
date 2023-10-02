#!/bin/bash

# Prompt the user to enter the filename of the SVG file
read -p "Enter the SVG filename with its extension (example: logo.svg), make sure it is located in the logo folder: " fileName

# Check if the file exists in the "logo" folder
if [ ! -f "logo/$fileName" ]; then
  echo "The file $fileName does not exist in the logo folder."
  exit 1
fi

# Modify the filename by adding "_updated" before the extension
updatedFileName="${fileName%.*}_updated.${fileName##*.}"

# Execute the Node.js script "svgMinimizeScript.js" with the "--filename" option
node svgMinimizeScript.js --filename "$fileName" &

# Wait for 2 seconds
sleep 2

# Execute the "svgo" command with the filename
svgo "logo/$updatedFileName"