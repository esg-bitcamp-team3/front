import {toaster} from '@/components/ui/toaster'
import {InfoTip} from '@/components/ui/toggle-tip'
import {
  getCarbonEmissionGoalsOfOrganization,
  getOrganizaionRevenueByYear
} from '@/lib/api/get'
import {
  ICarbonEmissionGoal,
  ICarbonEmissionGoalsByYear,
  IOrganizationRevenueByYear
} from '@/lib/api/interfaces/retrieveInterfaces'
import {createEmissionGoal} from '@/lib/api/post'
import {updateEmissionGoal} from '@/lib/api/put'
import {
  Button,
  CloseButton,
  DataList,
  Dialog,
  Field,
  Input,
  InputGroup,
  Portal
} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {LuSettings} from 'react-icons/lu'

export function UpdateGoalDialog({
  previousValue,
  id
}: {
  previousValue: number
  id: string
}) {
  const [originalData, setOriginalData] = useState<ICarbonEmissionGoal>()
  const [updatedValue, setUpdatedValue] = useState<number>(previousValue)

  const {register, handleSubmit, reset} = useForm<ICarbonEmissionGoal>({
    defaultValues: originalData // 초기값 설정
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCarbonEmissionGoalsOfOrganization({id})
        const fetchedData = response.data['2025']
        setOriginalData(fetchedData)
        reset(fetchedData) // 폼의 기본값을 업데이트
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [id, reset])

  const onSubmit = async (data: Partial<ICarbonEmissionGoal>) => {
    try {
      if (!data._id || !data) {
        return
      }
      const response = updateEmissionGoal({id: data?._id, data: data})
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
      window.location.reload()
    } catch {
      toaster.error({
        title: '데이터 생성 중 문제가 발생했습니다.'
      })
    }
  }

  return (
    <Dialog.Root size="xs">
      <Dialog.Trigger asChild>
        <Button variant="ghost">
          <LuSettings />
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content margin="auto" padding={4}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Header paddingY="10px">
                <Dialog.Title>목표 감축률 설정</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Field.Root>
                  <InputGroup startAddon={<span style={{padding: '0 10px'}}>%</span>}>
                    <Input
                      {...register('emissionGoal', {
                        required: true,
                        onChange: e => {
                          const inputValue = Number(e.target.value) // 입력값을 숫자로 변환
                          if (!isNaN(inputValue)) {
                            // 입력값이 유효한 숫자인 경우
                            const newValue = previousValue * ((100 - inputValue) / 100)
                            setUpdatedValue(Number(newValue.toFixed(2))) // 소수점 2자리로 제한
                          } else {
                            setUpdatedValue(previousValue)
                          }
                        }
                      })} // 입력값 등록
                      placeholder={originalData?.emissionGoal.toString()}
                      type="number"
                    />
                  </InputGroup>
                </Field.Root>
              </Dialog.Body>
              <DataList.Root orientation="horizontal" paddingY="5px">
                <DataList.Item>
                  <DataList.ItemLabel>목표 배출량</DataList.ItemLabel>
                  <InfoTip>올해 온실가스 목표 배출량(tCO2eq)</InfoTip>
                  <DataList.ItemValue>
                    {updatedValue.toFixed(2)} tCO2eq
                  </DataList.ItemValue>
                </DataList.Item>
              </DataList.Root>
              <Dialog.Footer paddingY="10px">
                <Dialog.ActionTrigger asChild>
                  <Button type="reset" variant="outline" size="xs" padding="10px">
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Dialog.ActionTrigger asChild>
                  <Button type="submit" size="xs" padding="10px" background="#008b74">
                    Save
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
