'use client'

import {ChakraProvider, defaultSystem} from '@chakra-ui/react'
import {ColorModeProvider, type ColorModeProviderProps} from './color-mode'
import {ThemeProvider} from 'next-themes'

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute="class" enableSystem={true}>
        <ColorModeProvider {...props} />
      </ThemeProvider>
    </ChakraProvider>
  )
}
