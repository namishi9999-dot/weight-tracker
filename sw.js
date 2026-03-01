// Service Worker - 体重管理アプリ

const CACHE_NAME = 'weight-tracker-v1';

const CACHE_URLS = [
    './',
    './index.html',
    './css/style.css',
    './js/storage.js',
    './js/calendar.js',
    './js/chart.js',
    './js/app.js',
    './js/csv.js',
    './icons/favicon.svg',
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
];

// インストール: 全リソースを事前キャッシュ
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_URLS);
        })
    );
    self.skipWaiting();
});

// アクティベート: 古いキャッシュを削除
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// フェッチ: Cache First 戦略
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((response) => {
                if (!response || response.status !== 200 || response.type === 'error') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return response;
            }).catch(() => {
                // オフライン時はindex.htmlを返す（ナビゲーションリクエストの場合）
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
