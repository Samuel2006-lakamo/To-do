if ('serviceWorker' in navigator) {
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);

                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('New version found, installing...', newWorker);
                });
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}