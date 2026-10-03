importScripts(
  "https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "DUMMY",
  authDomain: "DUMMY",
  projectId: "DUMMY",
  messagingSenderId: "DUMMY",
  appId: "DUMMY",
});

const messaging = firebase.messaging();
let firebaseConfigured = false;

self.addEventListener("message", (event) => {
  if (event.data.type === "SET_CONFIG" && event.data.config) {
    if (!firebaseConfigured) {
      firebaseConfigured = true;
      firebase
        .app()
        .delete()
        .then(() => {
          firebase.initializeApp(event.data.config);
          // console.log("Firebase initialized with real config");
        })
        .catch(console.error);
    }
  }
});

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/icon.png",
    data: { url: payload.fcmOptions?.link || "/" },
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(targetUrl);
      }),
  );
});

// end the firebase messaging service worker
