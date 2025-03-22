"use client";

import { HomeIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { Link, Box } from "@chakra-ui/react";

const links = [
  { name: "대시보드", href: "/dashboard", icon: HomeIcon },
  {
    name: "사업장",
    href: "/dashboard/emmition-factory",
    icon: DocumentDuplicateIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            h="48px"
            flexGrow={1}
            p={3}
            fontSize="sm"
            fontWeight="medium"
            rounded="md"
            _hover={{ bg: "sky.100", color: "blue.600" }}
            md={{
              display: "flex",
              justifyContent: "start",
              px: 3,
              p: 2,
              flex: "none",
            }}
            color={pathname === link.href ? "blue.600" : "inherit"}
            bg={pathname === link.href ? "sky.100" : "gray.50"}
          >
            <LinkIcon width={6} />
            <Box
              display={{ base: "none", md: "block" }}
              bg={pathname === link.href ? "sky.100" : "gray.50"}
            >
              {link.name}
            </Box>
          </Link>
        );
      })}
    </>
  );
}
