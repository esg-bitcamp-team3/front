import {Blockquote, Stack, Text} from '@chakra-ui/react'

export default function Page() {
  return (
    <Stack align="center" direction="row" gap="10" px="4" width="full">
      <Text minW="8ch">사업장 이름</Text>
      <Blockquote.Root>
        <Blockquote.Content cite="Uzumaki Naruto">
          If anyone thinks he is something when he is nothing, he deceives himself. Each
          one should test his own actions. Then he can take pride in himself, without
          comparing himself to anyone else.
        </Blockquote.Content>
        <Blockquote.Caption>
          — <cite>Uzumaki Naruto</cite>
        </Blockquote.Caption>
      </Blockquote.Root>
    </Stack>
  )
}
