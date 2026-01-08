/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Fix for WebpackError constructor issue in Next.js 15.3.6
  webpack: (config, { dev, isServer }) => {
    // Disable minification to avoid webpack error
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: false,
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "api.fly-inn.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3002",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3002",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
        pathname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          // {
          //   key: "Content-Security-Policy",
          //   value: [
          //     "default-src 'self'",
          //     "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://accounts.google.com https://maps.googleapis.com https://*.googleapis.com https://*.vercel-scripts.com https://*.vercel.app",
          //     "frame-src 'self' https://www.google.com https://accounts.google.com https://www.gstatic.com",
          //     "connect-src 'self' http://localhost:3000 http://localhost:3002 http://127.0.0.1:3000 http://127.0.0.1:3002 https://www.google.com https://www.gstatic.com https://accounts.google.com https://maps.googleapis.com https://*.googleapis.com https://*.vercel.app",
          //     "style-src 'self' 'unsafe-inline' https://www.gstatic.com https://fonts.googleapis.com",
          //     "font-src 'self' data: https://fonts.gstatic.com",
          //     "img-src 'self' data: blob: https: http:",
          //     "trusted-types * 'allow-duplicates'",
          //   ].join("; "),
          // },
        ],
      },
    ];
  },
};

export default nextConfig;
