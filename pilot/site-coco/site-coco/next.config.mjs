
/** @type {import('next').NextConfig} */
import withPWAInit from "next-pwa"
const withPWA = withPWAInit({
  dest: "public",
  register: "true",
  scope: "/",
  skipWaiting: true
})
const nextConfig = ({
  async redirects() {
    return [
      {
        source: "/sign-in",
        destination: "/api/auth/login",
        permanent: true,
      },
      {
        source: "/sign-up",
        destination: "/api/auth/register",
        permanent: true,
      },
      {
        source: "/sign-out",
        destination: "/api/auth/logout",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
});

export default withPWA(nextConfig);
