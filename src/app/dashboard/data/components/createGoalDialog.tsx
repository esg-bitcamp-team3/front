import {toaster} from '@/components/ui/toaster'
import {getCarbonEmissionGoalsOfOrganization} from '@/lib/api/get'
import {ICarbonEmissionGoalForm} from '@/lib/api/interfaces/form'
import {ICarbonEmissionGoal} from '@/lib/api/interfaces/retrieveInterfaces'
import {createEmissionGoal} from '@/lib/api/post'
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  InputGroup,
  Portal
} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'

export function CreateGoalDialog({id}: {id: string}) {
  const currentYear = new Date().getFullYear()
  const {register, handleSubmit} = useForm<ICarbonEmissionGoalForm>({
    defaultValues: {
      organizationId: id,
      year: currentYear,
      emissionGoal: 0
    } // 초기값 설정
  })

  const onSubmit = async (data: Partial<ICarbonEmissionGoalForm>) => {
    try {
      const response = createEmissionGoal(data)
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
    } catch {
      toaster.error({
        title: '데이터 생성 중 문제가 발생했습니다.'
      })
    }
  }

  return (
    <Dialog.Root size="lg">
      <Dialog.Trigger asChild>
        <Button position="absolute" right="0">
          ⋮
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content margin="auto" padding={4}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Header alignItems="center">
                <Dialog.Title>온실가스 배출량 목표 설정</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Field.Root>
                  <Field.Label>목표</Field.Label>
                  <InputGroup endElement="tCO2eq">
                    <Input
                      {...register('emissionGoal', {required: true})} // 입력값 등록
                      placeholder="상한값 입력"
                      type="number"
                    />
                  </InputGroup>
                </Field.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button type="reset" variant="outline">
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Dialog.ActionTrigger asChild>
                  <Button type="submit">Save</Button>
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
