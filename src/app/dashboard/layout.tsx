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
      {/* Fix: Use proper responsive syntax */}
      <Box w={{ base: "full", md: "64" }} flex="none">
        <SideNav />
      </Box>

      {/* Fix: Use proper responsive syntax */}
      <Box flexGrow={1} p={{ base: 6, md: 12 }} overflowY={{ md: "auto" }}>
        {children}
      </Box>
    </Box>
  );
}
