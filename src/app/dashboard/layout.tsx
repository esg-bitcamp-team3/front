import SideNav from "@/app/ui/dashboard/sidenav";
import { Box } from "@chakra-ui/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      display="flex"
      h="100vh"
      flexDirection={{ base: "column", md: "row" }}
      overflow="hidden"
    >
      <Box w="full" flex="none" md={{ w: "64" }}>
        <SideNav />
      </Box>
      <Box flexGrow={1} p={6} md={{ overflowY: "auto", p: 12 }}>
        {children}
      </Box>
    </Box>
  );
}
