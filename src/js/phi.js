import Config from "./config.js";
import Router from "./router.js";
import State from "./state.js";
import Events from "./events.js";
import Render from "./render.js";
import Components from "./components.js";
import View from "./view.js";
import API from "./api.js";
import Providers from "./providers.js";

class PhiApp {

    constructor() {

        this.events = new Events();

        this.state = new State(this.events);

        this.api = new API(this.state, this.events);

        this.providers = new Providers(this.api, this.state, this.events);

        this.render = new Render(this.events);

        this.components = new Components(this.render);

        this.view = new View();

        this.router = new Router(this.events);

        this.plugins = [];

    }

    use(plugin) {

        if (typeof plugin === "function") {

            plugin(this);

            this.plugins.push(plugin);

        }

        return this;

    }

    init() {

        console.log("Phi Boot Starting...");

        this.config = new Config();
        this.config.load();

        this.state.init();

        this.render.init(this.state);

        this.view.init();

        this.router.init(this.view);

        console.log("Phi Ready");

        this.events.emit("phi:ready");

    }

}

export function createApp() {

    return new PhiApp();

}