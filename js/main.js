//ToDo: 
//- make visualizer panels fade when they expire, restart when they're chosen again, and NOT all disappear at once
//- add more background videos
//- add ability to add custom background vids, both upload and via video url
//- make UI and color schemes look better
//- create some color scheme options
//- create customization options for piano/visualizer shape
//- ?allow for having video show by default and playing keys adds panels to obscure it?

//The keyboard keys
const KEYBOARD_KEYS = ['q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u', 'i', '9', 'o', '0', 'p', '[', '=', ']', 'a', 'z', 's', 'x', 'c', 'f', 'v', 'g', 'b', 'n', 'j', 'm', 'k', ',', 'l', '.', '/']
const SUSTAIN_PEDAL = ' '
const MAX_KEYS = KEYBOARD_KEYS.length   //total number of keys linked to keyboard keys

//Key Query Selectors: qs's on keys
let keys = Array.from(document.querySelectorAll('.key'))
let keysText = Array.from(document.querySelectorAll('.key span'))
const whiteKeys = Array.from(document.querySelectorAll('.key.white'))
const blackKeys = Array.from(document.querySelectorAll('.key.black'))

//Visualizer Query Selectors: qs's and helper variables on visualizers
const visualizers = Array.from(document.querySelectorAll('.visualizer'))
const visualizerOptions = Array.from(document.querySelectorAll('.visualizer-options'))
const visMatched = document.querySelector('#matched-vis')
const visMatchedRand = document.querySelector('#matched-random-vis')
const visRandom = document.querySelector('#random-vis')

//Visualizer Video Query Selectors
const visVideo = document.querySelector('#visualizer-video')
const visVideoOptions = document.querySelectorAll('.video-options')
const visVideoAvengers = document.querySelector('#avengers')
const visVideoLegion = document.querySelector('#legion')
const visVideoYoI = document.querySelector('#yoi')

//sets the default visualizer option
let visOptions = 'matched-random-vis'
visMatchedRand.classList.add('active')

let visVid = visVideoLegion.id
visVideoLegion.classList.add('active')

//UIElements
//toggle letters on keyboard keys
const letterToggle = document.querySelector('#letter-toggle')
letterToggle.addEventListener('click', toggleKeyLetters)

//Visualizer Options
visMatched.addEventListener('click', visualizerSelect)
visMatchedRand.addEventListener('click', visualizerSelect)
visRandom.addEventListener('click', visualizerSelect)

visVideoAvengers.addEventListener('click', visVideoSelect)
visVideoLegion.addEventListener('click', visVideoSelect)
visVideoYoI.addEventListener('click', visVideoSelect)

//Sustain Variables: variables and logic for the sustain pedal
let sustain = false //whether or not the sustain pedal is being held down
let sustainKeys = []    //keys being sustained, so they can be released along with the sustain pedal
let sustainKeyIndexes = []  //the keyIndexes of sustained keys

const sustainButton = document.querySelector('#sustain')
sustainButton.addEventListener('click', () => sustain ? releaseSustain() : pressSustain())

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

//Piano Key Functions: affects how the piano keys work when pressed, released, etc
let pressedKeys = []
function pressKey(e) {
    let keyboardKey = e.key

    if (keyboardKey == SUSTAIN_PEDAL && e.target == document.body) {
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
    }

    //sustain pedal
    if (keyboardKey == SUSTAIN_PEDAL) {
        pressSustain()
    }
}

function releaseKey(e) {
    let keyboardKey = e.key //keyboard key linked to (presumably keyup) event

    //releasing the sustain pedal releases all sustained notes
    if (keyboardKey === SUSTAIN_PEDAL) {
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

//Note Functions: functions that affect how notes are played, stopped, etc
function playNote(key, index) {
    let noteAudio = document.getElementById(key.dataset.note)
    noteAudio.currentTime = 0
    noteAudio.volume = 1
    noteAudio.play()
    key.classList.add('active')
    visualizerActivate(index)

    noteAudio.addEventListener('ended', () => {
        key.classList.remove('active')
        visualizerDeactivate(index)
    })

}

function stopNote(key, index) {
    let noteAudio = document.getElementById(key.dataset.note)

    let noteTimer = setInterval(
        function () {
            //clearInterval if key was pressed before note stopped fading, in order to prevent it from stopping the newly-pressed note from also fading
            if (pressedKeys.indexOf(key) > -1) clearInterval(noteTimer)

            let minVol = 0.001
            let fadeSpeed = 0.05
            //prevents noteAudio.volume from going below zero
            if (noteAudio.volume > minVol && noteAudio.volume < fadeSpeed) noteAudio.volume = fadeSpeed

            //when called, causes the note to rapidly fade and stop all visualizations
            if (noteAudio.volume > minVol) {
                noteAudio.volume -= fadeSpeed
            } else {
                // noteAudio.volume = 0
                noteAudio.pause()
                key.classList.remove('active')
                visualizerDeactivate(index)

                clearInterval(noteTimer)
            }
        }, 1)
}

//Sustain Functions: what happens when the sustain pedal is pressed, held, released, etc
function pressSustain() {
    sustain = true
    sustainButton.classList.add('active')

}

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



//Visualizer Functions: logic for how the visualizer works 
//create and populate a dictionary that matches active vispanels to the keys that activated them
let visPanelKeys = {}
// visualizers.forEach((e, index) => {
//     visPanelKeys[index] = -1
// })
// console.log(`visPanelKeys: ${visPanelKeys['v3']}`)

let visActives = [];    //array to hold active visualizers
function visualizerActivate(index) {
    // call to activate a random number of visualizer panels
    let randomVisualizerPanels = function () {
        // ensure that at least one visPanel is activated
        // get a random panel's index and activate it, then add it to the array of active panels and associate 
        // the panel with the activating piano key's index
        let randomPanel = getRandomInt(MAX_KEYS - 1)
        visualizers[randomPanel].classList.add('active')
        visActives.push(randomPanel)
        visPanelKeys[randomPanel] = index

        // same as when the first visPanel was activated, but does it a random number of extra times
        let otherPanels = getRandomInt(10)   //choose a random number of visPanels to activate
        for (let i = 1; i < otherPanels; i++) {
            randomPanel = getRandomInt(MAX_KEYS - 1)
            // prevent panels from being activated if already active
            if (visActives.indexOf(randomPanel) > -1) continue
            visualizers[randomPanel].classList.add('active')
            visActives.push(randomPanel)
            visPanelKeys[randomPanel] = index
        }
    }

    if (visOptions == 'matched-vis') {
        visualizers[index].classList.add('active')
        visActives.push(index)
        visPanelKeys[index] = index //associates the activated visPanel to the activating piano key's index
    }
    else if (visOptions == 'matched-random-vis') {
        //does the same as the matched option 
        visualizers[index].classList.add('active')
        visPanelKeys[index] = index
        visActives.push(index)
        visPanelKeys[index] = index

        randomVisualizerPanels()    //activate a random number of extra random visPanels
    }
    else if (visOptions == 'random-vis') {
        randomVisualizerPanels()    //activate a random number of visPanels
    } else {
        console.log(`visOptions didn't activate. Currently set to ${visOptions}`)
    }
}

function visualizerFade() {
    // get some sort of reference to a recently-deactivated panel to fade


    // fade the panel via its alpha (probably with a setInterval)
}

function visualizerDeactivate(keyIndex) {
    let panelsToDeactivate = []     //holds the panels that we're deactivating


    // determine which visPanels are associated with the piano key that's been released
    Object.keys(visPanelKeys).forEach(key => {
        if (visPanelKeys[key] == keyIndex) panelsToDeactivate.push(key)
    })

    // deactivate visPanels associated with released piano key
    panelsToDeactivate.forEach(value => {
        visualizers[value].classList.remove('active')
        // console.log(`panelsToDeactivate[index]: ${panelsToDeactivate[index]}`)
        // visualizers[panelsToDeactivate[index]].classList.remove('active')
    })

    // //Wipes out all visualizer panel actives
    // visActives.forEach(index =>
    //     visualizers[index].classList.remove('active'))
    // visActives.length = 0
}

//Helpers: Helper functions
//Create a random int
function getRandomInt(max) {
    return Math.floor(Math.random() * max + 1)
}

//UI: how the ui works
function toggleKeyLetters() {
    keysText.forEach((key) => key.classList.toggle('hide'))
}

function labelKeys() {
    keysText.forEach((key, index) => {
        key.textContent = KEYBOARD_KEYS[index]
    })
}

//changes the color of the button for the active visualizer type
function visualizerSelect(visualizerType) {
    visOptions = visualizerType.target.id
    visualizerOptions.forEach(v => v.classList.remove('active'))
    visualizerType.target.classList.add('active')

}

//Video: select the video that plays in the background of the piano
function visVideoSelect(video) {
    visVid = video.target.id
    console.log(visVid)
    visVideoOptions.forEach(e => e.classList.remove('active'))
    video.target.classList.add('active')

    if(visVid == 'legion') {
        visVideo.src = "../video/david-farouk-blue-eyes-fight.mp4"
    } else if(visVid == 'avengers'){
        visVideo.src = "../video/stark-death.mp4"
    } else if(visVid == 'yoi'){
        visVideo.src = "../video/yoi-eros.mp4"
    }
}