const fs = require('fs'); // Node.js module for file handling
const { DOMParser, XMLSerializer } = require('xmldom'); // Install using npm i xmldom
const { Command } = require('commander');

const program = new Command();

// Define the program version
program.version('1.0.0');

let fileName;

// Define the --filename option to specify the SVG file name
program
  .option('-f, --filename <type>', 'Specify the SVG file name')
  .description('Get the SVG file name')
  .parse(process.argv);

const options = program.opts();

if (options.filename) {
  fileName = options.filename;
  console.log(`SVG file name: ${options.filename}`);
}

if (!fileName) {
  console.error("Please specify the SVG file name using the --filename option.");
  process.exit(1);
}

// Read the SVG file from the file system
fs.readFile(`./logo/${fileName}`, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // The content of the SVG file is stored in the "data" variable
  var svgString = data;

  // Create a DOM object for the SVG using xmldom
  var parser = new DOMParser();
  var svgDOM = parser.parseFromString(svgString, 'image/svg+xml');

  // Select all <path> elements in the SVG
  var pathElements = svgDOM.getElementsByTagName('path');

  // Iterate through all <path> elements and retrieve the value of the "d" attribute
  for (var i = 0; i < pathElements.length; i++) {
    var path = pathElements[i];
    var dAttribute = path.getAttribute('d');

    // Update the value of the "d" attribute
    // Use a regular expression to round decimal numbers to two digits after the decimal point
    var updatedDAttribute = dAttribute.replace(/(\d+\.\d{2})\d*/g, '$1');

    // Replace the value of the "d" attribute in the element
    path.setAttribute('d', updatedDAttribute);
  }

  // Convert the updated SVG to a string
  var updatedSvgString = new XMLSerializer().serializeToString(svgDOM);

  // Determine the output file name (without the extension)
  const fileNameWithoutExtension = fileName.replace(/\.[^.]+$/, '');

  // Determine the output file name
  const fileNameUpdated = `${fileNameWithoutExtension}_updated.svg`;

  // Write the updated SVG to a new file
  fs.writeFile(`./logo/${fileNameUpdated}`, updatedSvgString, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`The file ${fileNameUpdated} has been successfully saved.`);
  });
});
