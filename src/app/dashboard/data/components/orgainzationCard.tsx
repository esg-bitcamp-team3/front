import {getLittleOrganizationById} from '@/lib/api/get'
import {ILittleOrganization, IOrganization} from '@/lib/api/interfaces/retrieveInterfaces'
import {Blockquote, Box, Stack, Text} from '@chakra-ui/react'
import {useState} from 'react'

export function OrganizationCard({organization}: {organization: IOrganization}) {
  console.log('organization: ', organization)
  return (
    <Box p={4} borderRadius="lg" boxShadow="lg" maxW={800}>
      <Stack gap="5" align="flex-start">
        <Stack align="center" direction="row" gap="10" px="4" width="full">
          <Text minW="8ch">{organization?.name}</Text>
          <Blockquote.Root colorPalette="teal" variant="solid">
            <Blockquote.Content>
              법인등록번호: {organization?.registrationNumber}
              대표 업종: {organization?.industryType}
            </Blockquote.Content>
          </Blockquote.Root>
        </Stack>
      </Stack>
    </Box>
  )
}
