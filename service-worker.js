/*==============================================================
    Phi PWA STARTER KIT v2
    SERVICE WORKER
==============================================================*/


/*==============================================================
    CACHE VERSION
==============================================================*/

const CACHE_NAME = "wander-v11";


/*==============================================================
    FILES TO CACHE
==============================================================*/

const APP_FILES = [

    "./",
    "./index.html",

    "./css/style.css",
    "./css/media.css",

   

    "./manifest.json",

    // "./icons/icon-192.png",
    // "./icons/icon-512.png"

];


/*==============================================================
    INSTALL
==============================================================*/

self.addEventListener("install", event => {

    console.log("Installing Service Worker...");

    event.waitUntil(
        caches.open("phi-v1").then(cache => {

            return cache.addAll([
                "/",
                "/index.html"
            ]);

        })
    );

});


/*==============================================================
    ACTIVATE
==============================================================*/

self.addEventListener("activate", event => {

    console.log("Activating Service Worker...");

    event.waitUntil(

        caches.keys()

            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if (key !== CACHE_NAME) {

                            console.log("Deleting:", key);

                            return caches.delete(key);

                        }

                    })

                );

            })

    );

    self.clients.claim();

});


/*==============================================================
    FETCH
==============================================================*/

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

            .then(response => {

                if (response) {

                    return response;

                }

                return fetch(event.request);

            })

    );

});