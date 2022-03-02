//ToDo: 
//- make visualizer panels fade when they expire, restart when they're chosen again, and NOT all disappear at once

//The keyboard keys
const KEYBOARD_KEYS = ['q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u', 'i', '9', 'o', '0', 'p', '[', '=', ']', 'a', 'z', 's', 'x', 'c', 'f', 'v', 'g', 'b', 'n', 'j', 'm', 'k', ',', 'l', '.', '/']

const MAX_KEYS = KEYBOARD_KEYS.length   //total number of keys linked to keyboard keys

//queryselectors on keys
let keys = document.querySelectorAll('.key')
let keysText = document.querySelectorAll('.key span')
const whiteKeys = document.querySelectorAll('.key.white')
const blackKeys = document.querySelectorAll('.key.black')

//queryselectors on visualizers
const visualizers = document.querySelectorAll('.visualizer')
const visualizerOptions = document.querySelectorAll('.visualizerOptions')
const visMatched = document.querySelector('#matched-vis')
const visMatchedRand = document.querySelector('#matched-random-vis')
const visRandom = document.querySelector('#random-vis')
let visOptions = 'matched'

//extra UI elements
//toggle letters on keyboard keys
const letterToggle = document.querySelector('#letter-toggle')
letterToggle.addEventListener('click', toggleKeyLetters)

//visualizer options
visMatched.addEventListener('click', () => visOptions = 'matched')
visMatchedRand.addEventListener('click', () => visOptions = 'matchedRand')
visRandom.addEventListener('click', () => visOptions = 'random')

//variables and logic for the sustain pedal
let sustain = false //whether or not the sustain pedal is being held down
let sustainKeys = []    //keys being sustained, so they can be released along with the sustain pedal
let sustainKeyIndexes = []  //the keyIndexes of sustained keys

const sustainButton = document.querySelector('#sustain')
sustainButton.addEventListener('click', () => sustain ? releaseSustain() : (sustain = true))

//label keys. Later, maybe add the ability to shift octaves
labelKeys();

// Plays notes on mousedown, releases them on mouseup
keys.forEach((key, index) => {
    key.addEventListener('mousedown', () => playNote(key, index))
})

keys.forEach((key, index) => {
    key.addEventListener('mouseup', () => releaseMouse(key, index))
})

//Plays notes on keydown, releases them on keyup
document.addEventListener('keydown', pressKey)
document.addEventListener('keyup', releaseKey)

let pressedKeys = []
function pressKey(e) {
    let keyboardKey = e.key

    if (keyboardKey == ' ' && e.target == document.body) {
        e.preventDefault()
    }

    // if (e.repeat) return
    let keyIndex = KEYBOARD_KEYS.indexOf(keyboardKey)    //finds the index of the keyboardKey 
    // const whiteKeyIndex = WHITE_KEYS.indexOf(key)
    // const blackKeyIndex = BLACK_KEYS.indexOf(key)

    if (pressedKeys.indexOf(keys[keyIndex]) > -1) return


    if (keyIndex > -1) {
        playNote(keys[keyIndex], keyIndex)
        // if(whiteKeyIndex > -1) playNote(whiteKeys[whiteKeyIndex], whiteKeyIndex)
        // if(blackKeyIndex > -1) playNote(blackKeys[blackKeyIndex], blackKeyIndex)
        pressedKeys.push(keys[keyIndex])
        console.log(`keys[keyIndex], keyIndex: ${keys[keyIndex]}, ${keyIndex}`)
    }

    //sustain pedal
    if (keyboardKey == ' ') {
        sustain = true
        sustainButton.classList.add('active')
    }
}

function releaseKey(e) {
    let keyboardKey = e.key //keyboard key linked to (presumably keyup) event

    //releasing the sustain pedal releases all sustained notes
    if (keyboardKey === ' ') {
        releaseSustain()
        // sustain = false
        // for (let i = 0; i < sustainKeys.length; i++) {
        //     stopNote(sustainKeys[i], sustainKeyIndexes[i])
        // }
        // //clears the array of keys being sustained
        // sustainKeys.length = 0;
        // sustainKeyIndexes.length = 0;
    }

    let keyIndex = KEYBOARD_KEYS.indexOf(keyboardKey)

    if (keyIndex > -1) {
        

        //stores notes that are being sustained so they can be released along with the sustain pedal
        if (sustain) {
            sustainActive(keyIndex)
            // sustainKeys.push(keys[keyIndex])
            // sustainKeyIndexes.push(keyIndex)
            // console.log(`sustainKeys: ${sustainKeys}`)
            // console.log(`sustainKeyIndexes: ${sustainKeyIndexes}`)
        } else {
            stopNote(keys[keyIndex], keyIndex)
        }

        //remove key from pressedKeys to allow it to be played again
        let keyToRemoveIndex = pressedKeys.indexOf(keys[keyIndex])
        if (keyToRemoveIndex > -1) pressedKeys.splice(keyToRemoveIndex, 1)
    }
}

function releaseMouse(key, index) {
    if (sustain) {
        sustainActive(index)
    } else {
        stopNote(key, index)
    }
}


//Logic to play and stop notes
function playNote(key, index) {
    let noteAudio = document.getElementById(key.dataset.note)
    noteAudio.currentTime = 0
    noteAudio.volume = 1
    noteAudio.play()
    key.classList.add('active')
    visualizerActivate(index)

    noteAudio.addEventListener('ended', () => {
        key.classList.remove('active')
        visualizerDeactivate()
    })
}

function stopNote(key, index) {
    let noteAudio = document.getElementById(key.dataset.note)

    let noteTimer = setInterval(
        function () {
            //clearInterval if key was pressed before note stopped fading, in order to prevent it from stopping the newly-pressed note from also fading
            if(pressedKeys.indexOf(key) > -1) clearInterval(noteTimer)

            let minVol = 0.001
            let fadeSpeed = 0.05
            //prevents noteAudio.volume from going below zero
            if (noteAudio.volume > minVol && noteAudio.volume < fadeSpeed) noteAudio.volume = fadeSpeed

            //when called, causes the note to rapidly fade and stop all visualizations
            if (noteAudio.volume > minVol) {
                noteAudio.volume -= fadeSpeed
            } else {
                // console.log('end volume: ' + noteAudio.volume)
                // noteAudio.volume = 0
                noteAudio.pause()
                key.classList.remove('active')
                visualizerDeactivate()

                clearInterval(noteTimer)
            }
        }, 1)
}

// logic for the sustain pedal
function sustainActive(keyIndex) {
    sustainKeys.push(keys[keyIndex])
    sustainKeyIndexes.push(keyIndex)
}

function releaseSustain() {
    sustain = false
    for (let i = 0; i < sustainKeys.length; i++) {
        stopNote(sustainKeys[i], sustainKeyIndexes[i])
    }
    //clears the array of keys being sustained
    sustainKeys.length = 0;
    sustainKeyIndexes.length = 0;
    sustainButton.classList.remove('active')
}

//logic for how the visualizer works 
let visActives = [];
function visualizerActivate(index) {

    let randomVisualizerPanels = function () {
        let otherPanels = getRandomInt(10)
        for (let i = 0; i < otherPanels; i++) {
            let randomPanel = getRandomInt(MAX_KEYS - 1)
            visualizers[randomPanel].classList.add('active')
            visActives.push(randomPanel)
        }
    }

    if (visOptions == 'matched') {
        visualizers[index].classList.add('active')
        visActives.push(index)
    }
    else if (visOptions == 'matchedRand') {
        visualizers[index].classList.add('active')
        visActives.push(index)

        let otherPanels = getRandomInt(10)
        for (let i = 0; i < otherPanels; i++) {
            randomVisualizerPanels()
        }
    }
    else if (visOptions == 'random') {
        randomVisualizerPanels()
    } else {
        console.log(`visOptions didn't activate. Currently set to ${visOptions}`)
    }
}

function visualizerDeactivate() {
    visActives.forEach(index =>
        visualizers[index].classList.remove('active'))
    visActives.length = 0
}

//Create a random int
function getRandomInt(max) {
    return Math.floor(Math.random() * max + 1)
}

function labelKeys() {
    keysText.forEach((key, index) => {
        key.textContent = KEYBOARD_KEYS[index]
    })
}

function toggleKeyLetters() {
    keysText.forEach((key) => key.classList.toggle('hide'))
}