import css from './index.css';

const input = document.getElementById("inputText");
const output = document.getElementById("outputText");
const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const cypherDict = {};

const resetCypherDict = () => {
  alphabet.forEach(letter => cypherDict[letter] = null);
}

const initialise = () => {
  resetCypherDict();
  buildCypherInputs();
  updateRemainingLetters();
}

const updateSelection = ({ target }) => {
  const { anchorOffset, focusOffset } = window.getSelection();
  const start = Math.min(anchorOffset, focusOffset);
  const end = Math.max(anchorOffset, focusOffset);
  if (target.id === "outputText" && end - start === 1) {
    const selectedLetter = [...input.innerText][start];
    document.getElementById(selectedLetter).focus();
  }
  setMark(input, start, end);
  setMark(output, start, end);
}

const clearMarks = () => {
  input.innerHTML = input.innerText;
  output.innerHTML = output.innerText;
}

const setMark = (target, start, end) => {
  if (!target.value) {
    console.log("Noping");
    return;
  }
  const range = document.createRange();
  range.setStart(target.childNodes[0], start);
  range.setEnd(target.childNodes[0], end);
  const mark = document.createElement('mark');
  range.surroundContents(mark);
}

const buildCypherInputs = () => {
  const cypher = document.getElementById("cypher");
  alphabet.forEach(letter => {
    const label = document.createElement("label");
    const labelText = document.createTextNode(letter);
    label.appendChild(labelText);
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", letter);
    input.addEventListener("keyup", updateCypherDict);
    label.appendChild(input);
    cypher.appendChild(label);
  })
}

const updateCypherDict = event => {
  const { id, value } = event.target;
  cypherDict[id] = value.toUpperCase();
  updateOutput();
  updateRemainingLetters();
  updateSortedCypher();
}

const updateRemainingLetters = () => {
  const remaining = [...alphabet].filter(letter => !Object.values(cypherDict).includes(letter));
  const remainingLetters = document.getElementById("lettersRemaining");
  remainingLetters.innerText = remaining.join();
}

const updateOutput = () => {
  output.innerText = [...input.innerText].map(character => {
    // Ignore non-alpha characters
    if (!alphabet.includes(character.toUpperCase())) {
      return character;
    }
    const decoded = cypherDict[character];
    return decoded ? decoded : "-";
  }).join("");
}

const updateSortedCypher = () => {
  const sortedCypher = document.getElementById("sortedCypher");
  sortedCypher.innerHTML = null;
  const sorted = Object.entries(cypherDict)
    .sort((a, b) => {
      return alphabet.indexOf(a[1]) - alphabet.indexOf(b[1])
    })
    .reduce((a, c) => (a[c[0]] = c[1], a), {});
  Object.keys(sorted).forEach(key => {
    const value = sorted[key];
    if (!value) return;
    const pair = document.createElement("div");
    const upper = document.createElement("span");
    const upperText = document.createTextNode(value);
    const lower = document.createElement("span");
    const lowerText = document.createTextNode(key);
    upper.appendChild(upperText);
    lower.appendChild(lowerText);
    pair.appendChild(upper);
    pair.appendChild(lower);
    sortedCypher.appendChild(pair);
  })
}


window.addEventListener("load", initialise);
document.getElementById("inputText").addEventListener("mousedown", clearMarks);
document.getElementById("outputText").addEventListener("mousedown", clearMarks);
document.getElementById("inputText").addEventListener("mouseup", updateSelection);
document.getElementById("outputText").addEventListener("mouseup", updateSelection);
document.getElementById("inputText").addEventListener("input", updateOutput);