const ancientsMenu = document.querySelector('.ancients-wrapper');
const difficultyMenu = document.querySelector('.difficulty-container');
const playingField = document.querySelector('.playing-field');
const startBtn = document.querySelector('.start-game');
const stageLabel = document.querySelectorAll('.stage-text');
const deck = document.querySelector('.deck');
const avatarAncient = document.querySelector('.avatarAncient');
const frameAncient = document.querySelector('.frameAncient');

const songURL = './assets/backgroundMusic.mp3';
const audioPlayer = document.querySelector('.audio');
const playButton = document.querySelector('.play');
const volumeRange = document.querySelector('#volume-slider');
const player = new Audio(songURL);
let isPlay = true;

let selAnc, selDiff;
let ancID = -1, diffID = -1;
let greenTotal, brownTotal, blueTotal;
let arrayStage = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
let deckFirstStage = [],
    deckSecondStage = [],
    deckThirdStage = [],
    gameDeck = [];
let currentStage;

import ancientsData from './data/ancients.js';

/* Player */
//#region Player 
function playSong() {
    player.currentTime = 0;
    player.volume = volumeRange.value;
    playButton.classList.toggle('pause');
    player.play();
}

document.addEventListener('load', playSong());

function playAudio(pause){
    if (!pause)
        player.play();
    else
        player.pause();        
    isPlay = !pause;
}

playButton.addEventListener('click', function () {
    if (isPlay){
        playButton.classList.toggle('pause');
        playAudio(isPlay);       
    }
    else{
        playButton.classList.toggle('pause');
        playAudio(isPlay);
    }
});

player.addEventListener("loadeddata",() => { 
    player.volume = volumeRange.value;
    },
    false
);

player.addEventListener('ended', () => {
    isPlay = true;
    player.currentTime = 0;
    player.play();
});

volumeRange.addEventListener('change', () => {
    player.volume = volumeRange.value;
});

audioPlayer.querySelector(".volume-button").addEventListener("click", () => {
    const volumeEl = audioPlayer.querySelector(".volume-container .volume");
    player.muted = !player.muted;
    volumeRange.disabled = !volumeRange.disabled;
    if (player.muted) {
        volumeEl.classList.remove("icono-volumeMedium");
        volumeEl.classList.add("icono-volumeMute");
    } else {
        volumeEl.classList.add("icono-volumeMedium");
        volumeEl.classList.remove("icono-volumeMute");
    }
});
//#endregion

/* Ancients */
ancientsMenu.onclick = function (event) {
    let target = event.target;
    if (!target.id) {
        if (selAnc) {
            selAnc.classList.remove('active');
            avatarAncient.className = 'avatarAncient';
            frameAncient.classList.remove('active');
            difficultyMenu.classList.remove('active');
            if (selDiff) {
                selDiff.classList.remove('active');
                startBtn.classList.remove('active');
                playingField.classList.remove('active');
            }
            ancID = -1;
            diffID = -1;
        }
        return;
    }
    selectAncient(target);
}

function selectAncient(ancient) {
    if (selAnc) {
        selAnc.classList.remove('active');
        avatarAncient.className = 'avatarAncient';
        if (selDiff) {
            selDiff.classList.remove('active');
            startBtn.classList.remove('active');
            playingField.classList.remove('active');
        }
    }

    selAnc = ancient;
    selAnc.classList.add('active');
    avatarAncient.classList.add(selAnc.id);
    frameAncient.classList.add('active');
    setSelectedAncID(selAnc.id);
    difficultyMenu.classList.add('active');
}

function setSelectedAncID(id) {
    switch (id) {
        case 'azathoth': ancID = 0; break; 
        case 'cthulhu': ancID = 1; break;
        case 'iogSothoth': ancID = 2; break;
        case 'shubNiggurath': ancID = 3; break;
    }
}

/* Difficulty */
difficultyMenu.onclick = function (event) {
    let target = event.target;
    if (!target.id) {
        if (selDiff) {
            selDiff.classList.remove('active');
            startBtn.classList.remove('active');
            playingField.classList.remove('active');
            diffID = -1;
        }
        return;
    }
    if (target.id != 'start-game')
        selectDifficulty(target);
    else
        newGame(ancID, diffID);
}

function selectDifficulty(difficulty) {
    if (selDiff) {
        selDiff.classList.remove('active');
        playingField.classList.remove('active');
    }

    selDiff = difficulty;
    selDiff.classList.add('active');
    startBtn.classList.add('active');
    setSelectedDiffID(selDiff.id);
}

function setSelectedDiffID(id) {
    switch (id) {
        case 'noob': diffID = 0; break;
        case 'easy': diffID = 1; break;
        case 'normal': diffID = 2; break;
        case 'hard': diffID = 3; break;
        case 'amazing': diffID = 4; break;
    }
}

/* Создание новой колоды */
function newGame(ancID, diffID) {
    playingField.classList.add('active');
    ancientsData.forEach(el => {
        if (el.id === selAnc.id) {
            createTracker(el);
            createDeck(diffID);
        }
    });
}

function createTracker(values) {
    const greenTD = document.querySelectorAll('.dot.green');
    const brownTD = document.querySelectorAll('.dot.brown');
    const blueTD = document.querySelectorAll('.dot.blue');
    let stage, countCard;

    greenTotal = 0;
    brownTotal = 0;
    blueTotal = 0;
    for (let i = 0; i < greenTD.length; i++) {
        switch (i) {
            case 0: stage = 'firstStage'; break;
            case 1: stage = 'secondStage'; break;
            case 2: stage = 'thirdStage'; break;
        }
        countCard = values[stage]['greenCards'];
        greenTD[i].textContent = countCard;
        arrayStage[i][0] = parseInt(countCard);
        greenTotal += countCard;

        countCard = values[stage]['brownCards'];
        brownTD[i].textContent = countCard;
        arrayStage[i][1] = parseInt(countCard);
        brownTotal += countCard;

        countCard = values[stage]['blueCards']
        blueTD[i].textContent = countCard;
        arrayStage[i][2] = parseInt(countCard);
        blueTotal += countCard;
    }
}

function updateTracker() {
    const greenTD = document.querySelectorAll('.dot.green');
    const brownTD = document.querySelectorAll('.dot.brown');
    const blueTD = document.querySelectorAll('.dot.blue');
    for (let i = 0; i < greenTD.length; i++) {
        greenTD[i].textContent = arrayStage[i][0];
        brownTD[i].textContent = arrayStage[i][1];
        blueTD[i].textContent = arrayStage[i][2];
    }
}

import { brownCards, blueCards, greenCards } from './data/mythicCards/index.js';

function createDeck(diffID) {
    currentStage = 1;
    stageLabel[0].classList.remove('done');
    stageLabel[1].classList.remove('done');
    stageLabel[2].classList.remove('done');
    const lastCard = document.querySelector('.last-card');
    lastCard.style.backgroundImage = '';
    deck.classList.remove('done');
    deck.addEventListener('click', openLastCard);
    switch (diffID) {
        case 0: noobGame(); break;
        case 1: easyGame(); break;
        case 2: normalGame(); break;
        case 3: hardGame(); break;
        case 4: amazingGame(); break;
    }    
}

//Получение карт определенной сложности
function getDiffCard(deckCards, currDiff) {
    let result = [];
    deckCards.forEach(el => {
        if (el.difficulty === currDiff) {
            result.push([]);
            result[result.length - 1][0] = el.difficulty;
            result[result.length - 1][1] = el.cardFace;
            result[result.length - 1][2] = el.color;
        }
    });
    return result;
}

//Получение все карты
function getAllCard(deckCards) {
    let result = [];
    deckCards.forEach(el => {
        result.push([]);
        result[result.length - 1][0] = el.difficulty;
        result[result.length - 1][1] = el.cardFace;
        result[result.length - 1][2] = el.color;
    });
    return result;
}

function randomCards(array) {
    array.sort(() => Math.random() - 0.5);
}

function normalizedDeckGame(deckCards, arrayBasic, addDiff, arrayTotal) {
    let arrayAddDiff = [];
    let resultArray = [];

    if (arrayBasic.length >= arrayTotal) {
        randomCards(arrayBasic);
        resultArray = arrayBasic.slice(0, arrayTotal);
        randomCards(resultArray);
    }
    else {
        arrayAddDiff = getDiffCard(deckCards, addDiff);
        randomCards(arrayAddDiff);
        resultArray = arrayBasic.concat(arrayAddDiff.slice(0, arrayTotal - arrayBasic.length));
        randomCards(resultArray);
    }
    return resultArray;
}

function addCardInStageDeck(colorDeck, count) {
    let result = [];
    for (let i = 0; i < count; i++) {
        result.push(colorDeck.pop());
    }
    return result;
}

function createDeckForStage(arrayGreen, arrayBrown, arrayBlue) {
    let res = [];
    for (let i = 0; i < 3; i++) {
        res = res.concat(addCardInStageDeck(arrayGreen, arrayStage[i][0]));
        res = res.concat(addCardInStageDeck(arrayBrown, arrayStage[i][1]));
        res = res.concat(addCardInStageDeck(arrayBlue, arrayStage[i][2]));
        switch (i) {
            case 0: deckFirstStage = res; break;
            case 1: deckSecondStage = res; break;
            case 2: deckThirdStage = res; break;
        }
        res = [];
    }
    randomCards(deckFirstStage);
    randomCards(deckSecondStage);
    randomCards(deckThirdStage);
    gameDeck = deckThirdStage.concat(deckSecondStage, deckFirstStage);
}

function startNewStage() {
    stageLabel[currentStage - 1].classList.add('done');
    currentStage++;
    if (currentStage > 3) {
        deck.classList.add('done');
        deck.removeEventListener('click', openLastCard);
    }
}

function minusCard(color) {
    if (arrayStage[currentStage - 1][color] > 0) {
        arrayStage[currentStage - 1][color]--;
        updateTracker();
        let countCard = arrayStage[currentStage - 1][0] + arrayStage[currentStage - 1][1] + arrayStage[currentStage - 1][1];
        if (countCard == 0)
            startNewStage();
    }
}

function openLastCard() {
    const lastCard = document.querySelector('.last-card');
    let lastArrayElement = gameDeck.pop();
    let colorLastCard = lastArrayElement[2];
    let bgLastCard = lastArrayElement[1].substr(9, lastArrayElement[1].length);
    lastCard.style.backgroundImage = `url(${bgLastCard})`;
    switch (colorLastCard) {
        case 'green': minusCard(0); break;
        case 'brown': minusCard(1); break;
        case 'blue': minusCard(2); break;
    }
}

function noobGame() {
    let greenEasy = getDiffCard(greenCards, 'easy');
    let resultGreen = normalizedDeckGame(greenCards, greenEasy, 'normal', greenTotal);

    let brownEasy = getDiffCard(brownCards, 'easy');
    let resultBrown = normalizedDeckGame(brownCards, brownEasy, 'normal', brownTotal);

    let blueEasy = getDiffCard(blueCards, 'easy');
    let resultBlue = normalizedDeckGame(blueCards, blueEasy, 'normal', blueTotal);

    createDeckForStage(resultGreen, resultBrown, resultBlue);
}

function easyGame() {
    let greenEasy = getDiffCard(greenCards, 'easy');
    randomCards(greenEasy);
    let greenNormal = getDiffCard(greenCards, 'normal');
    randomCards(greenNormal);
    let resultGreen = greenEasy.concat(greenNormal);
    randomCards(resultGreen);

    let brownEasy = getDiffCard(brownCards, 'easy');
    randomCards(brownEasy);
    let brownNormal = getDiffCard(brownCards, 'normal');
    randomCards(brownNormal);
    let resultBrown = brownEasy.concat(brownNormal);
    randomCards(resultBrown);

    let blueEasy = getDiffCard(blueCards, 'easy');
    randomCards(blueEasy);
    let blueNormal = getDiffCard(blueCards, 'normal');
    randomCards(blueNormal);
    let resultBlue = blueEasy.concat(blueNormal);
    randomCards(resultBlue);

    createDeckForStage(resultGreen, resultBrown, resultBlue);
}

function normalGame() {
    let resultGreen = getAllCard(greenCards);
    randomCards(resultGreen);
    let resultBrown = getAllCard(brownCards);
    randomCards(resultBrown);
    let resultBlue = getAllCard(blueCards);
    randomCards(resultBlue);

    createDeckForStage(resultGreen, resultBrown, resultBlue);
}

function hardGame() {
    let greenHard = getDiffCard(greenCards, 'hard');
    randomCards(greenHard);
    let greenNormal = getDiffCard(greenCards, 'normal');
    randomCards(greenNormal);
    let resultGreen = greenHard.concat(greenNormal);
    randomCards(resultGreen);

    let brownHard = getDiffCard(brownCards, 'hard');
    randomCards(brownHard);
    let brownNormal = getDiffCard(brownCards, 'normal');
    randomCards(brownNormal);
    let resultBrown = brownHard.concat(brownNormal);
    randomCards(resultBrown);

    let blueHard = getDiffCard(blueCards, 'hard');
    randomCards(blueHard);
    let blueNormal = getDiffCard(blueCards, 'normal');
    randomCards(blueNormal);
    let resultBlue = blueHard.concat(blueNormal);
    randomCards(resultBlue);

    createDeckForStage(resultGreen, resultBrown, resultBlue);
}

function amazingGame() {
    let greenHard = getDiffCard(greenCards, 'hard');
    let resultGreen = normalizedDeckGame(greenCards, greenHard, 'normal', greenTotal);

    let brownHard = getDiffCard(brownCards, 'hard');
    let resultBrown = normalizedDeckGame(brownCards, brownHard, 'normal', brownTotal);

    let blueHard = getDiffCard(blueCards, 'hard');
    let resultBlue = normalizedDeckGame(blueCards, blueHard, 'normal', blueTotal);

    createDeckForStage(resultGreen, resultBrown, resultBlue);
}