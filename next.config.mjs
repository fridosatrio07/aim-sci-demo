/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_STATIC_EXPORT === "true";

const nextConfig = {
  reactStrictMode: true,
  ...(isStaticExport
    ? {
        output: "export",
        trailingSlash: true,
        images: {
          unoptimized: true
        }
      }
    : {})
};

export default nextConfig;
