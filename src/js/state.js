export default class State {

    constructor(events) {

        this.events = events;

        this.data = {};

        this.subscribers = {};

        this.storageKey = "phi_state";

        this.load(); // restore on startup

    }

    init() {

        console.log("State Initialized");

    }

    get(key) {

        return this.data[key];

    }

    set(key, value, persist = true) {

        this.data[key] = value;

        if (persist) {

            this.save();

        }

        this.events.emit("state:change", {
            key,
            value
        });

        this.notify(key, value);

    }

    subscribe(key, callback) {

        if (!this.subscribers[key]) {

            this.subscribers[key] = [];

        }

        this.subscribers[key].push(callback);

    }

    notify(key, value) {

        if (!this.subscribers[key]) return;

        this.subscribers[key].forEach(cb => cb(value));

    }

    save() {

        try {

            localStorage.setItem(
                this.storageKey,
                JSON.stringify(this.data)
            );

        } catch (e) {

            console.warn("State save failed:", e);

        }

    }

    load() {

        try {

            const saved =
                localStorage.getItem(this.storageKey);

            if (saved) {

                this.data = JSON.parse(saved);

                console.log("State restored:", this.data);

            }

        } catch (e) {

            console.warn("State load failed:", e);

        }

    }

    clear() {

        this.data = {};

        localStorage.removeItem(this.storageKey);

    }


    

}