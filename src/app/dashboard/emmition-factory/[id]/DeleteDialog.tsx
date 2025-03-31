'use client'

import {
  Button,
  CloseButton,
  DataList,
  Dialog,
  Field,
  Fieldset,
  HStack,
  Input,
  Portal,
  useDialog,
  UseDialogReturn
} from '@chakra-ui/react'

import {useForm} from 'react-hook-form'
import {IOrganization, ISubsidiary} from '@/lib/api/interfaces/retrieveInterfaces'
import {createSubsidiary} from '@/lib/api/post'
import {toaster} from '@/components/ui/toaster'
import {getMyOrganizations} from '@/lib/api/my'
import {useEffect, useState} from 'react'
import {revalidatePath} from 'next/cache'
import {useRouter} from 'next/navigation'
import SubsidiaryListTab from '../tab/ListTab'
import {updateSubsidiary} from '@/lib/api/put'
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
      setOrganization(response.data.organization.organization)
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

      // 성공 알림
      toaster.promise(() => deleteSubsidiary(subsidiary._id), {
        success: {
          title: 'Successfully delete!',
          description: 'The subsidiary information has been updated.'
        },
        error: {
          title: 'Delete failed',
          description: 'Something went wrong during the update.'
        },
        loading: {title: 'Updating...', description: 'Please wait'}
      })

      window.location.reload()
    } catch (error) {
      console.error('Error updating subsidiary:', error)
      toaster.error({
        title: 'Failed to update',
        description: 'There was an issue updating the subsidiary.'
      })
    }
  }

  return (
    <Dialog.RootProvider value={dialog} size={'xl'}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="xl">
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
                  <Button type="submit" m={-1}>
                    삭제하기
                  </Button>
                </Dialog.ActionTrigger>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" m={0}>
                    취소
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
