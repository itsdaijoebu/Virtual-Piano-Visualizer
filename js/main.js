//ToDo: 
//- make visualizer panels fade when they expire, restart when they're chosen again, and NOT all disappear at once
//- add more background videos
//- add ability to add custom background vids, both upload and via video url
//- make UI and color schemes look better
//- create some color scheme options
//- create customization options for piano/visualizer shape
//- ?allow for having video show by default and playing keys adds panels to obscure it?

//The keyboard keys
// const KEYBOARD_KEYS = ['q', '2', 'w', '3', 'e', 'r', '5', 't', '6', 'y', '7', 'u', 'i', '9', 'o', '0', 'p', '[', '=', ']', 'a', 'z', 's', 'x', 'c', 'f', 'v', 'g', 'b', 'n', 'j', 'm', 'k', ',', 'l', '.', '/']
//keys are lined up in a row
const KEYBOARD_KEYS_CONSECUTIVE = ['z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm', ',', 'l', '.', ':', '/', 'q', '2', 'w', '3', 'e', '4', 'r', 't', '6', 'y', '7', 'u', 'i', '9', 'o', '0', 'p', '-', '[', ']' ]
//splits the keyboard down the middle so left half of computer keyboard controls left half of piano keys and right half of CKeyboard controls right half of PKeyboard
const KEYBOARD_KEYS_SPLIT = ['z', 's', 'x', 'd', 'c', 'v', 'g', 'b', '1', 'q', '2', 'w', 'e', '4', 'r', '5', 't', 'y', 'h', 'n', 'j', 'm', 'k', ',', '.', ';', '/', '7', 'u', 'i', '9', 'o', '0', 'p', '-', '[', ']' ]
const SUSTAIN_PEDAL = ' '
const MAX_KEYS = KEYBOARD_KEYS_SPLIT.length   //total number of keys linked to keyboard keys

//change keyboard control scheme
let keyToggle = document.querySelector('#key-toggle')
let useSplit = true;
let keyboardKeys = KEYBOARD_KEYS_SPLIT;
keyToggle.addEventListener('click', () => {
    useSplit ? keyboardKeys = KEYBOARD_KEYS_SPLIT : keyboardKeys = KEYBOARD_KEYS_CONSECUTIVE;
    useSplit = !useSplit;
    labelKeys();
})

//Key Query Selectors: qs's on keys
let keys = Array.from(document.querySelectorAll('.key'))
let keysText = Array.from(document.querySelectorAll('.key span'))
const whiteKeys = Array.from(document.querySelectorAll('.key.white'))
const blackKeys = Array.from(document.querySelectorAll('.key.black'))
const toggleableText = document.querySelectorAll('.toggleable-text')

//Visualizer Query Selectors: qs's and helper variables on visualizers
const visualizers = Array.from(document.querySelectorAll('.visualizer'))
const visualizerOptions = Array.from(document.querySelectorAll('.visualizer-options'))
const visMatched = document.querySelector('#matched-vis')
const visMatchedRand = document.querySelector('#matched-random-vis')
// const visLargeRandom = document.querySelector('#large-random-vis')
// const visRandom = document.querySelector('#random-vis')

//Visualizer Video Query Selectors and video links
const visVideo = document.querySelector('#visualizer-video')
// const visVideoSrcExternal = document.querySelector('#external-video-src')
const visVideoSrcLocal = document.querySelector('#local-video-src')
const visVideoOptions = document.querySelectorAll('.video-options')

const visVideoLegion = document.querySelector('#legion')
const visVideoLegionSrcLocal = `video/legion-animation-fight.mp4`
// const visVideoLegionSrcExternal = `https://www.googleapis.com/drive/v3/files/1_XKunAVDspt7sKCqgU4zUAA1i8e7O01b?key=AIzaSyCNDWHR4c65LsBdctbQVLeYtEtbeUfdZZk&alt=media`

const visVideoYoI = document.querySelector('#yoi')
const visVideoYoISrcLocal = `video/yoi-eros.mp4`
// const visVideoYoISrcExternal = `https://www.googleapis.com/drive/v3/files/107a2WKTEiHHxgYFe4NS4svb1S8A8i9va?key=AIzaSyCNDWHR4c65LsBdctbQVLeYtEtbeUfdZZk&alt=media`

const visVideoHouseki = document.querySelector('#houseki')
const visVideoHousekiSrcLocal = `video/houseki-no-kuni.mp4`
// const visVideoHousekiSrcExternal = `https://www.googleapis.com/drive/v3/files/1hiTkqryXM1wxsrSJ6YtARQ5bbkW-j80l?key=AIzaSyCNDWHR4c65LsBdctbQVLeYtEtbeUfdZZk&alt=media`

const visVideoArcane = document.querySelector('#arcane')
const visVideoArcaneSrcLocal = `video/arcane-jayce-ryze.mp4`
// const visVideoArcaneSrcExternal = `https://www.googleapis.com/drive/v3/files/1wt1L_tlv-bkR6NGsnvYzA7JPECKezfRr?key=AIzaSyCNDWHR4c65LsBdctbQVLeYtEtbeUfdZZk&alt=media`

const visVideoSpace = document.querySelector('#space')
const visVideoSpaceSrcLocal = `video/space.mp4`
// const visVideoSpaceSrcExternal = `https://www.googleapis.com/drive/v3/files/1Fyn4IQ6P7E_rmkdZJJjSRu7qTPfaGEAw?key=AIzaSyCNDWHR4c65LsBdctbQVLeYtEtbeUfdZZk&alt=media`

const visVideoLeon = document.querySelector('#leon')
const visVideoLeonSrcLocal = `video/leon-vibing.mp4`
// const visVideoLeonSrcExternal = `https://www.googleapis.com/drive/v3/files/1wwGfRSySuNxnNSV6ff9VaEvFCt0ElJBm?key=AIzaSyCNDWHR4c65LsBdctbQVLeYtEtbeUfdZZk&alt=media`

//ensures document fully loads before allowing it to be played
function doOnDocumentLoad() {
    loaderInit()
    carouseslInit()
}

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
// visLargeRandom.addEventListener('click', visualizerSelect)
// visRandom.addEventListener('click', visualizerSelect)

visVideoLegion.addEventListener('click', visVideoSelect)
visVideoYoI.addEventListener('click', visVideoSelect)
visVideoArcane.addEventListener('click', visVideoSelect)
visVideoHouseki.addEventListener('click', visVideoSelect)
visVideoSpace.addEventListener('click', visVideoSelect)
visVideoLeon.addEventListener('click', visVideoSelect)

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
    let keyIndex = keyboardKeys.indexOf(keyboardKey)    //finds the index of the keyboardKey 
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

    let keyIndex = keyboardKeys.indexOf(keyboardKey)

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
    let noteAudio = document.getElementById(key.dataset.note)   //the note to be played

    // quickly fades out the note's audio since it sounds bad if the note cuts out the moment you release the key
    let noteTimer = setInterval(
        function () {
            //clearInterval if key was pressed before note stopped fading, in order to prevent it from stopping the newly-pressed note from also fading
            if (pressedKeys.indexOf(key) > -1) clearInterval(noteTimer)

            let minVol = 0.001
            let fadeSpeed = 0.05
            //prevents noteAudio.volume from going below zero
            if (noteAudio.volume > minVol && noteAudio.volume < fadeSpeed) noteAudio.volume = fadeSpeed

            //when called, causes the note to rapidly fade and deactivate all visualization panels
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

// populates an array that keeps track of notes being held while sustain pedal is active
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
let largeVisPanelSize = 2  //the size of large vis panels

//create and populate a dictionary that matches active vispanels to the keys that activated them
let visPanelKeys = {}
// visualizers.forEach((e, index) => {
//     visPanelKeys[index] = -1
// })
// console.log(`visPanelKeys: ${visPanelKeys['v3']}`)

let visActives = [];    //array to hold active visualizers
function visualizerActivate(index) {
    // call to activate a random number of visualizer panels
    let randomVisualizerPanels = function (panelSize = 1) {
        // // ensure that at least one visPanel is activated
        // // get a random panel's index and activate it, then add it to the array of active panels and associate the panel with the activating piano key's index
        // let randomPanel = getRandomInt(MAX_KEYS)
        // visualizers[randomPanel].classList.add('active')
        // visActives.push(randomPanel)
        // visPanelKeys[randomPanel] = index

        // // panelSize can add additional panels next to the selected random panel to create a larger panel
        // for (let i = 1; i < panelSize; i++) {
        //     if ((randomPanel + panelSize) < visualizers.length) {
        //         visualizers[randomPanel + i].classList.add('active')
        //     } else {
        //         visualizers[randomPanel - i].classList.add('active')
        //     }
        // }

        // same as when the first visPanel was activated, but does it a random number of extra times
        let totalPanels = getRandomInt(10, 1)   //choose a random number of visPanels to activate
        let randomPanel
        for (let i = 0; i < totalPanels; i++) {
            randomPanel = getRandomInt(MAX_KEYS)
            if (visActives.indexOf(randomPanel) > -1) continue

            for (let j = 0; j < panelSize; j++) {   //the large panel option
                // prevent panels from being activated if already active
                visualizers[randomPanel+j].classList.add('active')
                visActives.push(randomPanel+j)
                visPanelKeys[randomPanel+j] = index
            }

            // //large panel option. Not sure if it needs to be separated or not
            // for (let j = 1; j < panelSize; j++) {
            //     if ((randomPanel + panelSize) < visualizers.length) {
            //         visualizers[randomPanel + j].classList.add('active')
            //     } else {
            //         visualizers[randomPanel - j].classList.add('active')

            //     }
            // }
        }
    }

    if (visOptions == 'matched-vis') {
        visualizers[index].classList.add('active')
        visActives.push(index)
        visPanelKeys[index] = index //associates the activated visPanel to the activating piano key's index
    } else if (visOptions == 'matched-random-vis') {
        //does the same as the matched option 
        visualizers[index].classList.add('active')
        visPanelKeys[index] = index
        visActives.push(index)
        visPanelKeys[index] = index
        randomVisualizerPanels()    //activate a random number of extra random visPanels
    } else if (visOptions == 'large-random-vis') {
        randomVisualizerPanels(largeVisPanelSize)   //activate a random number of vis panels that are each larger than normal
    } else if (visOptions == 'random-vis') {
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
        visActives.splice(value, 1)
        // console.log(`panelsToDeactivate[index]: ${panelsToDeactivate[index]}`)
        // visualizers[panelsToDeactivate[index]].classList.remove('active')
    })
}

//Helpers: Helper functions
//Create a random int
function getRandomInt(max, min = 0,) {
    return Math.floor(Math.random() * max + min)
}

//UI: how the ui works
function toggleKeyLetters() {
    // keysText.forEach((key) => key.classList.toggle('hide'))
    toggleableText.forEach(pianoKey => pianoKey.classList.toggle('hide'))
}

function labelKeys() {
    keysText.forEach((key, index) => {
        key.textContent = keyboardKeys[index]
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
    let visVidId = video.target.id
    visVideoOptions.forEach(e => e.classList.remove('active'))
    video.target.classList.add('active')

    if (visVidId == 'legion') {
        // visVideoSrcExternal.src = visVideoLegionSrc
        visVideoSrcLocal.src = visVideoLegionSrcLocal
        visVideo.load()
        // visVideo.play()
    } else if (visVidId == 'yoi') {
        // visVideoSrcExternal.src = visVideoYoISrc
        visVideoSrcLocal.src = visVideoYoISrcLocal
        visVideo.load()
        // visVideo.play()
    } else if (visVidId == 'houseki') {
        // visVideoSrcExternal.src = visVideoHousekiSrc
        visVideoSrcLocal.src = visVideoHousekiSrcLocal
        visVideo.load()
        // visVideo.play()
    } else if (visVidId == 'arcane') {
        // visVideoSrcExternal.src = visVideoArcaneSrc
        visVideoSrcLocal.src = visVideoArcaneSrcLocal
        visVideo.load()
        // visVideo.play()
    } else if (visVidId == 'space') {
        // visVideoSrcExternal.src = visVideoSpaceSrc
        visVideoSrcLocal.src = visVideoSpaceSrcLocal
        visVideo.load()
        // visVideo.play()
    } else if (visVidId == 'leon') {
        // visVideoSrcExternal.src = visVideoLeonSrc
        visVideoSrcLocal.src = visVideoLeonSrcLocal
        visVideo.load()
        // visVideo.play()
    }
}