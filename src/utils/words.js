const getRandomWords = (wordList = [], number = 300) => {
  const shuffledArray = shuffleArray(wordList);
  return shuffledArray.slice(0, number);
};

async function importWords(fileName = "english") {
  const json = await import(`../assets/languages/${fileName}.json`);
  return json;
}

function shuffleArray(array) {
  const arrayCopy = [...array];
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  return arrayCopy;
}

export { getRandomWords, importWords };
