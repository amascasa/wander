/*==============================================================
    PHI CORE v0.5
    UI + STORAGE + ROUTING FOUNDATION
==============================================================*/

window.Phi = {};


/*==============================================================
    BOOT
==============================================================*/

Phi.boot = function () {

    console.log("Phi Core v0.8 Booting...");

    Phi.nav.init();
    Phi.router.init();
    Phi.sw.init();
    Phi.status.init();

    Phi.state.restoreUI();

};


Phi.state.restoreUI = function () {

    const lastView =
        Phi.state.get("lastView", "home");

    if (Phi.router) {

        Phi.router.go(lastView, false);

    }

};



/*==============================================================
    PHI COMPONENT SYSTEM v0.9
==============================================================*/

Phi.component = {};


/*==============================================================
    CARD COMPONENT
==============================================================*/

Phi.component.card = function (data) {

    const el = document.createElement("div");

    el.className = "card";

    el.innerHTML = `

        <h3>${data.title || ""}</h3>

        <p>${data.subtitle || ""}</p>

        ${data.html || ""}

    `;

    return el;

};


/*==============================================================
    BUTTON COMPONENT
==============================================================*/

Phi.component.button = function (label, onClick) {

    const btn = document.createElement("button");

    btn.className = "phi-btn";

    btn.textContent = label;

    btn.addEventListener("click", onClick);

    return btn;

};


/*==============================================================
    LIST COMPONENT
==============================================================*/

Phi.component.list = function (items = []) {

    const ul = document.createElement("div");

    ul.className = "phi-list";

    items.forEach(item => {

        const row = document.createElement("div");

        row.className = "phi-list-item";

        row.textContent = item;

        ul.appendChild(row);

    });

    return ul;

};


/*==============================================================
    SERVICE WORKER
==============================================================*/

Phi.sw = {

    init: function () {

        if ("serviceWorker" in navigator) {

            window.addEventListener("load", () => {

                navigator.serviceWorker.register("./service-worker.js")

                    .then(() => console.log("SW Registered"))
                    .catch(err => console.error("SW Failed", err));

            });

        }

    }

};


/*==============================================================
    NAVIGATION (PAGE-BASED FOR NOW)
==============================================================*/

Phi.nav = {

    init: function () {

        const links = document.querySelectorAll("nav a");

        links.forEach(link => {

            link.addEventListener("click", (e) => {

                e.preventDefault();

                const target = link.getAttribute("data-go");

                Phi.router.go(target);

            });

        });

    }

};


/*==============================================================
    STATUS (ONLINE / OFFLINE)
==============================================================*/

Phi.status = {

    init: function () {

        const update = () => {

            if (navigator.onLine) {

                document.body.classList.remove("offline");

            } else {

                document.body.classList.add("offline");

            }

        };

        window.addEventListener("online", update);
        window.addEventListener("offline", update);

        update();

    }

};


/*==============================================================
    STORAGE LAYER (LOCAL PERSISTENCE)
==============================================================*/

Phi.store = {

    set: function (key, value) {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    },

    get: function (key, fallback = null) {

        const item = localStorage.getItem(key);

        if (!item) return fallback;

        try {

            return JSON.parse(item);

        } catch (e) {

            return fallback;

        }

    },

    remove: function (key) {

        localStorage.removeItem(key);

    }

};


/*==============================================================
    UI COMPONENTS (FIRST VERSION)
==============================================================*/

Phi.ui = {};


/*------------------------------
    TOAST NOTIFICATION
------------------------------*/

Phi.ui.toast = function (message, duration = 2500) {

    const el = document.createElement("div");

    el.className = "phi-toast";

    el.textContent = message;

    document.body.appendChild(el);

    setTimeout(() => {

        el.classList.add("show");

    }, 10);

    setTimeout(() => {

        el.classList.remove("show");

        setTimeout(() => el.remove(), 300);

    }, duration);

};


/*------------------------------
    DIALOG (BASIC MODAL)
------------------------------*/

Phi.ui.dialog = function (content) {

    const overlay = document.createElement("div");
    overlay.className = "phi-dialog-overlay";

    const box = document.createElement("div");
    box.className = "phi-dialog-box";

    box.innerHTML = content;

    overlay.appendChild(box);

    document.body.appendChild(overlay);

    overlay.addEventListener("click", () => {
        overlay.remove();
    });

};


/*==============================================================
    ROUTER
==============================================================*/

Phi.router = {

    current: "home",

    go: function (viewName, push = true) {

        this.current = viewName;

        Phi.state.set("lastView", viewName);

        const views = document.querySelectorAll(".view");

        views.forEach(v => {

            v.classList.remove("active");

        });

        const target =
            document.querySelector(
                `[data-view="${viewName}"]`
            );

        if (target) {

            target.classList.add("active");

        }

        // update nav state
        document.querySelectorAll("nav a")
            .forEach(a => {

                a.classList.remove("active");

                if (a.dataset.go === viewName) {

                    a.classList.add("active");

                }

            });

        // update URL (deep linking)
        if (push) {

            history.pushState(
                { view: viewName },
                "",
                `#${viewName}`
            );

        }

    },

    init: function () {

        const links =
            document.querySelectorAll("nav a");

        links.forEach(link => {

            link.addEventListener("click", (e) => {

                e.preventDefault();

                const target =
                    link.getAttribute("data-go");

                Phi.router.go(target);

            });

        });

        // handle back/forward buttons
        window.addEventListener("popstate", (e) => {

            const view =
                (e.state && e.state.view)
                || location.hash.replace("#", "")
                || "home";

            Phi.router.go(view, false);

        });

        // load initial view from URL
        const initial =
            location.hash.replace("#", "")
            || "home";

        Phi.router.go(initial, false);

    }

};





/*==============================================================
    PHI STATE SYSTEM
==============================================================*/

Phi.state = {

    session: {},

    keyPrefix: "phi_",

    /*--------------------------------------
        SET PERSISTENT VALUE
    --------------------------------------*/
    set: function (key, value) {

        localStorage.setItem(
            this.keyPrefix + key,
            JSON.stringify(value)
        );

    },

    /*--------------------------------------
        GET PERSISTENT VALUE
    --------------------------------------*/
    get: function (key, fallback = null) {

        const item =
            localStorage.getItem(
                this.keyPrefix + key
            );

        if (!item) return fallback;

        try {

            return JSON.parse(item);

        } catch (e) {

            return fallback;

        }

    },

    /*--------------------------------------
        REMOVE VALUE
    --------------------------------------*/
    remove: function (key) {

        localStorage.removeItem(
            this.keyPrefix + key
        );

    },

    /*--------------------------------------
        SESSION ONLY (TEMP MEMORY)
    --------------------------------------*/
    setSession: function (key, value) {

        this.session[key] = value;

    },

    getSession: function (key, fallback = null) {

        return this.session[key] ?? fallback;

    }

};




/*==============================================================
    UI restore system
==============================================================*/


Phi.state.restoreUI = function () {

    // restore last view
    const lastView =
        Phi.state.get("lastView", "home");

    if (Phi.router) {

        Phi.router.go(lastView, false);

    }

};





/*==============================================================
    HELPERS
==============================================================*/

Phi.utils = {

    byId: (id) => document.getElementById(id),

    qs: (s) => document.querySelector(s),

    qsa: (s) => document.querySelectorAll(s)

};


/*==============================================================
    START
==============================================================*/

document.addEventListener("DOMContentLoaded", Phi.boot);