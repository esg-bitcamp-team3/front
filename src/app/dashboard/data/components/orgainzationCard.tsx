import {IOrganization} from '@/lib/api/interfaces/retrieveInterfaces'
import {Blockquote, Box, DataList, Stack, Text} from '@chakra-ui/react'
import {useState} from 'react'

export function OrganizationCard({organization}: {organization: IOrganization}) {
  console.log('organization: ', organization)
  return (
    <Box p={4} borderRadius="lg" boxShadow="lg" w="full">
      <Stack gap="5" align="flex-start">
        <Stack align="center" direction="row" px="4" width="full">
          <Text>{organization?.name}</Text>
          <Blockquote.Root colorPalette="teal" variant="solid" paddingX="5">
            <Blockquote.Content>
              <DataList.Root orientation="horizontal">
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
              </DataList.Root>
            </Blockquote.Content>
          </Blockquote.Root>
        </Stack>
      </Stack>
    </Box>
  )
}
