export default class Config {

    constructor() {

        this.settings = {
            appName: "Phi",
            version: "0.1.0"
        };

    }

    load() {

        console.log("Config Loaded:", this.settings);

    }

}