import {Blockquote, Box, Stack, Text} from '@chakra-ui/react'

export function OrganizationCard({name}: {name: string}) {
  return (
    <Box p={4} borderRadius="lg" boxShadow="lg" maxW={800}>
      <Stack gap="5" align="flex-start">
        <Stack align="center" direction="row" gap="10" px="4" width="full">
          <Text minW="8ch">{name}</Text>
          <Blockquote.Root colorPalette="teal" variant="solid">
            <Blockquote.Content>
              If anyone thinks he is something when he is nothing, he deceives himself.
              Each one should test his own actions. Then he can take pride in himself,
              without comparing himself to anyone else.
            </Blockquote.Content>
          </Blockquote.Root>
        </Stack>
      </Stack>
    </Box>
  )
}
