import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";
import { Box, Text } from "@chakra-ui/react";

export default function Page() {
  return (
    <Box as="main" display="flex" minH="100vh" flexDirection="column" p={6}>
      <Box
        display="flex"
        h={{ base: "5rem", md: "13rem" }}
        flexShrink={0}
        alignItems="flex-end"
        borderRadius="lg"
        bg="blue.500"
        p={4}
      />
      <Box
        mt={4}
        display="flex"
        flexGrow={1}
        flexDirection={{ base: "column", md: "row" }}
        gap={4}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          gap={6}
          borderRadius="lg"
          bg="gray.50"
          px={{ base: 6, md: 20 }}
          py={10}
          w={{ md: "40%" }} // 2/5 = 40%
        >
          <Text
            className={lusitana.className}
            fontSize={{ base: "xl", md: "3xl" }}
            color="gray.800"
            lineHeight={{ md: "normal" }}
          >
            <strong>Welcome to Acme.</strong> This is the example for the{" "}
            <Link href="https://nextjs.org/learn/" color="blue.500">
              Next.js Learn Course
            </Link>
            , brought to you by Vercel.
          </Text>
          <Link href="/login">
            <Box
              display="flex"
              alignItems="center"
              gap={5}
              alignSelf="start"
              borderRadius="lg"
              bg="blue.500"
              px={6}
              py={3}
              fontSize={{ base: "sm", md: "base" }}
              fontWeight="medium"
              color="white"
              _hover={{ bg: "blue.400" }}
              transition="background-color 0.3s"
            >
              <span>Log in</span>
            </Box>
          </Link>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={6}
          w={{ md: "60%" }} // 3/5 = 60%
          px={{ base: 6, md: 28 }}
          py={{ base: 6, md: 12 }}
        ></Box>
      </Box>
    </Box>
  );
}
