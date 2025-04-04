'use client'

import {AddSubsidiary} from '@/app/ui/dashboard/emmition-factory/addDetail/dataform/addSubsidiary'
import {ISubsidiary} from '@/lib/api/interfaces/retrieveInterfaces'
import {getMyOrganizations, searchMyOrganizations} from '@/lib/api/my'
import {
  createListCollection,
  Flex,
  HStack,
  IconButton,
  Input,
  Portal,
  Select,
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

const SearchBar = ({
  onSearch,
  criteria = '',
  onCriteriaChange = () => {}
}: {
  onSearch: (query: string) => void
  criteria: string
  onCriteriaChange: (value: string) => void
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const criterias = createListCollection({
    items: [
      {label: '전체', value: 'all'},

      {label: '사업장명', value: 'name'},
      {label: '업종', value: 'industry'}
    ]
  })

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  return (
    <HStack width="40%">
      <Select.Root
        collection={criterias}
        size="sm"
        width="180px"
        onValueChange={e => onCriteriaChange(e.value[0])}
        value={[criteria]}>
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="검색 조건" padding={2} />
          </Select.Trigger>
          <Select.IndicatorGroup mx={2}>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {criterias.items.map(item => (
                <Select.Item item={item} key={item.value} padding={2}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
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

const headers = [
  '사업장명',
  '대표업종',
  '사업장 전화번호',
  '사업장 소재지',
  '주 생산품',
  '생산량'
]

const SubsidiaryTable = () => {
  const [subsidiaryList, setSubsidiaryList] = useState<ISubsidiary[]>([])
  const [searchCriteria, setSearchCriteria] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const fetchSubsidiaryList = async () => {
    try {
      const response = await searchMyOrganizations({
        criteria: searchCriteria,
        search: searchQuery
      })
      setSubsidiaryList(response.data)
    } catch (error) {
      router.push('/login')
    }
  }

  useEffect(() => {
    fetchSubsidiaryList()
  }, [searchCriteria, searchQuery])

  const handleProjectClick = (id: string) => {
    router.push(`/dashboard/emmition-factory/${id}`)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <Flex direction="column" gap="4">
      <Flex justify="space-between" align="center" paddingTop={5} paddingLeft={10}>
        <Text textStyle="xl" fontWeight="bolder">
          사업장 목록
        </Text>
      </Flex>
      <Flex justify="end" align="center">
        <SearchBar
          onSearch={handleSearch}
          criteria={searchCriteria}
          onCriteriaChange={setSearchCriteria}
        />
      </Flex>

      <Flex justify="end" align="center">
        <AddSubsidiary />
      </Flex>

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
        <TableBody>
          {subsidiaryList.length > 0 ? (
            subsidiaryList.map(subsidiary => (
              <TableRow
                key={subsidiary._id}
                cursor="pointer"
                onClick={() => handleProjectClick(subsidiary._id)}
                _hover={{backgroundColor: 'gray.200'}}
                borderBottom="1px"
                fontSize="sm">
                <TableCell padding={4} textAlign="center">
                  {subsidiary.name || '-'}
                </TableCell>
                <TableCell padding={4} textAlign="center">
                  {subsidiary.industryType || '-'}
                </TableCell>
                <TableCell padding={4} textAlign="center">
                  {subsidiary.phoneNumber || '-'}
                </TableCell>
                <TableCell padding={4} textAlign="center">
                  {subsidiary.address || '-'}
                </TableCell>
                <TableCell padding={4} textAlign="center">
                  {subsidiary.mainProducts || '-'}
                </TableCell>
                <TableCell padding={4} textAlign="center">
                  {subsidiary.productionVolume !== undefined
                    ? `${subsidiary.productionVolume}${
                        subsidiary.unit ? ' ' + subsidiary.unit : ''
                      }`
                    : '-'}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} textAlign="center" padding={4}>
                프로젝트 목록이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableRoot>
    </Flex>
  )
}

export {SubsidiaryTable}
