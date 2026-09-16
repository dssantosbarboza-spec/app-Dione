// Service Worker do App Pessoal Dione
// Objetivo: permitir instalação "de verdade" como app (não só atalho de navegador)
// e exibir notificações de forma um pouco mais confiável enquanto o navegador
// estiver aberto em segundo plano. NÃO envia notificações com o app/navegador
// totalmente fechado — isso exigiria um servidor de push, que este app não tem.

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Sempre busca da rede (sem cache offline agressivo, pra você nunca ficar
  // preso numa versão antiga do app).
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow('./index.html');
    })
  );
});
