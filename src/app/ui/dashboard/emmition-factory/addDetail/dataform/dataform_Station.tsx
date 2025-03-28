'use client'

import {
  IEmissionFromStationaryCombustion,
  IFuelInfo
} from '@/lib/api/interfaces/retrieveInterfaces'
import {createStationaryCombustion} from '@/lib/api/post'
import {
  Button,
  Center,
  For,
  HStack,
  Input,
  NativeSelect,
  Stack,
  Table
} from '@chakra-ui/react'

import {useForm} from 'react-hook-form'

import {useEffect, useState} from 'react'
import {toaster} from '@/components/ui/toaster'
import {register} from 'module'
import {
  ActivityDataForStationaryCombustion,
  EmissionActivityTypeForStationaryCombustion
} from '@/lib/api/interfaces/enumTypes'
import {getStationaryActivityData} from '@/lib/api/get'

const year: number[] = [2020, 2021, 2022, 2023, 2024, 2025]

const emissionActivity = Object.values(EmissionActivityTypeForStationaryCombustion)

export function Dataform_Station({
  subsidaryId,
  onClose
}: {
  subsidaryId: string
  onClose: () => void
}) {
  const [rows, setRows] = useState<number[]>([0]) // Fieldset.Root를 관리할 배열
  const [fuel, setFuel] = useState<IFuelInfo[]>()
  const addRow = () => {
    setRows([...rows, rows.length]) // 새로운 줄 추가
  }

  type subdata = IEmissionFromStationaryCombustion
  const {register, handleSubmit} = useForm<{
    data: subdata[]
  }>({
    defaultValues: {data: []}
  })

  // Make data array which type is subdata
  const onSubmit = async ({data}: {data: subdata[]}) => {
    // add subsidaryId
    try {
      const requestData = data.map(item => ({
        ...item,
        subsidiary: subsidaryId
      }))

      const promises = requestData.map(item => createStationaryCombustion(item))

      // Use Promise.all to wait for all requests to complete
      const response = Promise.all(promises)

      toaster.promise(response, {
        success: {
          title: 'Successfully uploaded!',
          description: 'Looks great'
        },
        error: {
          title: 'Upload failed',
          description: 'Something wrong with the upload'
        },
        loading: {title: 'Uploading...', description: 'Please wait'}
      })

      onClose()
    } catch {
      toaster.error({
        title: '데이터 생성 중 문제가 발생했습니다.'
      })
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getStationaryActivityData()
        setFuel(result.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <Stack gap="10" px="8">
      <Table.Root size="lg">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader
              w="4rem"
              color="blue.500"
              textAlign="center"
              fontWeight="bold"
              padding={4}>
              연도
            </Table.ColumnHeader>
            <Table.ColumnHeader
              w="7rem"
              color="blue.500"
              textAlign="center"
              fontWeight="bold"
              padding={4}>
              내부시설명
            </Table.ColumnHeader>
            <Table.ColumnHeader
              w="7rem"
              color="blue.500"
              textAlign="center"
              fontWeight="bold"
              padding={4}>
              배출활동
            </Table.ColumnHeader>
            <Table.ColumnHeader
              w="8rem"
              color="blue.500"
              textAlign="center"
              fontWeight="bold"
              padding={4}>
              활동자료
            </Table.ColumnHeader>
            <Table.ColumnHeader
              color="blue.500"
              textAlign="center"
              fontWeight="bold"
              padding={4}>
              월별 배출량
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        {rows.map((row, index) => (
          <Table.Body key={row}>
            <Table.Row backgroundColor={index % 2 !== 0 ? 'blue.50' : 'white'}>
              <Table.Cell px="1" py="3">
                {/* year */}
                <NativeSelect.Root>
                  <NativeSelect.Field
                    {...register(`data.${index}.year`, {
                      required: 'This is required'
                    })}>
                    <For each={year}>
                      {item => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      )}
                    </For>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Table.Cell>

              {/* facilityName */}
              <Table.Cell px="1" py="3">
                <Input
                  placeholder="ex) CHP1호기"
                  {...register(`data.${index}.facilityName`, {
                    required: 'This is required'
                  })}
                />
              </Table.Cell>

              {/* emissionActivity */}
              <Table.Cell px="1" py="3">
                <NativeSelect.Root>
                  <NativeSelect.Field
                    {...register(`data.${index}.emissionActivity`, {
                      required: 'This is required'
                    })}>
                    <For each={emissionActivity}>
                      {item => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      )}
                    </For>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Table.Cell>

              {/* activityData */}
              <Table.Cell px="1" py="3">
                <NativeSelect.Root>
                  <NativeSelect.Field
                    {...register(`data.${index}.activityData`, {
                      required: 'This is required'
                    })}>
                    <For each={fuel}>
                      {item => (
                        <option key={item.fuel._id} value={item.fuel._id}>
                          {item.fuel.name}
                        </option>
                      )}
                    </For>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Table.Cell>

              {/* month_data */}
              <Table.Cell px="1" py="3">
                <HStack>
                  {Array.from({length: 12}).map((_, month) => (
                    <Input
                      key={month}
                      placeholder={`${month + 1}월`}
                      type="number"
                      {...register(`data.${index}.data.${month}`, {
                        required: 'This is required',
                        valueAsNumber: true // Ensure the value is treated as a number
                      })}
                    />
                  ))}
                </HStack>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        ))}
      </Table.Root>

      <Center>
        <Button onClick={addRow} variant="outline">
          +
        </Button>
        <Button onClick={handleSubmit(onSubmit)} alignSelf="flex">
          Submit
        </Button>
      </Center>
    </Stack>
  )
}
