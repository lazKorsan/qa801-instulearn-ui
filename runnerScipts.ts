const TAG = "@EX005LoginTestTC01";

import { execSync } from "child_process";

execSync(`npx cucumber-js --tags "${TAG}"`, {
    stdio: "inherit"
});