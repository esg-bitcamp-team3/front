'use client'

import {
  IEmissionFromMobileCombustion,
  IEmissionFromStationaryCombustion,
  IFuelInfo,
  IIndirectEmissionFromElectricity,
  IIndirectEmissionFromSteam
} from '@/lib/api/interfaces/retrieveInterfaces'
import {
  createElectricity,
  createMobileCombustion,
  createStationaryCombustion,
  createSteam
} from '@/lib/api/post'
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
  ActivityDataForElectricity,
  ActivityDataForMobileCombustion,
  ActivityDataForSteam,
  EmissionActivityTypeForMobileCombustion,
  IndirectEmissionActivityTypeForElectricity,
  IndirectEmissionActivityTypeForSteam
} from '@/lib/api/interfaces/enumTypes'
import {getElectricityActivityData, getMobileActivityData} from '@/lib/api/get'

const year: string[] = ['2020', '2021', '2022', '2023', '2024', '2025']

const emissionActivity = Object.values(IndirectEmissionActivityTypeForElectricity)

export function Dataform_Electric() {
  const [rows, setRows] = useState<number[]>([0]) // Fieldset.Root를 관리할 배열
  const [fuel, setFuel] = useState<IFuelInfo[]>()

  const addRow = () => {
    setRows([...rows, rows.length]) // 새로운 줄 추가
  }
  type subdata = IIndirectEmissionFromElectricity
  const {register, handleSubmit} = useForm<subdata>({
    defaultValues: {_id: '67e2270b5a8ed00799f03758'}
  })

  const onSubmit = async (data: IIndirectEmissionFromElectricity) => {
    const response = createElectricity(data)

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
  }

  useEffect(() => {
    //DB fuel 데이터 setFuel에 기록
    async function fetchData() {
      try {
        const result = await getElectricityActivityData()
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
            <Table.ColumnHeader w="4rem" color="blue.500" textAlign="center">
              연도
            </Table.ColumnHeader>
            <Table.ColumnHeader w="7rem" color="blue.500" textAlign="center">
              내부시설명
            </Table.ColumnHeader>
            <Table.ColumnHeader w="7rem" color="blue.500" textAlign="center">
              배출활동
            </Table.ColumnHeader>
            <Table.ColumnHeader w="8rem" color="blue.500" textAlign="center">
              활동자료
            </Table.ColumnHeader>
            <Table.ColumnHeader color="blue.500" textAlign="center">
              월별 배출량
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        {rows.map((row, index) => (
          <Table.Body key={row}>
            <Table.Row backgroundColor={index % 2 !== 0 ? 'blue.50' : 'white'}>
              <Table.Cell px="1" py="3">
                {/* year */}
                <NativeSelect.Root
                  {...register('year', {
                    required: 'This is required'
                  })}>
                  <NativeSelect.Field name={`year_${index}`}>
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
                  {...register('facilityName', {
                    required: 'This is required'
                  })}
                  name={`facility_${index}`}
                />
              </Table.Cell>

              {/* emissionActivity */}
              <Table.Cell px="1" py="3">
                <NativeSelect.Root
                  {...register('emissionActivity', {
                    required: 'This is required'
                  })}>
                  <NativeSelect.Field name={`emissionActivity_${index}`}>
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
                <NativeSelect.Root
                  {...register('activityData', {
                    required: 'This is required'
                  })}>
                  <NativeSelect.Field name={`activityData_${index}`}>
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
                  <Input name={`month_1_${index}`} placeholder="1월" />
                  <Input name={`month_2_${index}`} placeholder="2월" />
                  <Input name={`month_3_${index}`} placeholder="3월" />
                  <Input name={`month_4_${index}`} placeholder="4월" />
                  <Input name={`month_5_${index}`} placeholder="5월" />
                  <Input name={`month_6_${index}`} placeholder="6월" />
                  <Input name={`month_7_${index}`} placeholder="7월" />
                  <Input name={`month_8_${index}`} placeholder="8월" />
                  <Input name={`month_9_${index}`} placeholder="9월" />
                  <Input name={`month_10_${index}`} placeholder="10월" />
                  <Input name={`month_11_${index}`} placeholder="11월" />
                  <Input name={`month_12_${index}`} placeholder="12월" />
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
