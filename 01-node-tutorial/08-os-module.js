const os = require("os");

// Get user info
const user = os.userInfo();

console.log(user);

// Gets system uptime (seconds)
const uptime = os.uptime();
console.log(`The System Uptime is ${uptime}`);
