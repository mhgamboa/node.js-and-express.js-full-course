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

- `const fs = require("fs");`

#### synchronously (Blocking)

- `fs.readFileSync("./path/first.txt", "utf8")` - Lets you read files
- `fs.writeFileSync("./path/file.txt", "What to write")` - If file doesn't exist: creates a new file. If it does it overwrites the file completely
  - If you want to append to the file add a third argument: `{flag: "a"}`

#### asynchronously (Non-Blocking)

- `fs.readFile("./path/first.txt", (err,"<encoding>", result)=>{})` - Lets you read files asynchronously. EXAMPLE:

```
readFile("./file/path.txt", "utf8", (err, result) => {
if (err) {
  console.log(err);
  return; // returns null
}
console.log(result)
})
```

- `fs.writeFile("./path/file.txt", "What to write", (err, result)=>{})` - If file doesn't exist: creates a new file. If it does it overwrites the file completely. All asynchrounously
  - If you want to append to the file add a third argument: `{flag: "a"}`
  - EXAMPLE:

```
writeFile("./file/path.txt", "what to write", (err, result) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(result);
})
```

### HTTP Module

- `const http = require("http")`
- `const server = http.creatServer((req, res) => {})` Creates a web server. All web servers do is listen for requests. EXAMPLE:

```
`const server = http.creatServer((req, res) => {
  res.write("Hello World");
  res.end;
})`
```

- `server.listen(5000, ()=>{})`
  - Navigating to `localhost:5000` will show us whatever response that we wrote
- `req.url` is from the first foward slash(/) on after the ".com"

## NPM

- People say "package", "module", and "dependency", but they all mean the same thing
- The higher the weekly downloads, the more reliable a package will be
- Dependency version go: BreakingChanges.MinorChanges.Patches (EX: 3.4.1)

### NPM Commands

- `npm --v` - gets version
- `npm i <packageName>` - install package locally
- `npm install -g <packageName>` - Global install to use for any project
  - Becuase of **npx** this is becoming less and less necessary
  - npx essentially lets you run a CLI tool without the need for a global dependency
- `npm i <packageName> --save-dev` OR `-D` - Saves as a dev dependency (not used in build)
- With backend you'll always want to install **nodemon** into your project
- Uninstall packages:
  - `npm uninstall <packageName>`
  - **Nuclear delete**: Delete `nod_modules` folderd and `package-lock.json`. Delete `<packageName>` from `dependencies`

### package.json

- **package.json** - A manifest file that stores important info about our project/package
  - `npm init` (step by step q&a to create package.json)
  - `npm init -y` sets up everything default

-**Scripts**: Scripts are just an easy way to run node & npm commands. EXAMPLE:

```
"scripts": {
    "start": "node app.js", // Runs with "npm start"
    "dev": "nodemon app.js" // Runs with "npm run dev"
  },
```

-**package-lock.json** tracks the versions of dependencies of our dependencies

## Important Topics

### **Event Loop**

- Javascript is single threaded and synchronous. The event loop is pretty much how Javascript hands off code to other "things" to make it asynchronous
- Javascript will then run the rest of the code in the file, and then take back the items from the event loop at the end

### Working Asynchronous

- Promise:
  - `new Promise (resolve, reject)=>{ reject(foo) resolve(bar)}`
  - `foo` is the error object if an error has occurred
  - `bar` is the value if the function runs properly
  - Promises need to have ` ` and `.then` to handle errors and successes respectively
- async/await:

```
const function = async () => {
  try {
    await fetch()
  } catch(error) {
    console.log(error)
  }
}
```

- `try{}` - Lets you test a block of code for errors
- `catch{}` - Lets you handle the error
- `throw{}` - Lets you create custom errors
- `finally{}` - Lets you execute code after `try{}` and `catch{}` regardless of the result

### util module

- `const util = require("util")`
- `util.promisify(function)`
  - From what I'm gathering it lets you convert functions into promises. Not sure why you want to do this

## Events Emitter

- `const EventEmitter = require("events");`
- `const customEmitter = new EventEmitter()`
- `customEmitter.on("nameOfEvent", (param1, param2)=>{})` Listens for events. Needs `customEmitter.emit()` to run the function
  - You can use multiple `customEmitter.on()` with the same `nameOfEvent`
- `customEmitter.emit("nameOfEvent", param1, param2)` Emits events
  - this must come after the ``customEmitter.on()` method. **Order matters!**
- **Many module functions are descendants of the events module. That is why you can use the `.on()` method so much outside of the events module** (Which lets them listen for events)

## Streams

- **Streams are generally used with big data**
- Readable
  - Options:
    - `{highWaterMark: 90000}` changes the size fo the readstream (It's 64kb by default)
    - `{encoding: "utf8"}` - You'll need this to make the stream human readable
    - `{}`
  - EXAMPLE:

```
const { createReadStream } = require("fs");
const stream = createReadStream(./path/to/large/data.txt, {<Options>});
stream.on("data", (chunk) => {
  console.log(chunk);
  fileStream.pipe(res) // Sends data in chunks, not one massive file
});

stream.on("error", err => console.log(err))
```

- Writeable
- Duplex
- Transform

## HTTP Messages

- Both Have:
  - Optional **Headers** that have all the meta info. Dislayed in key-value pairs
  - Optional **Body** is any data you want to provide or receive. Also call the **Payload**
  - **URL**
  - **Status Code**
- Request Messages: what the user is sending
- Response - What we give the user
  - Content-Type is an important key value pair.
    - `content-type: text/html` is used to send html
    - `content-type: applicatoin/json` is used to send data

## HTTP Methods

- **Post** - **C**reate Data
- **Get** - **R**ead data
- **Put** - **U**pdate Data
- **Delete** - **D**elete Data
