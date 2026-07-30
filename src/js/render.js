export default class Render {

    constructor(events) {

        this.events = events;

        this.state = null;

    }

    init(state) {

        console.log("Render Initialized");

        this.state = state;

    }

    mount(selector, content) {

        const container =
            document.querySelector(selector);

        if (!container) return;

        container.innerHTML = "";

        container.appendChild(content);

    }

    createCard(data) {

        const el = document.createElement("div");

        el.className = "card";

        el.innerHTML = `
            <h3>${data.title}</h3>
            <p>${data.subtitle}</p>
        `;

        return el;

    }

    /* =====================================
       COLLECTION RENDERING
    ======================================*/

    renderList(items, componentFn) {

        const container = document.createElement("div");

        container.className = "list";

        items.forEach(item => {

            const el = componentFn(item);

            container.appendChild(el);

        });

        return container;

    }


    bindList(stateKey, selector, componentFn) {

    this.state.subscribe(stateKey, (items) => {

        const container =
            document.querySelector(selector);

        if (!container) return;

        const list =
            this.renderList(items, componentFn);

        this.mount(selector, list);

    });

}

}