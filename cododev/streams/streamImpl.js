const fs = require("node:fs");
const { Writable } = require("node:stream");
// (async () => {
  
//   const srcFile = await fs.open("test.txt", "r");
//   const destFile = await fs.open("text-copy.txt", "w");
  
//   let bytesRead = -1;
  
//   while (bytesRead !==0){    
//     const readResult = await srcFile.read();
//     bytesRead = readResult.bytesRead;
    
//     destFile.write(readResult.buffer);
//   }
  
// })();

class FileWriteStream extends Writable{
  constructor ({highWaterMark, fileName}) {
    super({highWaterMark});
    
    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunksSize = 0;
    this.writesCount = 0;
  }
  
  //run the constructor, and will put off all calling the other methods until we call the callback function
  _construct(callback) {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        //if we call the callback with an argument, means we have an error and stop
        callback(err);
      } else {
        this.fd = fd;
        //no argument means it was successful
        callback();
      }
    });
  }
  
  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;
    
    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err)
        }
        this.chunks = []
        this.chunksSize = 0;
        ++this.writesCount;
        callback();
      })
    }else {
    
    callback();
  }
}
  
  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);
      
      this.chunks = [];
      callback();
    })
  }
  
  _destroy(error, callback) {
    console.log("Number of writes:", this.writesCount);
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err || error);
      });
    } else {
      callback(error);
    }
  }
}

const stream = new FileWriteStream({highWaterMark: 1800, fileName:"text.txt",});
stream.write(Buffer.from("this is some string."));
stream.end(Buffer.from("Our last write"));
stream.on("finish", () => {
  console.log("Stream was finished")
});
