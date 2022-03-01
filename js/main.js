//The keyboard keys
const KEYS = ['q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u', 'i', '9', 'o', '0', 'p', '[', '=', ']', 'a', 'z', 's', 'x', 'c', 'f', 'v', 'g', 'b', 'n', 'j', 'm', 'k', ',', ';', '.', '/']

const MAX_KEYS = KEYS.length   //total number of keys

let keys = document.querySelectorAll('.key')
let keysText = document.querySelectorAll('.key span')
const whiteKeys = document.querySelectorAll('.key.white')
const blackKeys = document.querySelectorAll('.key.black')
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

function pressKey(e) {
    let key = e.key

    if (key == ' ' && e.target == document.body) {
        e.preventDefault()
    }

    if (e.repeat) return
    console.log('press key')

    let keyIndex = KEYS.indexOf(key)
    // const whiteKeyIndex = WHITE_KEYS.indexOf(key)
    // const blackKeyIndex = BLACK_KEYS.indexOf(key)

    if (keyIndex > -1) playNote(keys[keyIndex], keyIndex)
    // if(whiteKeyIndex > -1) playNote(whiteKeys[whiteKeyIndex], whiteKeyIndex)
    // if(blackKeyIndex > -1) playNote(blackKeys[blackKeyIndex], blackKeyIndex)

    //sustain pedal
    if (key == ' ') {
        sustain = true
    }
}

function releaseSustain() {
    sustain = false
    for (let i = 0; i < sustainKeys.length; i++) {
        stopNote(sustainKeys[i], sustainKeyIndexes[i])
    }
    //clears the array of keys being sustained
    sustainKeys.length = 0;
    sustainKeyIndexes.length = 0;
}


function releaseKey(e) {
    console.log('release key')
    let key = e.key

    //releasing the sustain pedal releases all sustained notes
    if (key === ' ') {
        releaseSustain()
        // sustain = false
        // for (let i = 0; i < sustainKeys.length; i++) {
        //     stopNote(sustainKeys[i], sustainKeyIndexes[i])
        // }
        // //clears the array of keys being sustained
        // sustainKeys.length = 0;
        // sustainKeyIndexes.length = 0;
    }

    let keyIndex = KEYS.indexOf(key)

    if (keyIndex > -1) {
        //stores notes that are being sustained so they can be released along with the sustain pedal
        if (sustain) {
            sustainPedal(keyIndex)
            // sustainKeys.push(keys[keyIndex])
            // sustainKeyIndexes.push(keyIndex)
            // console.log(`sustainKeys: ${sustainKeys}`)
            // console.log(`sustainKeyIndexes: ${sustainKeyIndexes}`)
        } else {
            stopNote(keys[keyIndex], keyIndex)
        }
    }
}

function releaseMouse(key, index) {
    if (sustain) {
        sustainPedal(index)
        console.log(`mouserelease key: ${key} mouserelease index: ${index}`)
    } else {
        stopNote(key, index)
    }
}

function sustainPedal(keyIndex) {
    sustainKeys.push(keys[keyIndex])
    sustainKeyIndexes.push(keyIndex)
    console.log(`sustainKeys: ${sustainKeys}`)
    console.log(`sustainKeyIndexes: ${sustainKeyIndexes}`)
}

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
    // console.log("stop note logged")

    let noteTimer = setInterval(
        function () {
            let minVol = 0.001
            let fadeSpeed = 0.05
            //prevents noteAudio.volume from going below zero
            if (noteAudio.volume > minVol && noteAudio.volume < fadeSpeed) noteAudio.volume = fadeSpeed

            //when called, causes the note to rapidly fade and stop all visualizations
            if (noteAudio.volume > minVol) {
                noteAudio.volume -= fadeSpeed
                // console.log("note volume: " + noteAudio.volume)
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

//decides how the visualizer works 
let visActives = [];
function visualizerActivate(index) {
    if (visOptions == 'matched') {
        visualizers[index].classList.add('active')
        visActives.push(index)
    }
    else if (visOptions == 'matchedRand') {
        visualizers[index].classList.add('active')
        visActives.push(index)

        let otherPanels = getRandomInt(10)
        for (let i = 0; i < otherPanels; i++) {
            let randomPanel = getRandomInt(MAX_KEYS-1)
            visualizers[randomPanel].classList.add('active')
            visActives.push(randomPanel)
        }
    }
    else if (visOptions == 'random') {
        let otherPanels = getRandomInt(10)
        for (let i = 0; i < otherPanels; i++) {
            let randomPanel = getRandomInt(MAX_KEYS-1)
            visualizers[randomPanel].classList.add('active')
            visActives.push(randomPanel)
            console.log(`random panel: ${randomPanel}`)
        }
    } else {
        console.log(`visOptions didn't activate. Currently set to ${visOptions}`)
    }

}

function getRandomInt(max) {
    return Math.floor(Math.random() * max + 1)
}

function visualizerDeactivate() {
    visActives.forEach(index =>
        visualizers[index].classList.remove('active'))
    visActives.length = 0
}

function labelKeys() {
    keysText.forEach((key, index) => {
        key.textContent = KEYS[index]
    })
}

function toggleKeyLetters() {
    keysText.forEach((key) => key.classList.toggle('hide'))
}