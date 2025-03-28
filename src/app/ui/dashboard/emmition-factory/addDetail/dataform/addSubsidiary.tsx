'use client'

import {
  Button,
  CloseButton,
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

export const AddSubsidiary = () => {
  const dialog = useDialog()
  const [organization, setOrganization] = useState<IOrganization>()
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
    if (organization?._id) {
      reset({organization: organization._id}) // `defaultValues` 업데이트
    }
  }, [organization, reset])

  const onSubmit = async (data: ISubsidiary) => {
    const response = createSubsidiary(data)
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
  }

  return (
    <Dialog.RootProvider value={dialog} size={'xl'}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="xl">
          추가 하기
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content padding={10} margin="auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Header>
                <Dialog.Title display="flex" flexDirection="column" p={4}>
                  {organization?.name || '-'} 사업장 추가
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Fieldset.Root padding={2} gap={4}>
                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>사업장명</Field.Label>
                      <Input {...register('name')} placeholder="사업장명" />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>대표자</Field.Label>
                      <Input {...register('representative')} placeholder="대표자" />
                    </Field.Root>
                  </HStack>
                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>사업자 등록번호</Field.Label>
                      <Input
                        {...register('registrationNumber')}
                        placeholder="사업자 등록번호"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>대표업종</Field.Label>
                      <Input {...register('industryType')} placeholder="대표업종" />
                    </Field.Root>
                  </HStack>
                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>사업장 전화번호</Field.Label>
                      <Input {...register('phoneNumber')} placeholder="사업장 전화번호" />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>사업장 소재지</Field.Label>
                      <Input {...register('address')} placeholder="사업장 소재지" />
                    </Field.Root>
                  </HStack>
                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>주 생산품(처리물질)</Field.Label>
                      <Input
                        {...register('mainProducts')}
                        placeholder="주 생산품(처리물질)"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>생산량(처리량)</Field.Label>
                      <Input
                        {...register('productionVolume')}
                        type="number"
                        placeholder="생산량(처리량)"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>단위 (예: 톤, 리터 등)</Field.Label>

                      <Input {...register('unit')} placeholder="단위 (예: 톤, 리터 등)" />
                    </Field.Root>
                  </HStack>
                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>상시종업원수</Field.Label>
                      <Input
                        {...register('numberOfEmployees')}
                        type="number"
                        placeholder="상시종업원수"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>자본금(원)</Field.Label>
                      <Input
                        {...register('capital')}
                        type="number"
                        placeholder="자본금(원)"
                      />
                    </Field.Root>
                  </HStack>
                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>당해연도 매출액(원)</Field.Label>
                      <Input
                        {...register('annualRevenue')}
                        type="number"
                        placeholder="당해연도 매출액(원)"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>당해연도 에너지 비용(원)</Field.Label>
                      <Input
                        {...register('annualEnergyCost')}
                        type="number"
                        placeholder="당해연도 에너지 비용(원)"
                      />
                    </Field.Root>
                  </HStack>
                </Fieldset.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" m={2}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Dialog.ActionTrigger asChild>
                  <Button type="submit" m={2}>
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
    </Dialog.RootProvider>
  )
}
