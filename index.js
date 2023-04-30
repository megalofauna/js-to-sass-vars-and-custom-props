import { writeFile } from 'fs/promises';
import { tokens } from './src/tokens.js';

const generateSassVariables = (source) => {
  let sassString = `\n\n // Sass variables \n\n`;
  for (const [key, value] of Object.entries(source)) {
    sassString += `$${key}: ${value};\n`;
  }

  return sassString;
};

const generateCssCustomProperties = (source, encapsulation) => {
  let cssString = `// CSS custom properties \n\n`;
  cssString += `${encapsulation} {\n`;
  for (const [key, value] of Object.entries(source)) {
    cssString += `  --${key}: ${value};\n`;
  }
  cssString += `}`;

  return cssString;
};

const generateAll = (source, encapsulation) => {
  let cssString = generateCssCustomProperties(source, encapsulation);
  let sassString = generateSassVariables(source);

  return `${cssString} ${sassString
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()}`;
};

const saveTokensToFile = async (
  fileName = 'tokens.scss',
  scope = 'all',
  encapsulation = ':host'
) => {
  const outputPath = './output/' + fileName;
  let contentResult = '';

  const source = tokens;

  switch (scope) {
    case 'all':
      contentResult = generateAll(source, encapsulation);
      break;
    case 'css':
      contentResult = generateCssCustomProperties(source, encapsulation);
      break;
    case 'scss':
      contentResult = generateSassVariables(source);
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
saveTokensToFile(...args);
