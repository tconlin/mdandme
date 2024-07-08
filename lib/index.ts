import Constants from "expo-constants";
import type { Firebase } from "./db/firebaseTypes";

const isExpoGo = Constants.appOwnership == "expo";

let exports: Firebase;

// here we check if the user has properly set up their native app
// if not, we fall back to firebase JS

if (isExpoGo) {
  exports = require("./init");
} else {
  // does not exist
  exports = require("./init.native");
}

module.exports = exports;
