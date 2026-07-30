export default class Router {

    constructor(events) {

        this.events = events;

        this.view = null;

    }

    init(viewSystem) {

        console.log("Router Initialized");

        this.view = viewSystem;

        this.setupNavigation();

        this.events.emit("router:ready");

    }

    setupNavigation() {

        const links =
            document.querySelectorAll("[data-go]");

        links.forEach(link => {

            link.addEventListener("click", (e) => {

                e.preventDefault();

                const target =
                    link.dataset.go;

                this.navigate(target);

            });

        });

    }

    navigate(viewName) {

        console.log("Navigating to:", viewName);

        if (this.view) {

            this.view.show(viewName);

        }

        this.events.emit("route:change", {
            view: viewName
        });

    }

}