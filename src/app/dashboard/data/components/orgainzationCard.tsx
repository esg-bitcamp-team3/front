import {getLittleOrganizationById, getOrganizationById} from '@/lib/api/get'
import {Blockquote, Box, Stack, Text} from '@chakra-ui/react'
import {register} from 'module'

export function OrganizationCard({organizationId}: {organizationId: string}) {
  const {name, registrationNumber, industryType} = getLittleOrganizationById({
    id: organizationId
  })

  return (
    <Box p={4} borderRadius="lg" boxShadow="lg" maxW={800}>
      <Stack gap="5" align="flex-start">
        <Stack align="center" direction="row" gap="10" px="4" width="full">
          <Text minW="8ch">{name}</Text>
          <Blockquote.Root colorPalette="teal" variant="solid">
            <Blockquote.Content>
              법인명: {}
              법인등록번호: {}
              대표 업종: {}
            </Blockquote.Content>
          </Blockquote.Root>
        </Stack>
      </Stack>
    </Box>
  )
}
