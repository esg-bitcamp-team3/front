import {IOrganization} from '@/lib/api/interfaces/retrieveInterfaces'
import {
  Blockquote,
  Box,
  DataList,
  Flex,
  HStack,
  Separator,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react'
import {useState} from 'react'

export function OrganizationCard({organization}: {organization: IOrganization}) {
  console.log('organization: ', organization)
  return (
    <Box p={3} borderRadius="lg" boxShadow="lg" w="full" h="full">
      <VStack align="center" px="6" width="full" height="full">
        <Flex w="full">
          <Text fontSize="lg" fontWeight="bold" textAlign="start">
            {organization?.name}
          </Text>
        </Flex>
        <Box w="full" h="3px" backgroundColor="green" />
        {/* <Separator variant="solid" size="lg" padding={1} w="full" colorPalette="green" /> */}
        <DataList.Root orientation="horizontal">
          <DataList.Item>
            <DataList.ItemLabel fontSize="small" fontWeight="bold">
              법인등록번호
            </DataList.ItemLabel>
            <DataList.ItemValue fontSize="small">
              {organization?.registrationNumber}
            </DataList.ItemValue>
          </DataList.Item>
          <DataList.Item>
            <DataList.ItemLabel fontSize="small" fontWeight="bold">
              업종
            </DataList.ItemLabel>
            <DataList.ItemValue fontSize="small">
              {organization?.industryType}
            </DataList.ItemValue>
          </DataList.Item>
          <DataList.Item>
            <DataList.ItemLabel fontSize="small" fontWeight="bold">
              법인전화번호
            </DataList.ItemLabel>
            <DataList.ItemValue fontSize="small">
              {organization?.phoneNumber}
            </DataList.ItemValue>
          </DataList.Item>
        </DataList.Root>
      </VStack>
    </Box>
  )
}
