const fs = require('node:fs/promises');
// takes 1min 06secs.
// (async () => {
//   console.time("writeMany");
//   const fileHandle = await fs.open("test.txt", "w");
  
//   for (let i = 0; i < 1000000; i++) {
//     await fileHandle.write(` ${i}`);
//   }
//   console.timeEnd("writeMany");
// })();


//takes 3.5 secs, namna gani!
// (async () => {
//   console.time("writeMany");
//   fs.open("test.txt", "w", (err, fd) => {
//   for (let i = 0; i < 1000000; i++) {
//     fs.writeSync(fd, ` ${i}`);
//   }
//   console.timeEnd("writeMany");
//   });
  
// })();
// this implementation sucks btw!!!
// (async () => {
//   console.time("writeMany");
  
//   const fileHandle = await fs.open("test.txt", "w");
  
//   const stream = fileHandle.createWriteStream();
  
//   for (let i = 0; i < 1000000; i++) {
//     const buff = Buffer.from(` ${i} `, "utf-8");
//     stream.write(buff);
//   }
//   console.timeEnd("writeMany");
  
// })();

(async () => {
  console.time("writeMany");
  
  const fileHandle = await fs.open("test.txt", "w");
  
  const stream = fileHandle.createWriteStream();
console.log(stream.writableHighWaterMark);

let i = 0;

const writeMany = () => {
  while (i < 10000000) {
    const buff = Buffer.from(` ${i} `, "utf-8");
    
    if (i === 9999999) {
       return stream.end(buff);
    }
      
    if (!stream.write(buff)) break;
    
    i++;
  }
};

writeMany();

// resume our loop once our stream internal buffer is emptied
stream.on("drain", () => {
    console.log("Draining!!");
  writeMany();
});
  
stream.on("finish", () => {
    console.timeEnd("writeMany");
    fileHandle.close();
});
  
})();