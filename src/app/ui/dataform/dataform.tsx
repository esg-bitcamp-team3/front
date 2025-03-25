'use client'

import {
  Button,
  Center,
  Field,
  Fieldset,
  Flex,
  For,
  HStack,
  Input,
  NativeSelect,
  Stack,
  VStack,
  IconButton,
  chakra,
  Table,
  TableBody
} from '@chakra-ui/react'

import {useState} from 'react'
import {activityData} from '@/app/data/datas'

const year: string[] = ['2020', '2021', '2022', '2023', '2024', '2025']

export function Dataform() {
  const [rows, setRows] = useState<number[]>([0]) // Fieldset.Root를 관리할 배열

  const addRow = () => {
    setRows([...rows, rows.length]) // 새로운 줄 추가
  }

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
                <NativeSelect.Root>
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
                <Input name={`facilityName_${index}`} placeholder="ex) CHP1호기" />
              </Table.Cell>

              {/* emissionActivity */}
              <Table.Cell px="1" py="3">
                <NativeSelect.Root>
                  <NativeSelect.Field name={`emissionActivity_${index}`}>
                    <For each={['고체연료연소', '액체연료연소', '기체연료연소']}>
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
                  <NativeSelect.Field name={`activityData_${index}`}>
                    <For each={activityData}>
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
            {/* <Button type="submit" alignSelf="flex">
          Submit
        </Button> */}
          </Table.Body>
        ))}
      </Table.Root>

      <Center>
        <Button onClick={addRow} variant="outline">
          +
        </Button>
      </Center>
    </Stack>
  )
}
