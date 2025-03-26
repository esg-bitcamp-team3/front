"use client";

import { deleteSubsidiary } from "@/lib/api/delete";
import { toaster } from "@/components/ui/toaster";
import {
  IOrganization,
  ISubsidiary,
} from "@/lib/api/interfaces/retrieveInterfaces";
import {
  Button,
  CloseButton,
  Heading,
  Tabs,
  Text,
  For,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AddEmmition from "./addDetail/emmition_name";
import { getMyOrganizations } from "@/lib/api/my";
import { useRouter } from "next/navigation";

const AddEmmitionFactory = () => {
  const [subsidiaryList, setSubsidiaryList] = useState<ISubsidiary[]>([]);
  const [organization, setOrganization] = useState<IOrganization>();
  const router = useRouter();

  const fetchSubsidiaryList = async () => {
    try {
      const response = await getMyOrganizations();
      setSubsidiaryList(response.data.subsidiaries);
      setOrganization(response.data.organization);
    } catch (error) {
      router.push("/login");
    }
  };

  useEffect(() => {
    fetchSubsidiaryList();
  }, []);

  const [selectedTab, setSelectedTab] = useState<string | null>();

  const removeTab = async (_id: string) => {
    deleteSubsidiary(_id);
    fetchSubsidiaryList();
  };

  return (
    <SimpleGrid columns={2} gap="14" width="full">
      <Tabs.Root
        value={selectedTab}
        variant="subtle"
        size="lg"
        onValueChange={(e) => setSelectedTab(e.value)}
      >
        <Tabs.List flex="1 1 auto" overflowX="auto">
          {subsidiaryList.map((item) => (
            <Tabs.Trigger value={item._id} key={item._id}>
              {item.name}
              <CloseButton
                as="span"
                role="button"
                ml={2}
                size="sm"
                me="-2"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTab(item._id);
                }}
              />
            </Tabs.Trigger>
          ))}

          <AddEmmition />
        </Tabs.List>

        <Tabs.ContentGroup>
          {subsidiaryList.map((item) => (
            <Tabs.Content value={item._id} key={item._id}>
              <Heading size="xl" my="6">
                <Text m="5" fontSize="3xl">
                  {organization?.name} {item.industryType}
                </Text>
                <Text m="5">
                  {item.name} ( {item?.registrationNumber} )
                </Text>
              </Heading>
            </Tabs.Content>
          ))}
        </Tabs.ContentGroup>
      </Tabs.Root>
    </SimpleGrid>
  );
};

export default AddEmmitionFactory;
