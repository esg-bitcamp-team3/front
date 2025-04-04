'use client'

import {HomeIcon, DocumentDuplicateIcon} from '@heroicons/react/24/outline'
import {usePathname} from 'next/navigation'
import {Link, Box} from '@chakra-ui/react'

const links = [
  {
    name: '대시보드',
    href: '/dashboard/data',
    icon: DocumentDuplicateIcon
  },
  {
    name: '사업장',
    href: '/dashboard/emmition-factory',
    icon: DocumentDuplicateIcon
  },
  {
    name: '기업',
    href: '/dashboard/organization',
    icon: DocumentDuplicateIcon
  },
  {
    name: '정보',
    href: '/dashboard/factor',
    icon: DocumentDuplicateIcon
  }
]

export default function NavLinks() {
  const pathname = usePathname()

  // ✅ 정확히 일치 or 하위 경로만 활성화
  const isActive = (href: string) => {
    if (href === '/dashboard/') return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      {links.map(link => {
        const LinkIcon = link.icon
        const active = isActive(link.href)

        return (
          <Link
            key={link.name}
            href={link.href}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            h="48px"
            flexGrow={1}
            p={3}
            fontSize="sm"
            fontWeight="medium"
            rounded="md"
            _hover={{bg: 'sky.100', color: 'black'}}
            md={{
              display: 'flex',
              justifyContent: 'start',
              px: 3,
              p: 2,
              flex: 'none'
            }}
            color={active ? 'black' : 'inherit'}
            bg={active ? 'sky.100' : 'gray.50'}>
            <LinkIcon width={6} />

            <Box display={{base: 'none', md: 'block'}} bg="transparent">
              {link.name}
            </Box>
          </Link>
        )
      })}
    </>
  )
}
