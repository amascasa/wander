export default class API {

    constructor(state, events) {

        this.state = state;

        this.events = events;

        this.cache = {};

    }

    async get(url, options = {}) {

        // 1. check cache
        if (this.cache[url]) {

            console.log("API cache hit:", url);

            return this.cache[url];

        }

        try {

            const response = await fetch(url, options);

            if (!response.ok) {

                throw new Error("Network error");

            }

            const data = await response.json();

            // 2. cache result
            this.cache[url] = data;

            this.events.emit("api:success", {
                url,
                data
            });

            return data;

        } catch (error) {

            this.events.emit("api:error", {
                url,
                error
            });

            console.error("API error:", error);

            return null;

        }

    }

    clearCache() {

        this.cache = {};

    }

}