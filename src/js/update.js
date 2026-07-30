export function initPhiUpdater() {
    const AUTO_UPDATE = true;
    const VERSION_URL = "version.json?v=" + Date.now();
    const STORAGE_KEY = "phi_version";

    fetch(VERSION_URL)
        .then(res => res.json())
        .then(async data => {
            const serverVersion = data.version;

            if (!serverVersion) return;

            const localVersion = localStorage.getItem(STORAGE_KEY);

            if (!localVersion) {
                localStorage.setItem(STORAGE_KEY, serverVersion);
                return;
            }

            if (localVersion !== serverVersion) {
                console.log("Phi update found:", {
                    localVersion,
                    serverVersion
                });

                localStorage.setItem(STORAGE_KEY, serverVersion);

                if (AUTO_UPDATE) {
                    await clearPhiCaches();
                    window.location.reload();
                }
            }
        })
        .catch(err => {
            console.warn("Phi updater check failed:", err);
        });
}

async function clearPhiCaches() {
    if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();

        for (const reg of regs) {
            await reg.unregister();
        }
    }

    if ("caches" in window) {
        const names = await caches.keys();

        for (const name of names) {
            await caches.delete(name);
        }
    }
}