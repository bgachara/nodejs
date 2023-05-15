const fs = require("fs/promises");

(async () => {
  
  //file creator
  const createFile = async (path) => {
    try {
      //we want to check whether ornot we already have that file
      const existingFileHandle = await fs.open(path, "r")
      existingFileHandle.close();
      //we already have that file
      return console.log(`the file ${path} already exists.`);
    } catch (e) {
      //we dont have the file, now create it.
      const newFileHandle = await fs.open(path, "w")
      console.log("A new file was successfully created.")
      newFileHandle.close();
    }    
  };
  
  const deleteFile = async (path) =>  {
    try {
    await fs.unlink(path);
    } catch (e) {
      if (e.code === "ENOENT") {
        console.log("Hakuna kitu kama hiyo buana!!!");
      }else {
        console.log("An error occurred");
      }
    }
  };
  
  //rename a file
  const renameFile = async (oldPath, newPath) => {
      await fs.rename(oldPath, newPath)    
  };
  
  //add to file
  const addFile = async (path, content) => {
    const fileHandle = await fs.open(path, "a");
    fileHandle.write(content);
  };
  //commands
  const CREATE_FILE = "create a file";
  
  const DELETE_FILE = "delete a file";
  
  const RENAME_FILE = "rename a file";
  
  const ADD_TO_FILE = "add to file";

  
  const FileHandler = await fs.open("./command.txt", "r")
  
  FileHandler.on("change", async () => {
      // get the size of our file
      const size = (await FileHandler.stat()).size;
      //allocate our buffer with the size of the file.
      const buff = Buffer.alloc(size);
      //the location at which we want to start filling our buffer
      const offset = 0;
      //how many bytes we want to read
      const length = buff.byteLength;
      //the position we want to start reading the file from.
      const position = 0;
      //read whole file
      await FileHandler.read(buff,offset,length,position);
    
      const command = buff.toString("utf-8");
    //  console.log(await FileHandler.stat());
    
    //create a file
    
    if(command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }
    
    //delete a file
    if(command.includes(DELETE_FILE)){
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }
    
    //rename a file
    if(command.includes(RENAME_FILE)) {
      const idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, idx);
      const newFilePath = command.substring(idx + 4);
      renameFile(oldFilePath, newFilePath);
    }
    
    //add to a file
    if(command.includes(ADD_TO_FILE)){
      const idx = command.indexOf(" this content: ")
      const filePath = command.substring(ADD_TO_FILE.length + 1);
      const content = command.substring(idx + 15)
      addFile(filePath, content);
    }
      
  })
  
  
  const watcher = fs.watch("./command.txt");
  
  for await (const event of watcher) {
    if (event.eventType === "change") {
      FileHandler.emit("change");      
  }
    }
})();