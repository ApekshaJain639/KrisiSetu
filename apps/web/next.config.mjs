/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next.js Reverse Proxy: Automatically proxy /api/v1 requests to the FastAPI backend.
  // This completely eliminates Mixed-Content errors when accessing the frontend via HTTPS tunnels (ngrok/localtunnel) on mobile devices!
  async rewrites() {
    const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:8000";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
