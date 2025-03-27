'use client'

import {
  IEmissionFromMobileCombustion,
  IFuelInfo
} from '@/lib/api/interfaces/retrieveInterfaces'
import {createMobileCombustion} from '@/lib/api/post'
import {
  Button,
  Center,
  CloseButton,
  Dialog,
  For,
  HStack,
  Input,
  NativeSelect,
  Portal,
  Stack,
  Table,
  useDialog
} from '@chakra-ui/react'

import {useForm} from 'react-hook-form'

import {useEffect, useState} from 'react'
import {toaster} from '@/components/ui/toaster'
import {ActivityDataForMobileCombustion} from '@/lib/api/interfaces/enumTypes'
import {getMobileActivityData} from '@/lib/api/get'

const year: number[] = [2020, 2021, 2022, 2023, 2024, 2025]

const emissionActivity = Object.values(ActivityDataForMobileCombustion)

export function Dataform_Mobile({subsidaryId}: {subsidaryId: string}) {
  const [rows, setRows] = useState<number[]>([0]) // Fieldset.Root를 관리할 배열
  const [fuel, setFuel] = useState<IFuelInfo[]>()
  const [isOpen, setIsOpen] = useState(false)

  const addRow = () => {
    setRows([...rows, rows.length]) // 새로운 줄 추가
  }

  type subdata = IEmissionFromMobileCombustion
  const {register, handleSubmit, reset} = useForm<{
    data: subdata[]
  }>({
    defaultValues: {data: []}
  })

  const onSubmit = async ({data}: {data: subdata[]}) => {
    try {
      const requestData = data.map(item => ({
        ...item,
        subsidiary: subsidaryId
      }))

      const promises = requestData.map(item => createMobileCombustion(item))

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
      reset({data: []})
      setIsOpen(false)
    } catch {
      toaster.error({
        title: '데이터 생성 중 문제가 발생했습니다.'
      })
    }
  }

  useEffect(() => {
    if (isOpen == false) {
      reset({data: []})
      setRows([0])
    }
    console.log(rows)
  }, [isOpen, reset])

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getMobileActivityData()
        setFuel(result.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <Dialog.Root open={isOpen} size="full" motionPreset="slide-in-bottom">
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          이동 연소
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header display="flex" justifyContent="center" alignItems="center">
              <Dialog.Title textAlign="center">이동 연소</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
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

                  <Dialog.ActionTrigger asChild>
                    <Button onClick={handleSubmit(onSubmit)} alignSelf="flex">
                      Submit
                    </Button>
                  </Dialog.ActionTrigger>
                </Center>
              </Stack>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                onClick={() => {
                  setIsOpen(false)
                }}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
