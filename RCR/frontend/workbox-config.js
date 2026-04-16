module.exports = {
    globDirectory: 'build/',
    globPatterns: [
        '**/*.{js,css,html,png,svg,jpg,json}',
        'static/js/*.js',
        'static/css/*.css'
    ],
    swDest: 'build/service-worker.js',
    // runtime caching – Mapbox tiles & API calls
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/maps\.googleapis\.com\/.*$/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-maps-api',
                expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                },
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
        },
        {
            urlPattern: /^https:\/\/maps\.gstatic\.com\/.*$/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-maps-tiles',
                expiration: {
                    maxEntries: 500,
                    maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                },
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
        },
        {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*$/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-fonts',
                expiration: {
                    maxEntries: 20,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                }
            }
        },
        {
            urlPattern: ({ url }) => url.pathname.includes('/incidents/me') || url.pathname.includes('/tasks/my-tasks'),
            handler: 'NetworkFirst',
            options: {
                cacheName: 'tactical-user-data',
                networkTimeoutSeconds: 5,
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24 // 1 day
                }
            }
        },
        {
            urlPattern: ({ url }) => url.origin === self.location.origin,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'app-shell',
                networkTimeoutSeconds: 3,
                expiration: {
                    maxEntries: 200,
                    maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
                }
            }
        }
    ]
};