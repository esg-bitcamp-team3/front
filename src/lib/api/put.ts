import apiClient from './apiClient'
import {
  ICarbonEmissionGoal,
  ISubsidiary,
  IUserInfo
} from './interfaces/retrieveInterfaces'

import {IEmissionInfo} from './interfaces/retrieveInterfaces'

import {useEffect, useState} from 'react'
import {Response} from './type'
import {NewPassword} from './interfaces/auth'
import {IEmissionForm} from './interfaces/updateForm'

// `updateSubsidiary` 함수에서 API 경로를 `/subsidiary`로 변경

// updateSubsidiary 함수에서 수정된 데이터를 반환하도록 수정
export async function updateSubsidiary(id: string, data: Partial<ISubsidiary>) {
  try {
    console.log(data)
    const response = await fetch(`http://localhost:4000/subsidiaries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // 수정할 데이터
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to update subsidiary. Server responded with: ${errorText}`)
    }

    const result = await response.json() // 수정된 데이터 반환
    console.log('Updated subsidiary:', result)
    return result.data // 실제 수정된 자회사 데이터를 반환
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message)
    } else {
      console.error('An unknown error occurred:', error)
    }
    throw error // 예외 발생 시 다시 throw
  }
}

export async function updateEmissionDataFromElectricity({
  id,
  data
}: {
  id: string
  data: Partial<IEmissionForm>
}) {
  return await apiClient.put<Response<IEmissionInfo>, Partial<IEmissionForm>>(
    `/data/electricity/${id}`,
    {
      withAuth: true,
      body: data
    }
  )
}

export async function updateEmissionDataFromStationaryCombustion({
  id,
  data
}: {
  id: string
  data: Partial<IEmissionForm>
}) {
  return await apiClient.put<Response<IEmissionInfo>, Partial<IEmissionForm>>(
    `/data/stationary-combustion/${id}`,
    {
      withAuth: true,
      body: data
    }
  )
}

export async function updateEmissionDataFromMobileCombustion({
  id,
  data
}: {
  id: string
  data: Partial<IEmissionForm>
}) {
  return await apiClient.put<Response<IEmissionInfo>, Partial<IEmissionForm>>(
    `/data/mobile-combustion/${id}`,
    {
      withAuth: true,
      body: data
    }
  )
}

export async function updateEmissionDataFromSteam({
  id,
  data
}: {
  id: string
  data: Partial<IEmissionForm>
}) {
  return await apiClient.put<Response<IEmissionInfo>, Partial<IEmissionForm>>(
    `/data/steam/${id}`,
    {
      withAuth: true,
      body: data
    }
  )
}
export async function updatePassword({data}: {data: NewPassword}) {
  return await apiClient.put<Response<IUserInfo>, NewPassword>(`/user/password`, {
    body: data,
    withAuth: true
  })
}

export async function updateEmissionGoal({
  id,
  data
}: {
  id: string
  data: Partial<ICarbonEmissionGoal>
}) {
  return await apiClient.put<Response<ICarbonEmissionGoal>, Partial<ICarbonEmissionGoal>>(
    `/carbon-emission-goals/${id}`,
    {
      withAuth: true,
      body: data
    }
  )
}
