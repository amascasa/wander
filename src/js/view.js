export default class View {

    constructor() {

        this.views = document.querySelectorAll(".view");

        this.activeView = "home";

    }

    init() {

        console.log("View System Initialized");

    }

    show(viewName) {

        this.views.forEach(view => {

            if (view.dataset.view === viewName) {

                view.classList.add("active");

            } else {

                view.classList.remove("active");

            }

        });

        this.activeView = viewName;

    }

}