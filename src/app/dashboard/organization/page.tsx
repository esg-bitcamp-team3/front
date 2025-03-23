"use client";

import { getOrganizaionById, getOrganizaionList } from "@/lib/api/get";
import { IOrganization } from "@/lib/api/interfaces/retrieveInterfaces";
import {
  Card,
  Flex,
  HStack,
  IconButton,
  Pagination,
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Page = () => {
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(1);
  const [search, setSearch] = useState("");

  // Fetch organizations when pagination parameters change
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      console.log("Fetching organizations...");
      try {
        const response = await getOrganizaionList({
          page,
          pageSize,
          search: search || undefined,
        });

        console.log(response);

        setOrganizations(response.data);
        setCount(response.total || 1);
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page, pageSize, search]);
  return (
    <VStack>
      <Stack dir="vertical" gap="4">
        {organizations.length > 0 &&
          organizations.map((organization) => (
            <Card.Root key={organization._id}>
              <Card.Header>{organization.name}</Card.Header>
              <Card.Body>{organization.mainProducts}</Card.Body>
            </Card.Root>
          ))}
      </Stack>

      <PaginationRoot
        count={count}
        pageSize={pageSize}
        defaultPage={1}
        onPageChange={(e) => setPage(e.page)}
      >
        <HStack justify="center">
          <PaginationPrevTrigger />
          <PaginationItems
            render={(page) => (
              <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                {page.value}
              </IconButton>
            )}
          />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>
    </VStack>
  );
};

export default Page;
