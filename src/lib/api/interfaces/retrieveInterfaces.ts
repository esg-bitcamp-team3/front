import * as E from './enumTypes'

export interface IOrganization {
  _id: string
  name: string // 법인명
  representative: string // 대표자
  registrationNumber: string // 법인등록번호
  industryType: string // 대표업종
  phoneNumber: string // 법인전화번호
  address: string // 법인소재지
  mainProducts: string // 주 생산품(처리물질)
  productionVolume: number // 생산량(처리량)
  unit: string // 단위 (예: 톤, 리터 등)
  numberOfEmployees: number // 상시종업원수
  capital: number // 자본금(원)
  annualRevenue: number // 당해연도 매출액(원)
  annualEnergyCost: number // 당해연도 에너지 비용(원)
}

export interface ILittleOrganization {
  name: string //법인명
  registrationNumber: string // 법인등록번호
  industryType: string // 대표업종
}

export interface IRevenueRecord {
  organizationId: string // 법인
  year: number // 연도
  revenue: number // 매출액(원)
  energyCost: number // 에너지 비용(원)
}

export interface IOrganizationRevenueByYear {
  [year: string]: IRevenueRecord
}

export interface IOrganizationInfo {
  organization: IOrganization
  subsidiaries: ISubsidiary[]
}

export interface ISubsidiary {
  longitude(longitude: any): unknown
  latitude(latitude: any): unknown
  _id: string
  organization?: string // 소속 법인
  name?: string // 사업장명
  representative?: string // 대표자
  registrationNumber?: string // 사업자 등록번호
  industryType?: string // 대표업종
  phoneNumber?: string // 사업장 전화번호
  address?: string // 사업장 소재지
  mainProducts?: string // 주 생산품(처리물질)
  productionVolume?: number // 생산량(처리량)
  unit?: string // 단위 (예: 톤, 리터 등)
  numberOfEmployees?: number // 상시종업원수
  capital?: number // 자본금(원)
  annualRevenue?: number // 당해연도 매출액(원)
  annualEnergyCost?: number // 당해연도 에너지 비용(원)
}

export interface IFuel {
  _id: string
  code: string
  name: string
  type: string
}

export interface IEmissionFactor {
  _id: string
  fuelId: string

  efCO2_energy: number
  efCO2_manufacturing_construction: number
  efCO2_commercial_public: number
  efCO2_domestic_etc: number

  efCH4_energy: number
  efCH4_manufacturing_construction: number
  efCH4_commercial_public: number
  efCH4_domestic_etc: number

  efN2O_energy_manufacturing_construction: number
  efN2O_commercial_public_domestic_etc: number

  efCO2_mobile: number // CO2 배출계수 (이동연소)
  efCH4_mobile: number // CH4 배출계수 (이동연소)
  efN2O_mobile: number // N2O 배출계수 (이동연소)
}

export interface ICalorificValue {
  _id: string
  fuelId: string
  gcbUnit: string // MJ/kg, TJ/Gg
  ncvUnit: string // MJ/I, TJ/1000㎥**
  gcv: number
  ncv: number
}

export interface IFuelInfo {
  fuel: IFuel
  calorificValue: ICalorificValue | null
  emissionFactor: IEmissionFactor | null
}

export interface IIndirectEmissionFromSteam {
  _id?: string
  subsidiary?: string // 사업장
  year?: number // 연도
  serialNumber?: string // 일련번호
  facilityName?: string // 내부시설명
  emissionActivity?: E.IndirectEmissionActivityTypeForSteam // 배출활동
  activityData?: E.ActivityDataForSteam // 활동자료
  total?: number // 합계 배출량
  uncertainty?: number // 불확도
  data1: number // 1월 배출량
  data2: number // 2월 배출량
  data3: number // 3월 배출량
  data4: number // 4월 배출량
  data5: number // 5월 배출량
  data6: number // 6월 배출량
  data7: number // 7월 배출량
  data8: number // 8월 배출량
  data9: number // 9월 배출량
  data10: number // 10월 배출량
  data11: number // 11월 배출량
  data12: number // 12월 배출량
  createdBy: string // 작성자
  updatedBy: string // 수정자
}

export interface IEmissionFromStationaryCombustion {
  _id?: string
  subsidiary?: string // 사업장
  year?: number // 연도
  serialNumber?: string // 일련번호
  facilityName?: string // 내부시설명
  emissionActivity?: E.EmissionActivityTypeForStationaryCombustion // 배출활동
  activityData?: E.ActivityDataForStationaryCombustion // 활동자료
  total?: number // 합계 배출량
  uncertainty?: number // 불확도
  data1: number // 1월 배출량
  data2: number // 2월 배출량
  data3: number // 3월 배출량
  data4: number // 4월 배출량
  data5: number // 5월 배출량
  data6: number // 6월 배출량
  data7: number // 7월 배출량
  data8: number // 8월 배출량
  data9: number // 9월 배출량
  data10: number // 10월 배출량
  data11: number // 11월 배출량
  data12: number // 12월 배출량
  createdBy: string // 작성자
  updatedBy: string // 수정자
}

export interface IEmissionInfo {
  _id?: string
  subsidiary?: string // 사업장
  year?: number // 연도
  serialNumber?: string // 일련번호
  facilityName?: string // 내부시설명
  emissionActivity?: string // 배출활동
  activityData?: IFuel // 활동자료
  total?: number // 합계 배출량
  uncertainty?: number // 불확도
  data1: number // 1월 배출량
  data2: number // 2월 배출량
  data3: number // 3월 배출량
  data4: number // 4월 배출량
  data5: number // 5월 배출량
  data6: number // 6월 배출량
  data7: number // 7월 배출량
  data8: number // 8월 배출량
  data9: number // 9월 배출량
  data10: number // 10월 배출량
  data11: number // 11월 배출량
  data12: number // 12월 배출량
  createdBy: string // 작성자
  updatedBy: string // 수정자
}

export interface IEmissionFromMobileCombustion {
  _id: string
  subsidiary: string // 사업장
  year: number // 연도
  serialNumber: string // 일련번호
  facilityName: string // 내부시설명
  emissionActivity: E.EmissionActivityTypeForMobileCombustion // 배출활동
  activityData: E.ActivityDataForMobileCombustion // 활동자료
  total: number // 합계 배출량
  uncertainty: number // 불확도
  data1: number // 1월 배출량
  data2: number // 2월 배출량
  data3: number // 3월 배출량
  data4: number // 4월 배출량
  data5: number // 5월 배출량
  data6: number // 6월 배출량
  data7: number // 7월 배출량
  data8: number // 8월 배출량
  data9: number // 9월 배출량
  data10: number // 10월 배출량
  data11: number // 11월 배출량
  data12: number // 12월 배출량
  createdBy: string // 작성자
  updatedBy: string // 수정자
}

export interface IIndirectEmissionFromElectricity {
  _id: string
  subsidiary: string // 사업장
  year: number // 연도
  serialNumber: string // 일련번호
  facilityName: string // 내부시설명
  emissionActivity: E.IndirectEmissionActivityTypeForElectricity // 배출활동
  activityData: E.ActivityDataForElectricity // 활동자료
  total: number // 합계 배출량
  uncertainty: number // 불확도
  data1: number // 1월 배출량
  data2: number // 2월 배출량
  data3: number // 3월 배출량
  data4: number // 4월 배출량
  data5: number // 5월 배출량
  data6: number // 6월 배출량
  data7: number // 7월 배출량
  data8: number // 8월 배출량
  data9: number // 9월 배출량
  data10: number // 10월 배출량
  data11: number // 11월 배출량
  data12: number // 12월 배출량
  createdBy: string // 작성자
  updatedBy: string // 수정자
}

export interface IScopeData {
  stationary: number
  mobile: number
  total: number
}

export interface IMonthlyEmissionData {
  stationary: number[]
  mobile: number[]
  total: number[]
}
export interface IYearlyEmissionData {
  [year: number]: {
    stationary: number
    mobile: number
    total: number
  }
}

export interface IMothlyData {
  stationary: number[]
  mobile: number[]
  total: number[]
}

export interface ICarbonEmissionGoal {
  _id: string
  organization: string
  year: number
  emissionGoal: number
}

export interface ICarbonEmissionGoalsByYear {
  [year: string]: ICarbonEmissionGoal
}
