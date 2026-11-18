import { Config } from "@remotion/cli/config";
import fs from "fs";

const chromePath = fs.existsSync("/usr/bin/google-chrome-stable")
  ? "/usr/bin/google-chrome-stable"
  : fs.existsSync("/usr/bin/google-chrome")
  ? "/usr/bin/google-chrome"
  : undefined;

if (chromePath) {
  Config.setBrowserExecutable(chromePath);
}

Config.setChromiumFlags({
  "no-sandbox": true,
  "disable-setuid-sandbox": true,
  "disable-dev-shm-usage": true,
  "disable-gpu": true,
});
Config.setOverwriteOutput(true);
Config.setTimeoutInMilliseconds(120000);
