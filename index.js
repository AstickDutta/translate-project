const fs = require('fs');
const { performance } = require('perf_hooks');

const dictionary = {};

// Read dictionary file and store the words and their translations in the dictionary object
const dictionaryData = fs.readFileSync('french_dictionary.csv', 'utf-8');
const dictionaryLines = dictionaryData.trim().split('\n');

for (const line of dictionaryLines) {
  const [english, french] = line.split(',');
  dictionary[english] = french;
}

const findWordsData = fs.readFileSync('find_words.txt', 'utf-8');
const findWords = findWordsData.trim().split('\n');

const inputText = fs.readFileSync('t8.shakespeare.txt', 'utf-8');

// Regex to match all words in the input text
const wordRegex = /\w+/g;

const replacedWords = {};
let outputText = inputText.replace(wordRegex, (match) => {
  const english = match.toLowerCase();
  if (findWords.includes(english) && dictionary[english]) {
    const french = dictionary[english];
    replacedWords[french] = (replacedWords[french] || 0) + 1;
    return dictionary[english];
  }
  return match;
});

fs.writeFileSync('translated.txt', outputText);

// Output the replaced words and their count
console.log('Replaced words:');
for (const word in replacedWords) {
  console.log(`${word}: ${replacedWords[word]}`);
}

// Output the time taken and memory usage
const startTime = Date.now
const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
const timeTaken = performance.now() - startTime;
console.log(`Time taken: ${timeTaken}ms`);
console.log(`Memory used: ${memoryUsage.toFixed(2)} MB`);
