"use client";

import { getSubsidiaryList } from "@/lib/api/get";
import { deleteSubsidiary } from "@/lib/api/delete";
import { toaster } from "@/components/ui/toaster";
import { ISubsidiary } from "@/lib/api/interfaces/retrieveInterfaces";
import { Button, CloseButton, Heading, Tabs, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AddEmmition from "./addDetail/emmition_name";
import { Box } from "@chakra-ui/react";

const uuid = () => {
  return Math.random().toString(36).substring(2, 15);
};

const AddEmmitionFactory = () => {
  const [subsidiaryList, setSubsidiaryList] = useState<ISubsidiary[]>([]);
  const [page, setPage] = useState(1);
  const fetchSubsidiaryList = async () => {
    try {
      const response = await getSubsidiaryList();
      setSubsidiaryList(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    const fetchSubsidiaryList = async () => {
      try {
        const response = await getSubsidiaryList();
        setSubsidiaryList(response.data);
      } catch (error) {}
    };
    fetchSubsidiaryList();
  }, []);

  const [selectedTab, setSelectedTab] = useState<string | null>();

  const removeTab = async (_id: string) => {
    deleteSubsidiary(_id);
    fetchSubsidiaryList();
  };

  return (
    <Tabs.Root
      value={selectedTab}
      variant="outline"
      size="lg"
      onValueChange={(e) => setSelectedTab(e.value)}
    >
      <Tabs.List flex="1 1 auto">
        {subsidiaryList.map((item) => (
          <Tabs.Trigger value={item._id} key={item._id}>
            {item.name}{" "}
            <CloseButton
              as="span"
              role="button"
              size="lg"
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
              {item._id}
            </Heading>
            <Text></Text>
          </Tabs.Content>
        ))}
      </Tabs.ContentGroup>
    </Tabs.Root>
  );
};

export default AddEmmitionFactory;
