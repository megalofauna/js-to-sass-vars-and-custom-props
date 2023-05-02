import { writeFile } from 'fs/promises';
import { tokens } from './src/tokens.js';

const iterateTokenObject = (source, scope) => {
  let result = '';
  for (const [key, value] of Object.entries(source)) {
    switch (scope) {
      case 'css':
        result += `  --${key}: ${value};\n`;
        break;
      case 'scss':
        result += `$${key}: ${value};\n`;
        break;
    }
  }
  return result;
};

const generateSassVariables = (source, scope) => {
  let sassString = `\n\n // Sass variables \n\n`;
  sassString += `${iterateTokenObject(source, scope)}`;

  return sassString;
};

const generateCssCustomProperties = (source, scope, encapsulation) => {
  let cssString = `// CSS custom properties \n\n`;
  cssString += `${encapsulation} {\n`;
  cssString += `${iterateTokenObject(source, scope)}`;
  cssString += `}`;

  return cssString;
};

const generateAll = (source, encapsulation) => {
  let cssString = generateCssCustomProperties(source, 'css', encapsulation);
  let sassString = generateSassVariables(source, 'scss');

  return `${cssString} ${sassString
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()}`;
};

const processTokens = async (
  scope,
  encapsulation = ':host',
  fileName = 'tokens.scss'
) => {
  const outputPath = './output/' + fileName;
  let contentResult = '';

  const source = tokens;

  switch (scope) {
    case 'css':
      contentResult = generateCssCustomProperties(source, 'css', encapsulation);
      break;
    case 'scss':
      contentResult = generateSassVariables(source, 'scss');
      break;
    default:
      contentResult = generateAll(source, encapsulation);
  }

  try {
    await writeFile(outputPath, contentResult, 'utf8');
    console.log('Token file saved successfully:', outputPath);
  } catch (err) {
    console.error('An error occurred while saving the token file:', err);
  }
};

const args = process.argv.slice(2);
processTokens(...args);
