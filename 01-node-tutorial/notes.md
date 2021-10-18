# Node Tutorial

## Global Variables

- Window does not exist
  - `__dirname` - gives current directory
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
