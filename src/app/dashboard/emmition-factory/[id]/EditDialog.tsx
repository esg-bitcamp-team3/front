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
  useDialog
} from '@chakra-ui/react'

import {useForm} from 'react-hook-form'
import {IOrganization, ISubsidiary} from '@/lib/api/interfaces/retrieveInterfaces'
import {toaster} from '@/components/ui/toaster'
import {getMyOrganizations} from '@/lib/api/my'
import {useEffect, useState} from 'react'

import {updateSubsidiary} from '@/lib/api/put'

export const EditSubsidiary = ({subsidiary}: {subsidiary: ISubsidiary}) => {
  const dialog = useDialog()
  const [organization, setOrganization] = useState<IOrganization>()
  const [updatedSubsidiary, setUpdatedSubsidiary] = useState<ISubsidiary | null>(
    subsidiary
  )
  useForm<ISubsidiary>({
    defaultValues: {organization: organization?._id}
  })

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

  const onSubmit = async (data: ISubsidiary) => {
    try {
      console.log('Form data:', data)

      // updateSubsidiary 호출 후 수정된 자회사 데이터 반영
      const updated = await updateSubsidiary(subsidiary._id, data)

      // 상태 업데이트
      setUpdatedSubsidiary(updated)

      console.log('Updated subsidiary:', updated)

      // 성공 알림
      toaster.promise(() => updateSubsidiary(subsidiary._id, data), {
        success: {
          title: '변경 사항이 저장되었습니다!'
        },
        error: {
          title: '변경 사항 저장에 실패했습니다.'
        },
        loading: {title: '저장 중...'}
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
        <Button variant="outline" size="sm" mt={8}>
          정보 수정
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content padding={10} margin="auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Header>
                <Dialog.Title display="flex" flexDirection="column" p={4}>
                  {organization?.name || '-'} 사업장 수정
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Fieldset.Root padding={2} gap={4}>
                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>사업장명</Field.Label>
                      <Input
                        defaultValue={subsidiary?.name || '-'}
                        placeholder="사업장명"
                        {...register('name')} // react-hook-form의 register를 사용하여 상태를 관리
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>대표자</Field.Label>
                      <Input
                        defaultValue={subsidiary?.representative || '-'}
                        placeholder="대표자"
                        {...register('representative')}
                      />
                    </Field.Root>
                  </HStack>
                  <HStack gap={4}>
                    <Field.Root>
                      <Field.Label>사업자 등록번호</Field.Label>
                      <Input
                        defaultValue={subsidiary?.registrationNumber || ''}
                        type="text"
                        placeholder="사업자 등록번호"
                        {...register('registrationNumber')}
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
                    취소
                  </Button>
                </Dialog.ActionTrigger>
                <Dialog.ActionTrigger asChild>
                  <Button type="submit" m={2}>
                    저장
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
