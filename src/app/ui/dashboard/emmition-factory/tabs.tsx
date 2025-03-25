"use client";

import { Button, CloseButton, Heading, Tabs, Text } from "@chakra-ui/react";
import { useState } from "react";
import AddEmmition from "./addDetail/emmition_name";
import { useRouter } from "next/router";

interface Item {
  id: string;
  title: string;
  content: React.ReactNode;
}
interface AddTabParams {
  tabName: string;
}

const items: Item[] = [{ id: "1", title: "Tab", content: "Tab Content" }];

const uuid = () => {
  return Math.random().toString(36).substring(2, 15);
};

const AddEmmitionFactory = () => {
  const [tabs, setTabs] = useState<Item[]>(items);
  const [selectedTab, setSelectedTab] = useState<string | null>(items[0].id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addTab = (tabName: AddTabParams["tabName"]): void => {
    const newTabs = [...tabs];
    const uid = uuid();

    if (!tabName.trim()) return; // 빈 값 방지

    newTabs.push({
      id: uid,
      title: `${tabName}`,
      content: `Tab Body`,
    });
    setTabs(newTabs);
    setSelectedTab(newTabs[newTabs.length - 1].id);
  };

  const removeTab = (id: string) => {
    if (tabs.length > 1) {
      const newTabs = [...tabs].filter((tab) => tab.id !== id);
      setTabs(newTabs);
    }
  };

  return (
    <Tabs.Root
      value={selectedTab}
      variant="outline"
      size="lg"
      onValueChange={(e) => setSelectedTab(e.value)}
    >
      <Tabs.List flex="1 1 auto">
        {tabs.map((item) => (
          <Tabs.Trigger value={item.id} key={item.id}>
            {item.title}{" "}
            <CloseButton
              as="span"
              role="button"
              size="sm"
              me="-2"
              onClick={(e) => {
                e.stopPropagation();
                removeTab(item.id);
              }}
            />
          </Tabs.Trigger>
        ))}
        <Button alignSelf="center" ms="2" size="lg" variant="ghost">
          <AddEmmition confirm={addTab} />
        </Button>
      </Tabs.List>

      <Tabs.ContentGroup>
        {tabs.map((item) => (
          <Tabs.Content value={item.id} key={item.id}>
            <Heading size="xl" my="6">
              {item.content} {item.id}
            </Heading>
          </Tabs.Content>
        ))}
      </Tabs.ContentGroup>
    </Tabs.Root>
  );
};

export default AddEmmitionFactory;
