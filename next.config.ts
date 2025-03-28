import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  /* config options here */
}

export default {
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks', '@chakra-ui/react']
  }
}
