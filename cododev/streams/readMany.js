const fs = require("node:fs/promises");

(async () => {
  const fileHandleRead = await fs.open("test.txt", "r");
  
  const fileHandleWrite = await fs.open("write.txt", "w");
  
  //create highWaterMark chunk
  const streamRead = fileHandleRead.createReadStream({highWaterMark: 64 * 1024});
  
  const streamWrite = fileHandleWrite.createWriteStream();
  
  streamRead.on("data", (chunk) => {
    const numbers = chunk.toString("utf-8").split(" ");
    
    console.log(numbers);
    if (!streamWrite.write(chunk)) {
      streamRead.pause();
    }
    console.log("-------");
    console.log(chunk);
  });
  
  streamWrite.on("drain", () => {
    streamRead.resume()
  })
})();