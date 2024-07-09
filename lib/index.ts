import Constants from "expo-constants";

const isExpoGo = Constants.appOwnership == "expo";

let exports;
// here we check if the user has properly set up their native app
// if not, we fall back to firebase JS

if (isExpoGo) {
  exports = require("./init");
} else {
  // does not exist
  exports = require("./init.native");
}

module.exports = exports;
