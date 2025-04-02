'use client'
import {getActivityDataForStationaryCombustion} from '@/lib/api/get'
import {getActivityDataForElectricity} from '@/lib/api/get'
import {getActivityDataForMobileCombustion} from '@/lib/api/get'
import {getActivityDataForSteam} from '@/lib/api/get'

import {AddSubsidiary} from '@/app/ui/dashboard/emmition-factory/addDetail/dataform/addSubsidiary'
import {ISubsidiary} from '@/lib/api/interfaces/retrieveInterfaces'
import {getMyOrganizations} from '@/lib/api/my'
import {
  Flex,
  HStack,
  IconButton,
  Input,
  Separator,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
  Text,
  useDialog
} from '@chakra-ui/react'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {LuSearch} from 'react-icons/lu'
import {Button, VStack} from '@chakra-ui/react' // 추가된 컴포넌트
const SearchBar = ({onSearch}: {onSearch: (query: string) => void}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  return (
    <HStack width="40%">
      <Input
        padding={2}
        colorPalette="gray"
        variant="outline"
        placeholder="검색하기"
        size="sm"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            handleSearch()
          }
        }}
      />
      <IconButton
        variant="ghost"
        aria-label="Search"
        size="sm"
        boxSizing="border-box"
        colorPalette="gray"
        onClick={handleSearch}>
        <LuSearch size="sm" />{' '}
      </IconButton>
    </HStack>
  )
}

const Page = () => {
  const [ActivityDataForStationaryCombustion, setActivityDataForStationaryCombustion] =
    useState<ISubsidiary[]>([])
  const [ActivityDataForMobileCombustion, setActivityDataForMobileCombustion] = useState<
    ISubsidiary[]
  >([])
  const [ActivityDataForElectricity, setActivityDataForElectricity] = useState<
    ISubsidiary[]
  >([])
  const [getActivityDataForSteam, setgetActivityDataForSteam] = useState<ISubsidiary[]>(
    []
  )
  const [subsidiaryList, setSubsidiaryList] = useState<ISubsidiary[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const fetchSubsidiaryList = async () => {
    try {
      const response = await getMyOrganizations()
      setSubsidiaryList(response.data.subsidiaries)
    } catch (error) {
      router.push('/login')
    }
  }

  useEffect(() => {
    fetchSubsidiaryList()
  }, [])

  const handleProjectClick = (id: string) => {
    router.push(`/dashboard/emmition-factory/${id}`)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }
  const headers = ['고정연소', '이동연소', '간접배출원(전기)', '간접배출원(스팀)']

  return (
    <Flex direction="column" gap="4">
      <Flex justify="space-between" align="center" paddingTop={5} paddingLeft={10}>
        <Text textStyle="xl" fontWeight="bold">
          계산식 정보
        </Text>
      </Flex>

      <Flex justify="end" align="center"></Flex>

      <Separator />
      <TableRoot size="lg" borderRadius="md" border="1px">
        <TableHeader fontSize="sm" textAlign="center">
          <TableRow>
            {headers.map((header, index) => (
              <TableColumnHeader
                fontWeight="bold"
                key={index}
                padding={4}
                borderBottom="2px"
                textAlign="center">
                {header}
              </TableColumnHeader>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody></TableBody>
      </TableRoot>
    </Flex>
  )
}

export default Page
