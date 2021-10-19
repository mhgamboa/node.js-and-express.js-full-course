# Node Tutorial

## Global Variables

- Window does not exist
  - `__dirname` - gives current directory for the script being run
    - `./` gives the directory you ran the node command
  - `__filename` - gives current file name
  - `require` - function to use modules
  - `module` -
  - **`process` ** - Give info about the env (environment) where the program is being executed

## modules & require

- **Modules** help encapsulate your code
  - Every file in node is a module
  - `module.export = {}` to export any variables as part of an object
    - Another Alternative is just to use `module.exports.foo` for every variable you want to export
    - If you envoke a function within the module, the function will still run after it is imported/exported
  - In the file you want to pass the `module.export` to use `const foo = require('./path/name')`
    - ES6: `const {foo, bar} = require('./path/name')`
    - **You will always start the require with a "./"** (dot slash)

## Built in Modules

### OS Module

- This helps us interact with the operating system and the server
- `const os = require("os")`
- `os.userInfo()` -Gives info about user
- `os.upTime()` - Amount of time user's computer has been running
- `os.type()` - Type of OS user is running
- `os.release` - Get OS release version
- `os.freemem()`
- ``os.totalmem()`

### PATH Module

- `const path = require("path")`
- `path.sep` - Tells what the users platform specific seperator is (Windows is the slash /)
- `const filePath = path.join("/folderOne", "folderTwo", fileName.txt)`
  - `console.log(filePath)` would give us "/folderOne/folderTwo/fileName.txt"
- `path.base(filePath)` - extracts the file name from a path
- `path.resolve(__dirname, "folderOne", "folderTwo")` - Takes a sequence of paths, gives us an absolute path

### FS Module

### HTTP Module
