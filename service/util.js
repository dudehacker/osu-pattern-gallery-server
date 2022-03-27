function upperCaseFirstWord(sentence){
    const words = sentence.split(" ");
    return words.map((word) => { 
        return word[0].toUpperCase() + word.substring(1); 
    }).join(" ");
}

module.exports = {upperCaseFirstWord}