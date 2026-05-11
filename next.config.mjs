/** @type {import('next').NextConfig} */

const baseHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // All routes: block framing
        source: '/(.*)',
        headers: [...baseHeaders, { key: 'X-Frame-Options', value: 'DENY' }],
      },
      {
        // Preview routes: allow same-origin iframe (quiz etapa-4)
        source: '/api/preview-draft/:id*',
        headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
      },
      {
        // Admin preview route: allow same-origin iframe (admin editor)
        source: '/api/admin/preview-site/:id*',
        headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
      },
    ];
  },
};

export default nextConfig;
