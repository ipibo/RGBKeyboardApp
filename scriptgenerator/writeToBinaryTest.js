const fs = require("fs")

function binaryStringToBuffer(binaryString) {
  const byteLength = Math.ceil(binaryString.length / 8)
  const buffer = Buffer.alloc(byteLength)
  for (let i = 0; i < binaryString.length; i++) {
    const byteIndex = Math.floor(i / 8)
    const bitIndex = i % 8
    const bit = binaryString[i] === "1" ? 1 : 0
    buffer[byteIndex] |= bit << (7 - bitIndex) // Assuming big-endian bit order
  }
  return buffer
}

function saveBinaryDataToFile(binaryString, filePath) {
  const buffer = binaryStringToBuffer(binaryString)
  // Use fs.writeFile to overwrite the file with new data
  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error("Error writing to binary file:", err)
    } else {
      console.log("Binary data written successfully.")
    }
  })
}

// Adjusted binary string for BLUE = 0b000000000000000011111111
const blueBinaryString = "100100111011100110011001"
const outputFilePath = "outputfile.bin"
saveBinaryDataToFile(blueBinaryString, outputFilePath)
