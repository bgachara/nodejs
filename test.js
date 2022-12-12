const greet = (name) => {
    console.log(`My other name is ${name}`)
}

greet('Geoffrey')

// access to the global object in node

console.log(global)

// access the file paths and file names
console.log(__dirname)
console.log(__filename)

// modules and exports.
// already existing core modules in node i.e os(), fs(file system)

const fs = require ('fs')

// console.log(fs.readFile)

// writing files

fs.writeFile('./doc.txt', "Hellow from Node", () => {
    console.log("File was created")
})

// streams and buffers
// readStream and writeStream
// piping