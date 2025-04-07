'use client'

import {Button, CloseButton, Dialog, Portal, useDialog} from '@chakra-ui/react'

import {useForm} from 'react-hook-form'
import {IOrganization, ISubsidiary} from '@/lib/api/interfaces/retrieveInterfaces'
import {toaster} from '@/components/ui/toaster'
import {getMyOrganizations} from '@/lib/api/my'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {deleteSubsidiary} from '@/lib/api/delete'
export const DeleteSubsidiary = ({subsidiary}: {subsidiary: ISubsidiary}) => {
  const dialog = useDialog()
  const [organization, setOrganization] = useState<IOrganization>()
  const [updatedSubsidiary, setUpdatedSubsidiary] = useState<ISubsidiary | null>(
    subsidiary
  )
  useForm<ISubsidiary>({
    defaultValues: {organization: organization?._id}
  })

  const router = useRouter()
  const [] = useState(false)
  const fetchSubsidiaryList = async () => {
    try {
      const response = await getMyOrganizations()
      setOrganization(response.data.organization)
    } catch (error) {}
  }

  useEffect(() => {
    fetchSubsidiaryList()
  }, [])

  const {register, handleSubmit, reset} = useForm<ISubsidiary>({
    defaultValues: {organization: organization?._id}
  })
  useEffect(() => {
    if (organization) {
      reset({organization: organization._id, ...subsidiary})
    }
  }, [organization, reset])

  const onDelete = async (data: ISubsidiary) => {
    try {
      console.log('Form data:', data)

      const response = deleteSubsidiary(subsidiary._id)

      // 성공 알림
      toaster.promise(response, {
        success: {
          title: '사업장을 삭제했습니다!'
        },
        error: {
          title: '사업장 삭제에 실패했습니다.'
        },
        loading: {title: '삭제 중...'}
      })

      router.push('/dashboard/emmition-factory')
    } catch (error) {
      toaster.error({
        title: '삭제 중 문제가 발생했습니다.'
      })
    }
  }

  return (
    <Dialog.RootProvider value={dialog} size={'xl'}>
      <Dialog.Trigger asChild>
        <Button
          variant="surface"
          colorPalette="red"
          border={'20px'}
          size="xl"
          padding={2}>
          사업장 삭제
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content padding={10} margin="auto">
            <form onSubmit={handleSubmit(onDelete)}>
              <Dialog.Header>
                <Dialog.Title display="flex" flexDirection="column" p={4}>
                  정말로 삭제하시겠습니까?
                  <Dialog.Description>
                    삭제된 데이터는 복구할 수 없습니다.
                  </Dialog.Description>
                </Dialog.Title>
              </Dialog.Header>

              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="ghost" padding={2}>
                    취소
                  </Button>
                </Dialog.ActionTrigger>
                <Dialog.ActionTrigger asChild>
                  <Button type="submit" variant={'ghost'} colorPalette="red" padding={2}>
                    삭제하기
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
    </Dialog.RootProvider>
  )
}
