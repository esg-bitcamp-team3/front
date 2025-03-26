"use client";

import { Box } from "@chakra-ui/react";
import { ScopeChart, ScopeBarChart, ScopeBox } from "./components/scopeChart";
import {
  IOrganization,
  IScopeData,
  ISubsidiary,
} from "@/lib/api/interfaces/retrieveInterfaces";
import { useEffect, useState } from "react";
import { getMyOrganizations } from "@/lib/api/my";
import { getCalculatedEmissionOfOrganiation } from "@/lib/api/get";
import { toaster } from "@/components/ui/toaster";

const Page = () => {
  const [organization, setOrganization] = useState<IOrganization>();
  const [subsidaryList, setSubsidaryList] = useState<ISubsidiary[]>();
  const [data, setData] = useState<IScopeData>();

  const fetchOrgnization = async () => {
    try {
      const response = await getMyOrganizations();
      console.log(response);
      setOrganization(response.data.organization);
      setSubsidaryList(response.data.subsidiaries);
    } catch (error) {
      toaster.error({
        title: "기업 데이터를 가져오는 데 실패했습니다.",
      });
    }
  };

  const fetchData = async (id: string) => {
    try {
      const response = await getCalculatedEmissionOfOrganiation(id);
      console.log(response);
      setData(response.data);
    } catch (error) {
      toaster.error({
        title: "데이터를 가져오는 데 실패했습니다.",
      });
    }
  };

  useEffect(() => {
    fetchOrgnization();
  }, []);

  useEffect(() => {
    if (organization) {
      fetchData(organization._id);
    }
  }, [organization]);

  return (
    <div>
      <h1>Dashboard</h1>
      {data && data.scope1 && data.scope2 && (
        <Box width="md">
          <ScopeBox data={data} />
        </Box>
      )}
    </div>
  );
};

export default Page;
