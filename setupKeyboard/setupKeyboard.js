let keybrd
let showRects = false

const addingNewKeyboard = false

let allkeyboardloadedData
let img

function preload() {
  keybrd = loadStrings("coords.txt")
  img = loadImage("data/kalibratie.jpg")

  try {
    allkeyboardloadedData = loadJSON("keyboardLayout.json")
  } catch (error) {
    console.log("no data")
  }
}

const offsetOfEachKeyboard = [
  [0, 10],
  [0, 120],
  [734, 13],
  [370, 10],
  [370, 120],
  [727, 118],
  [740, 10],
  [740, 120],
  [0, 230],
]

let allKeyboards = []
let saveButton
let toggelChange

function setup() {
  createCanvas(1400, 500)
  // createCanvas(1150, 250);
  //   createCanvas(750,250);
  background(0)

  if (addingNewKeyboard) {
    offsetOfEachKeyboard.forEach((off) => {
      // console.log(off);
      const tmpKeyboard = new Keyboard(keybrd, off[0], off[1])
      // console.log(tmpKeyboard);
      allKeyboards.push(tmpKeyboard)
    })
  } else {
    console.log()

    var result = Object.keys(allkeyboardloadedData).forEach((key) => {
      console.log(allkeyboardloadedData[key].keyboardArray)
      console.log(allkeyboardloadedData[key].startX)
      console.log(allkeyboardloadedData[key].startY)
      const tmpKeyboard = new Keyboard(
        allkeyboardloadedData[key].keyboardStringArray,
        allkeyboardloadedData[key].startX,
        allkeyboardloadedData[key].startY
      )

      // const tmpKeyboard = allkeyboardloadedData[key]
      // console.log(tmpKeyboard)
      allKeyboards.push(tmpKeyboard)
    })
    // turn allkeyboardloadedData into a array of keyboards
  }

  console.log(allKeyboards)
  saveButton = createButton("save coordinates")
  saveButton.position(10, 800)
  saveButton.mousePressed(saveKeyboard)

  toggleChange = createButton("change coordinates")
  toggleChange.position(150, 800)
  toggleChange.mousePressed(() => {
    showRects = !showRects
  })
}

function draw() {
  background(0)
  image(img, 0, 0)
  // image(img, 0, 0, img.width / 3.25, img.height / 3.25)
  // console.log(img.width / 3.7, img.height / 3.7)

  // console.log(allKeyboards);
  fill(255)
  allKeyboards.forEach((keyboard, i) => {
    // fill(255);
    noFill()
    stroke(255)
    keyboard.keyboardArray.forEach((k) => {
      ellipse(k[0], k[1], 10, 10)
    })

    if (keyboard.enabled) {
      fill(0, 255, 0)
    } else {
      fill(255)
    }

    if (showRects) {
      rect(keyboard.startX, keyboard.startY, keyboard.endX, keyboard.endY)
      fill(0)
      text(
        `${keyboard.startX}, ${keyboard.startY}`,
        keyboard.startX + 3,
        keyboard.startY + 15
      )
      text(i, keyboard.startX + 3, keyboard.startY + 25)
    }
  })
}

class Keyboard {
  constructor(keyboard, startX, startY) {
    this.keyboardStringArray = keyboard
    this.startX = startX
    this.startY = startY
    this.enabled = false

    this.endX = 50
    this.endY = 50

    this.keyboardArray = this.keyboardStringArray.map((k) => {
      const tmp = k.split(" ")
      const xPositionPlusOffset = parseFloat(tmp[0]) + this.startX
      const yPositionPlusOffset = parseFloat(tmp[1]) + this.startY
      return [xPositionPlusOffset, yPositionPlusOffset]
    })
  }

  setNewPositon(newPos) {
    this.startX = this.startX + newPos[0]
    this.startY = this.startY + newPos[1]
    this.keyboardArray = this.keyboardStringArray.map((k) => {
      const tmp = k.split(" ")
      const xPositionPlusOffset = parseFloat(tmp[0]) + this.startX
      const yPositionPlusOffset = parseFloat(tmp[1]) + this.startY
      return [xPositionPlusOffset, yPositionPlusOffset]
    })
  }
}

function mousePressed() {
  allKeyboards.forEach((k) => {
    // check of de muis in het vakje is
    k.enabled = false

    if (mouseX > k.startX && mouseX < k.startX + k.endX) {
      if (mouseY > k.startY && mouseY < k.startY + k.endY) {
        k.enabled = true
      }
    }
  })
}

function mouseDragged(event) {
  let newPos = [event.movementX, event.movementY]

  allKeyboards.forEach((k) => {
    if (k.enabled && showRects) {
      k.setNewPositon(newPos)
    }
  })
}

let keyboards = []

async function saveKeyboard() {
  console.log("save position of the keyboards")
  console.log(allKeyboards)

  let stringToSave = []
  allKeyboards.forEach((keyboard) => {
    keyboard.keyboardArray.forEach((k) => {
      stringToSave.push(`${k[0]} ${k[1]}`)
    })
  })

  const response = await fetch("http://localhost:3000/saveFile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ keyboardLayout: stringToSave, allKeyboards }),
  })

  // saveStrings(stringToSave, "newCoordinates.txt")
}

function keyPressed() {
  if (key === "s") {
    saveKeyboard()
  }

  let newPos = []

  let posChange = false

  if (key === "ArrowUp") {
    newPos = [0, -1]
    posChange = true
  }
  if (key === "ArrowDown") {
    newPos = [0, 1]
    posChange = true
  }
  if (key === "ArrowLeft") {
    newPos = [-1, 0]
    posChange = true
  }
  if (key === "ArrowRight") {
    newPos = [1, 0]
    posChange = true
  }

  if (posChange) {
    allKeyboards.forEach((k) => {
      if (k.enabled && showRects) {
        k.setNewPositon(newPos)
      }
    })
  }

  if (key === " ") {
    showRects = !showRects
  }
}
