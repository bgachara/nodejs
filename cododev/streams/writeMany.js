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

(async () => {
  console.time("writeMany");
  
  const fileHandle = await fs.open("test.txt", "w");
  
  const stream = fileHandle.createWriteStream();
  
  for (let i = 0; i < 1000000; i++) {
    const buff = Buffer.from(` ${i} `, "utf-8");
    stream.write(buff);
  }
  console.timeEnd("writeMany");
  
})();
