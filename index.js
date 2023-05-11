import { writeFile } from 'fs/promises';
import { tokens } from './src/tokens.js';

function processTokenObject(tokenObject, scope, inputString = '', prefix = '') {
  for (const [key, value] of Object.entries(tokenObject)) {
    const newPrefix = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'object' && value !== null) {
      inputString = processTokenObject(value, scope, inputString, newPrefix);
    } else {
      switch (scope) {
        case 'css':
          inputString += `  --${newPrefix}: ${value};\n`;
          break;

        case 'scss':
          inputString += `$${newPrefix}: ${value};\n`;
          break;
      }
    }
  }
  return inputString;
}

const wrapCssOutput = (outputString, encapsulation) => {
  return `:${encapsulation} {\n${outputString}}\n\n`;
};

const processTokens = async (
  scope,
  encapsulation = 'host',
  fileName = 'tokens.scss'
) => {
  const outputPath = './output/' + fileName;
  const source = tokens;
  let outputString = '';

  switch (scope) {
    case 'css':
      outputString = processTokenObject(source, 'css');
      outputString = wrapCssOutput(outputString, encapsulation);
      break;
    case 'scss':
      outputString += processTokenObject(source, 'scss');
      break;
    default:
      outputString = processTokenObject(source, 'css');
      outputString = wrapCssOutput(outputString, encapsulation);
      outputString += processTokenObject(source, 'scss');
  }

  try {
    await writeFile(outputPath, outputString, 'utf8');
    console.log('Token file saved successfully:', outputPath);
  } catch (err) {
    console.error('An error occurred while saving the token file:', err);
  }
};

const args = process.argv.slice(2);
processTokens(...args);
