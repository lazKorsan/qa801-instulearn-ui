const TAG = "@ST001LylRegisterTC01";

import { execSync } from "child_process";

execSync(`npx cucumber-js --tags "${TAG}"`, {
    stdio: "inherit"
});