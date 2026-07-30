export default class Providers {

    constructor(api, state, events) {

        this.api = api;
        this.state = state;
        this.events = events;

        this.flights = new FlightProvider(api, state, events);

    }

}




class FlightProvider {

    constructor(api, state, events) {

        this.api = api;
        this.state = state;
        this.events = events;

    }

    async search(query) {

        this.events.emit("flights:search:start", query);

        // MOCK LAYER (important for now)
        const results = await this.api.get(
            "https://jsonplaceholder.typicode.com/posts"
        );

        const flights = (results || []).slice(0, 5).map((item, i) => ({
            title: `Flight ${i + 1}`,
            subtitle: item.title
        }));

        this.state.set("flights", flights);

        this.events.emit("flights:search:done", flights);

        return flights;

    }

}