import { promisify } from 'util';
import { writeFile } from 'fs';

const writeFileSync = promisify(writeFile);

let languagesList = [
  'plaintext',
  'Log',
  'log',
  'bat',
  'clojure',
  'coffeescript',
  'jsonc',
  'c',
  'cpp',
  'csharp',
  'css',
  'dockerfile',
  'ignore',
  'fsharp',
  'git-commit',
  'git-rebase',
  'diff',
  'go',
  'groovy',
  'handlebars',
  'hlsl',
  'html',
  'ini',
  'properties',
  'java',
  'javascriptreact',
  'javascript',
  'jsx-tags',
  'json',
  'less',
  'lua',
  'makefile',
  'markdown',
  'objective-c',
  'objective-cpp',
  'perl',
  'perl6',
  'php',
  'powershell',
  'jade',
  'python',
  'r',
  'razor',
  'ruby',
  'rust',
  'scss',
  'shaderlab',
  'shellscript',
  'sql',
  'swift',
  'typescript',
  'typescriptreact',
  'vb',
  'xml',
  'xsl',
  'yaml'
];

let snippets = [];

languagesList.forEach(async (language) => {
  let snippetPath = `../snippets/${language}.json`;
  snippets.push({
    language: language,
    path: snippetPath
  });
  await writeFileSync(snippetPath, '{}');
});

console.log(JSON.stringify(snippets, null, 2));
