import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";
import { Box, Text, Button, Stack, Flex, Heading } from "@chakra-ui/react";
import { LuArrowRight, LuTreeDeciduous } from "react-icons/lu";
import { BsTree } from "react-icons/bs";
export default function Page() {
  return (
    <Box
      as="main"
      display="flex"
      minH="100vh"
      flexDirection="column"
      p={6}
      bg="white"
    >
      {/* 상단 타이틀과 로고 */}
      <Text
        className={lusitana.className}
        fontSize={{ base: "xl", md: "3xl" }}
        color="green.600"
        lineHeight={{ md: "normal" }}
        mb={6}
        textAlign="center"
      >
        <Box display="flex" justifyContent="center" alignItems="center" gap={4}>
          {" "}
          <Button
            as="a"
            href="/http://localhost:3000/"
            bg="white"
            color="white"
            padding={4}
          >
            <img
              src="/gglogo.png"
              alt="Green Gauge Logo"
              style={{ width: "50px", height: "50px" }}
            />{" "}
          </Button>
          <strong>Welcome to Green Gauge</strong>
        </Box>
      </Text>
      {/* 환경 관련 메시지 */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        gap={4}
        bg="green.200"
        borderRadius="lg"
        p={300}
        mb={8}
      >
        <Stack align="flex-start">
          <Heading size="4xl">Green Gauge</Heading>
          <Text mb="3" fontSize="lg" color="fg.muted">
            Join us in making the world greener. Together, we can make a big
            impact on the planet.
          </Text>
          <Button
            as="a"
            href="/login"
            bg="green.500"
            color="white"
            _hover={{ bg: "green.400" }}
            size="lg"
            borderRadius="md"
            fontWeight="bold"
            padding={4}
          >
            Login <LuArrowRight size="xl" />
          </Button>
        </Stack>
        <img
          src="/bg.png"
          alt="BackGround Green Gauge Logo"
          style={{ width: "900px", height: "900px" }}
        />{" "}
      </Box>

      {/* 섹션 2 */}
      <Box flex="1" />

      {/* 푸터 시작 */}
      <Box
        as="footer"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bg="black"
        color="white"
        p={50}
        borderRadius="lg"
        mt={8}
      >
        <Text fontSize="lg" textAlign="center">
          <strong>Green Gauge</strong> | Making the World Greener Together
        </Text>
        <Text fontSize="lg" textAlign="center" mt={2}>
          Address: 123 Green St, Eco City, Earth
        </Text>
        <Text fontSize="xs" textAlign="center" mt={1}>
          Email: contact@greengauge.com | Phone: +123 456 7890
        </Text>
      </Box>
      {/* 푸터 끝 */}
    </Box>
  );
}
