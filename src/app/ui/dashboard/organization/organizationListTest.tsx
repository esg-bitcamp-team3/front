'use client'

import NavLinks from '@/app/ui/dashboard/nav-links'
import {toaster} from '@/components/ui/toaster'
import {getCalculatedYearlyEmissionOfSubsidiary, getSubsidiaryById} from '@/lib/api/get'
import {
  IOrganization,
  ISubsidiary,
  IYearlyEmissionData
} from '@/lib/api/interfaces/retrieveInterfaces'
import {getMyOrganizations} from '@/lib/api/my'
import {
  Box,
  Link,
  Flex,
  Button,
  Text,
  DataList,
  Card,
  Table,
  HStack,
  Dialog,
  useDialog,
  Portal,
  CloseButton,
  Separator
} from '@chakra-ui/react'
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api'
import {useEffect, useState} from 'react'
import {FiPower} from 'react-icons/fi' // Using react-icons for the power icon
import {LuArrowDown, LuArrowUp} from 'react-icons/lu'

export const OrganizaionInfoListTest = () => {
  const [organization, setOrganization] = useState<IOrganization>()
  const [subsidiaryList, setSubsidiaryList] = useState<ISubsidiary[]>()
  const [subsidiary, setSubsidiary] = useState<ISubsidiary>()
  const [selectedSubsidiaryId, setSelectedSubsidiaryId] = useState<string>()
  const [emissionData, setEmissionData] = useState<{[id: string]: IYearlyEmissionData}>(
    {}
  )
  const [markerPositions, setMarkerPositions] = useState<{lat: number; lng: number}[]>([])
  const geocodeAddress = async (
    address: string
  ): Promise<{lat: number; lng: number} | null> => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=AIzaSyBx0SlxezqTxbd5GhY-GRsJHbrszcVmFqc`
      )
      const data = await res.json()
      if (data.status === 'OK') {
        const location = data.results[0].geometry.location
        return {lat: location.lat, lng: location.lng}
      } else {
        console.error('Geocoding failed:', address)
        return null
      }
    } catch (err) {
      console.error('Geocoding error:', err)
      return null
    }
  }
  useEffect(() => {
    const fetchMarkers = async () => {
      if (!subsidiaryList) return
      const positions: {lat: number; lng: number}[] = []
      for (const sub of subsidiaryList) {
        if (sub.address) {
          const coords = await geocodeAddress(sub.address)
          if (coords) {
            positions.push(coords)
          }
        }
      }
      setMarkerPositions(positions)
    }

    fetchMarkers()
  }, [subsidiaryList])

  const [year, setYear] = useState<number>(2025)
  const dialog = useDialog()

  const fetchOrgnization = async () => {
    try {
      const response = await getMyOrganizations()
      setOrganization(response.data.organization)
      setSubsidiaryList(response.data.subsidiaries)
    } catch (error) {
      toaster.error({
        title: '기업 데이터를 가져오는 데 실패했습니다.'
      })
    }
  }
  const fetchEmissionDataForSubsidiaries = async (subsidiaries: ISubsidiary[]) => {
    try {
      const emissionPromises = subsidiaries.map(sub =>
        getCalculatedYearlyEmissionOfSubsidiary(sub._id)
      )

      const results = await Promise.all(emissionPromises)

      const newEmissionData: {[id: string]: IYearlyEmissionData} = {}
      results.forEach((result, index) => {
        newEmissionData[subsidiaries[index]._id] = result.data
      })

      setEmissionData(newEmissionData)
    } catch (error) {
      toaster.error({
        title: '배출량 데이터를 가져오는 데 실패했습니다.'
      })
    }
  }

  const fetchSubsidary = async (id: string) => {
    try {
      const response = await getSubsidiaryById(id)
      setSubsidiary(response.data)
      console.log(response.data)
    } catch (error) {
      toaster.error({
        title: '사업장 데이터를 가져오는 데 실패했습니다.'
      })
    }
  }
  const [center, setCenter] = useState<{lat: number; lng: number}>({
    lat: 37.5665,
    lng: 126.978
  })
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    const address = subsidiary?.address // Define 'address' from subsidiary object
    if (address) {
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBx0SlxezqTxbd5GhY-GRsJHbrszcVmFqc`
      )
        .then(res => res.json())
        .then(data => {
          if (data.status === 'OK') {
            const location = data.results[0].geometry.location
            setCenter({lat: location.lat, lng: location.lng}) // Update the center state
          } else {
            toaster.error({
              title: '주소 변환 실패',
              description: '해당 주소를 찾을 수 없습니다.'
            })
          }
        })
        .catch(err => {
          console.error('Geocoding API error:', err)
          toaster.error({
            title: 'Geocoding API 에러',
            description: '주소를 변환하는데 문제가 발생했습니다.'
          })
        })
    }
  }, [subsidiary?.address])
  // 숫자에 쉼표 추가
  const formatNumberWithCommas = (number: number) => {
    return new Intl.NumberFormat().format(number)
  }
  useEffect(() => {
    setYear(new Date().getFullYear())
    fetchOrgnization()
  }, [])

  useEffect(() => {
    if (subsidiaryList) {
      fetchEmissionDataForSubsidiaries(subsidiaryList)
    }
  }, [subsidiaryList])

  useEffect(() => {
    if (selectedSubsidiaryId) {
      fetchSubsidary(selectedSubsidiaryId)
    }
  }, [selectedSubsidiaryId])

  function handleMapLoaded(arg0: boolean): void | Promise<void> {
    throw new Error('Function not implemented.')
  }
  function initMap() {
    const mapElement = document.getElementById('map')
    if (!mapElement) {
      throw new Error('Map element not found')
    }
    const map = new google.maps.Map(mapElement as HTMLElement, {
      zoom: 10,
      center: {lat: 37.48144, lng: 126.882652}
    })
    const infoWindow = new google.maps.InfoWindow({
      content: '',
      disableAutoPan: true
    })

    //마커에 표시될 문자
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    //지도에 마커 추가
    const location = [{lat: 37.7749, lng: -122.4194}] // Example location array
    const markers = location.map((position: any, i: number) => {
      const label = labels[i % labels.length]
      const marker = new google.maps.Marker({
        position,
        label
      })

      //lat - 위도 , lng - 경도
      //마커 클릭 시 정보 창 열기
      marker.addListener('click', () => {
        infoWindow.setContent(label)
        infoWindow.open(map, marker)
      })

      //생성한 마커 지도에 추가
      marker.setMap(map)

      return marker
    })
  }
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* 로고와 환영 텍스트 박스 */}
      {/* <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={4}
        p={1}
        bg="white"
        borderRadius="lg">
        <Link href="/">
          <Button as="a" bg="white" color="green.600" padding={4} borderRadius="lg">
            <img
              src="/gglogo.png"
              alt="Green Gauge Logo"
              style={{width: '55px', height: '55px', marginRight: '14px'}}
            />
            <Text fontSize="3xl" fontWeight="bold">
              Green Gauge에 오신 것을 환영합니다
            </Text>
          </Button>
        </Link>
      </Box> */}

      {/* 기업 정보와 사업장 정보를 나란히 표시 */}
      <Flex justify="space-between" align="center" paddingTop={5} paddingLeft={10}>
        <Text textStyle="xl" fontWeight="bolder">
          기업정보
        </Text>
      </Flex>
      <br />
      <Flex direction="row" gap={6} mb={8}>
        {/* 기업 정보 박스 */}

        <Card.Root
          display="flex"
          flexDirection="column"
          bg="white"
          p={4}
          w="50%"
          borderRadius="lg"
          boxShadow="sm">
          <Card.Title>
            <Text fontSize="md" fontWeight="bold" color="black" mb={4}>
              기업 정보
            </Text>
          </Card.Title>
          <Card.Body>
            <DataList.Root orientation="horizontal" size="lg">
              <DataList.Item>
                <DataList.ItemLabel>법인명</DataList.ItemLabel>
                <DataList.ItemValue>{organization?.name || '-'}</DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel>대표자</DataList.ItemLabel>
                <DataList.ItemValue>
                  {organization?.representative || '-'}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel>법인등록번호</DataList.ItemLabel>
                <DataList.ItemValue>
                  {organization?.registrationNumber || '-'}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel>대표업종</DataList.ItemLabel>
                <DataList.ItemValue>
                  {organization?.industryType || '-'}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel>법인전화번호</DataList.ItemLabel>
                <DataList.ItemValue>
                  {organization?.phoneNumber || '-'}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel>법인소재지</DataList.ItemLabel>
                <DataList.ItemValue>{organization?.address || '-'}</DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel>주 생산품</DataList.ItemLabel>
                <DataList.ItemValue>
                  {organization?.mainProducts || '-'}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel>생산량</DataList.ItemLabel>
                <DataList.ItemValue>
                  {organization?.productionVolume
                    ? `${organization.productionVolume} ${organization.unit || ''}`
                    : '-'}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel>상시종업원수</DataList.ItemLabel>
                <DataList.ItemValue>
                  {organization?.numberOfEmployees
                    ? `${organization.numberOfEmployees}명`
                    : '-'}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel>자본금</DataList.ItemLabel>
                <DataList.ItemValue>
                  {organization?.capital
                    ? `${organization.capital.toLocaleString()}원`
                    : '-'}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel>당해연도 매출액</DataList.ItemLabel>
                <DataList.ItemValue>
                  {organization?.annualRevenue
                    ? `${organization.annualRevenue.toLocaleString()}원`
                    : '-'}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item key="annualEnergyCost">
                <DataList.ItemLabel>당해연도 에너지 비용</DataList.ItemLabel>
                <DataList.ItemValue>
                  {organization?.annualEnergyCost
                    ? `${organization.annualEnergyCost.toLocaleString()}원`
                    : '-'}
                </DataList.ItemValue>
              </DataList.Item>
            </DataList.Root>
          </Card.Body>
        </Card.Root>
        <Flex direction="column" w="50%">
          {/* 사업장 정보 */}
          <Card.Root
            display="flex"
            flexDirection="column"
            bg="white"
            p={4}
            borderRadius="lg"
            boxShadow="sm"
            w="100%" // Adjust width for side-by-side layout
            h="100%"
            flexGrow={1} // This ensures the box grows vertically to fill space
          >
            <Card.Title>
              <Text fontSize="md" fontWeight="bold" color="black" mb={4}>
                사업장정보
              </Text>
            </Card.Title>
            <Card.Body>
              <Table.Root size="lg">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader padding={2}>사업장명</Table.ColumnHeader>
                    <Table.ColumnHeader padding={2}>배출량</Table.ColumnHeader>
                    <Table.ColumnHeader padding={2}>
                      전년도 대비 증감률
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {subsidiaryList?.map(sub => (
                    <Table.Row
                      key={sub._id}
                      _hover={{bg: 'gray.100'}}
                      onClick={() => {
                        dialog.setOpen(true)
                        setSelectedSubsidiaryId(sub._id)
                      }}>
                      <Table.Cell padding={2}>{sub.name}</Table.Cell>
                      <Table.Cell padding={2}>
                        {emissionData[sub._id]?.[year]?.total?.toFixed(2) || '-'} 톤
                      </Table.Cell>
                      <Table.Cell padding={2}>
                        {(() => {
                          const current = emissionData[sub._id]?.[year]?.total
                          const previous = emissionData[sub._id]?.[year - 1]?.total
                          if (current && previous) {
                            const change = (
                              ((current - previous) / previous) *
                              100
                            ).toFixed(2)
                            return (
                              <HStack>
                                {current > previous ? (
                                  <LuArrowUp color="red" />
                                ) : (
                                  <LuArrowDown color="green" />
                                )}{' '}
                                {change}%
                              </HStack>
                            )
                          }
                          return '-'
                        })()}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Card.Body>
          </Card.Root>
        </Flex>
        <Card.Root
          display=""
          flexDirection="column"
          bg="white"
          p={4}
          w="60%"
          borderRadius="lg"
          boxShadow="sm">
          <Card.Title>
            <Text fontSize="md" fontWeight="bold" color="gray.700" mb={4}>
              사업장 위치
            </Text>
          </Card.Title>
          <Card.Body>
            <LoadScript googleMapsApiKey="AIzaSyBx0SlxezqTxbd5GhY-GRsJHbrszcVmFqc">
              <GoogleMap
                mapContainerStyle={{width: '100%', height: '400px'}}
                center={center}
                zoom={10}
                onLoad={() => setMapLoaded(true)}>
                {/* 개별 마커 렌더링 */}
                {markerPositions.map((position, index) => (
                  <Marker key={index} position={position} />
                ))}
              </GoogleMap>
            </LoadScript>
          </Card.Body>
        </Card.Root>
      </Flex>

      {selectedSubsidiaryId && (
        <Dialog.RootProvider value={dialog}>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content style={{margin: 'auto'}}>
                <Dialog.Body>
                  <Card.Root padding={10}>
                    <Card.Title>사업장 세부 정보</Card.Title>
                    <Separator mt={2} mb={4} />
                    <Card.Body>
                      <DataList.Root orientation="horizontal" size="lg">
                        <DataList.Item>
                          <DataList.ItemLabel>사업장명</DataList.ItemLabel>
                          <DataList.ItemValue>
                            {subsidiary?.name || '-'}
                          </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                          <DataList.ItemLabel>대표자</DataList.ItemLabel>
                          <DataList.ItemValue>
                            {subsidiary?.representative || '-'}
                          </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                          <DataList.ItemLabel>법인등록번호</DataList.ItemLabel>
                          <DataList.ItemValue>
                            {subsidiary?.registrationNumber || '-'}
                          </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                          <DataList.ItemLabel>대표업종</DataList.ItemLabel>
                          <DataList.ItemValue>
                            {subsidiary?.industryType || '-'}
                          </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                          <DataList.ItemLabel>법인전화번호</DataList.ItemLabel>
                          <DataList.ItemValue>
                            {subsidiary?.phoneNumber || '-'}
                          </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                          <DataList.ItemLabel>법인소재지</DataList.ItemLabel>
                          <DataList.ItemValue>
                            {subsidiary?.address || '-'}
                          </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                          <DataList.ItemLabel>주 생산품</DataList.ItemLabel>
                          <DataList.ItemValue>
                            {subsidiary?.mainProducts || '-'}
                          </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                          <DataList.ItemLabel>생산량</DataList.ItemLabel>
                          <DataList.ItemValue>
                            {subsidiary?.productionVolume
                              ? `${subsidiary.productionVolume} ${subsidiary.unit || ''}`
                              : '-'}
                          </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                          <DataList.ItemLabel>상시종업원수</DataList.ItemLabel>
                          <DataList.ItemValue>
                            {subsidiary?.numberOfEmployees
                              ? `${subsidiary.numberOfEmployees}명`
                              : '-'}
                          </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                          <DataList.ItemLabel>자본금</DataList.ItemLabel>
                          <DataList.ItemValue>
                            {subsidiary?.capital
                              ? `${subsidiary.capital.toLocaleString()}원`
                              : '-'}
                          </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                          <DataList.ItemLabel>당해연도 매출액</DataList.ItemLabel>
                          <DataList.ItemValue>
                            {subsidiary?.annualRevenue
                              ? `${subsidiary.annualRevenue.toLocaleString()}원`
                              : '-'}
                          </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item key="annualEnergyCost">
                          <DataList.ItemLabel>당해연도 에너지 비용</DataList.ItemLabel>
                          <DataList.ItemValue>
                            {subsidiary?.annualEnergyCost
                              ? `${subsidiary.annualEnergyCost.toLocaleString()}원`
                              : '-'}
                          </DataList.ItemValue>
                        </DataList.Item>
                      </DataList.Root>
                    </Card.Body>
                  </Card.Root>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Link href={`/dashboard/emmition-factory/${subsidiary?._id}`}>
                      <Button padding={4} variant="ghost">
                        사업장 바로가기
                      </Button>
                    </Link>
                  </Dialog.ActionTrigger>
                  <Dialog.ActionTrigger asChild>
                    <Button padding={4} variant="outline">
                      확인
                    </Button>
                  </Dialog.ActionTrigger>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.RootProvider>
      )}
    </Box>
  )
}
