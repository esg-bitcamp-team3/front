import {IOrganization} from '@/lib/api/interfaces/retrieveInterfaces'
import {Blockquote, Box, DataList, Stack, Text} from '@chakra-ui/react'
import {useState} from 'react'

export function OrganizationCard({organization}: {organization: IOrganization}) {
  console.log('organization: ', organization)
  return (
    <Box p={4} borderRadius="lg" boxShadow="lg" w="full" h="full">
      <Stack gap="5" align="flex-start">
        <Stack align="center" direction="row" px="6" width="full" height="full">
          <Blockquote.Root colorPalette="teal" variant="solid" paddingX="5">
            <Blockquote.Content>
              <DataList.Root orientation="horizontal">
                <DataList.Item>
                  <DataList.ItemLabel>
                    <Text fontSize="md" fontWeight="bold">
                      법인명
                    </Text>
                  </DataList.ItemLabel>
                  <DataList.ItemValue>
                    <Text fontSize="md" fontWeight="bold">
                      {organization?.name}
                    </Text>
                  </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                  <DataList.ItemLabel>법인등록번호</DataList.ItemLabel>
                  <DataList.ItemValue>
                    {organization?.registrationNumber}
                  </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                  <DataList.ItemLabel>업종</DataList.ItemLabel>
                  <DataList.ItemValue>{organization?.industryType}</DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                  <DataList.ItemLabel>법인전화번호</DataList.ItemLabel>
                  <DataList.ItemValue>{organization?.phoneNumber}</DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>
            </Blockquote.Content>
          </Blockquote.Root>
        </Stack>
      </Stack>
    </Box>
  )
}
