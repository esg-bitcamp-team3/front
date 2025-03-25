import {Fuel, EmssionFactor, IEmissionFactor} from '../schemas'

export async function setupEmissionFactorData() {
  try {
    // Clear existing emission factor data
    await EmssionFactor.deleteMany({})

    // Get all fuels to match by code
    const fuels = await Fuel.find({}).lean()

    // Emission factor data from 2006 IPCC Guidelines
    const emissionFactorData = [
      {
        code: '11',
        name: '원유',
        efCO2: 73300,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '12',
        name: '오리멀젼',
        efCO2: 77000,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '13',
        name: '천연가스액',
        efCO2: 64200,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '14',
        name: '휘발유',
        efCO2: 69300,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6,
        efCO2_mobile: 69300,
        efCH4_mobile: 25,
        efN2O_mobile: 8.0
      },
      {
        code: '15',
        name: '항공용 가솔린',
        efCO2: 70000,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '16',
        name: 'JP-8',
        efCO2: 70000,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '17',
        name: 'Jet A-1',
        efCO2: 71500,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '18',
        name: '실내등유',
        efCO2: 71900,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6,
        efCO2_mobile: 71900,
        efCH4_mobile: 0,
        efN2O_mobile: 0
      },
      {
        code: '21',
        name: '보일러 등유',
        efCO2: 71900,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6,
        efCO2_mobile: 71900,
        efCH4_mobile: 0,
        efN2O_mobile: 0
      },
      {
        code: '19',
        name: '혈암유',
        efCO2: 73300,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '20',
        name: '경유',
        efCO2: 74100,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6,
        efCO2_mobile: 74100,
        efCH4_mobile: 3.9,
        efN2O_mobile: 3.9
      },
      {
        code: '32',
        name: 'B-A유',
        efCO2: 74100,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '33',
        name: 'B-B유',
        efCO2: 77400,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '34',
        name: 'B-C유',
        efCO2: 77400,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '22',
        name: '액화석유가스(LPG)',
        efCO2: 63100,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 1,
        efCH4_commercial_public: 5,
        efCH4_domestic_etc: 5,
        efN2O_energy_manufacturing_construction: 0.1,
        efN2O_commercial_public_domestic_etc: 0.1,
        efCO2_mobile: 63100,
        efCH4_mobile: 62,
        efN2O_mobile: 0.2
      },
      {
        code: '56',
        name: '도시가스(LPG)',
        efCO2: 63100,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 1,
        efCH4_commercial_public: 5,
        efCH4_domestic_etc: 5,
        efN2O_energy_manufacturing_construction: 0.1,
        efN2O_commercial_public_domestic_etc: 0.1
      },
      {
        code: '35',
        name: '프로판',
        efCO2: 63100,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 1,
        efCH4_commercial_public: 5,
        efCH4_domestic_etc: 5,
        efN2O_energy_manufacturing_construction: 0.1,
        efN2O_commercial_public_domestic_etc: 0.1
      },
      {
        code: '36',
        name: '부탄',
        efCO2: 63100,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 1,
        efCH4_commercial_public: 5,
        efCH4_domestic_etc: 5,
        efN2O_energy_manufacturing_construction: 0.1,
        efN2O_commercial_public_domestic_etc: 0.1
      },
      {
        code: '23',
        name: '에탄',
        efCO2: 61600,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 1,
        efCH4_commercial_public: 5,
        efCH4_domestic_etc: 5,
        efN2O_energy_manufacturing_construction: 0.1,
        efN2O_commercial_public_domestic_etc: 0.1
      },
      {
        code: '24',
        name: '납사',
        efCO2: 73300,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '25',
        name: '아스팔트',
        efCO2: 80700,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '26',
        name: '윤활유',
        efCO2: 73300,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '27',
        name: '석유코크',
        efCO2: 97500,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '28',
        name: '정제연료(반제품)',
        efCO2: 73300,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '29',
        name: '정제가스',
        efCO2: 57600,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 1,
        efCH4_commercial_public: 5,
        efCH4_domestic_etc: 5,
        efN2O_energy_manufacturing_construction: 0.1,
        efN2O_commercial_public_domestic_etc: 0.1
      },
      {
        code: '30',
        name: '파라핀왁스',
        efCO2: 73300,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '31',
        name: '용제',
        efCO2: 73300,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '37',
        name: '기타',
        efCO2: 73300,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '39',
        name: '국내무연탄',
        efCO2: 98300,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 10,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 300,
        efN2O_energy_manufacturing_construction: 1.5,
        efN2O_commercial_public_domestic_etc: 1.5
      },
      {
        code: '40',
        name: '수입무연탄',
        efCO2: 98300,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 10,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 300,
        efN2O_energy_manufacturing_construction: 1.5,
        efN2O_commercial_public_domestic_etc: 1.5
      },
      {
        code: '41',
        name: '원료용유연탄',
        efCO2: 94600,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 10,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 300,
        efN2O_energy_manufacturing_construction: 1.5,
        efN2O_commercial_public_domestic_etc: 1.5
      },
      {
        code: '42',
        name: '연료용유연탄',
        efCO2: 94600,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 10,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 300,
        efN2O_energy_manufacturing_construction: 1.5,
        efN2O_commercial_public_domestic_etc: 1.5
      },
      {
        code: '43',
        name: '아역청탄',
        efCO2: 96100,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 10,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 300,
        efN2O_energy_manufacturing_construction: 1.5,
        efN2O_commercial_public_domestic_etc: 1.5
      },
      {
        code: '44',
        name: '갈탄',
        efCO2: 101000,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 10,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 300,
        efN2O_energy_manufacturing_construction: 1.5,
        efN2O_commercial_public_domestic_etc: 1.5
      },
      {
        code: '45',
        name: '코크스',
        efCO2: 107000,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 10,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 300,
        efN2O_energy_manufacturing_construction: 1.5,
        efN2O_commercial_public_domestic_etc: 1.5
      },
      {
        code: '51',
        name: '천연가스(LNG)',
        efCO2: 56100,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 1,
        efCH4_commercial_public: 5,
        efCH4_domestic_etc: 5,
        efN2O_energy_manufacturing_construction: 0.1,
        efN2O_commercial_public_domestic_etc: 0.1,
        efCO2_mobile: 56100,
        efCH4_mobile: 92,
        efN2O_mobile: 3.0
      },
      {
        code: '52',
        name: '코크스가스',
        efCO2: 44400,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 1,
        efCH4_commercial_public: 5,
        efCH4_domestic_etc: 5,
        efN2O_energy_manufacturing_construction: 0.1,
        efN2O_commercial_public_domestic_etc: 0.1
      },
      {
        code: '53',
        name: '고로가스',
        efCO2: 260000,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 1,
        efCH4_commercial_public: 5,
        efCH4_domestic_etc: 5,
        efN2O_energy_manufacturing_construction: 0.1,
        efN2O_commercial_public_domestic_etc: 0.1
      },
      {
        code: '55',
        name: '도시가스(LNG)',
        efCO2: 56100,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 1,
        efCH4_commercial_public: 5,
        efCH4_domestic_etc: 5,
        efN2O_energy_manufacturing_construction: 0.1,
        efN2O_commercial_public_domestic_etc: 0.1
      },
      {
        code: '57',
        name: '부생연료 1호',
        efCO2: 72000,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '58',
        name: '부생연료 2호',
        efCO2: 77000,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '73',
        name: '목재/목재폐기물',
        efCO2: 112000,
        efCH4_energy: 30,
        efCH4_manufacturing_construction: 30,
        efCH4_commercial_public: 300,
        efCH4_domestic_etc: 300,
        efN2O_energy_manufacturing_construction: 4,
        efN2O_commercial_public_domestic_etc: 4
      },
      {
        code: '83',
        name: '슬러지가스',
        efCO2: 54600,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 1,
        efCH4_commercial_public: 5,
        efCH4_domestic_etc: 5,
        efN2O_energy_manufacturing_construction: 0.1,
        efN2O_commercial_public_domestic_etc: 0.1
      },
      {
        code: '84',
        name: '바이오가솔린',
        efCO2: 70800,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '86',
        name: '매립지가스',
        efCO2: 54600,
        efCH4_energy: 30,
        efCH4_manufacturing_construction: 1,
        efCH4_commercial_public: 5,
        efCH4_domestic_etc: 5,
        efN2O_energy_manufacturing_construction: 0.1,
        efN2O_commercial_public_domestic_etc: 0.1
      },
      {
        code: '87',
        name: '바이오디젤',
        efCO2: 70800,
        efCH4_energy: 1,
        efCH4_manufacturing_construction: 3,
        efCH4_commercial_public: 10,
        efCH4_domestic_etc: 10,
        efN2O_energy_manufacturing_construction: 0.6,
        efN2O_commercial_public_domestic_etc: 0.6
      },
      {
        code: '90',
        name: '목탄',
        efCO2: 112000,
        efCH4_energy: 3,
        efCH4_manufacturing_construction: 200,
        efCH4_commercial_public: 200,
        efCH4_domestic_etc: 200,
        efN2O_energy_manufacturing_construction: 4,
        efN2O_commercial_public_domestic_etc: 1
      },
      {
        code: '49',
        name: 'LPG(차량)',
        efCO2_mobile: 63100,
        efCH4_mobile: 62,
        efN2O_mobile: 0.2
      },
      {
        code: '48',
        name: 'CNG(차량)',
        efCO2_mobile: 56100,
        efCH4_mobile: 92,
        efN2O_mobile: 3.0
      },
      {
        code: '47',
        name: 'LNG(차량)',
        efCO2_mobile: 56100,
        efCH4_mobile: 92,
        efN2O_mobile: 3.0
      }
    ]

    // Create emission factor entries
    const emissionFactorEntries: Partial<IEmissionFactor>[] = []

    // Now process the main data
    emissionFactorData.forEach(data => {
      const fuelId = fuels.find(fuel => fuel.code === data.code)?._id?.toString()

      if (fuelId !== undefined) {
        emissionFactorEntries.push({
          fuelId: fuelId,
          // Static combustion emissions
          efCO2_energy: data.efCO2 || 0,
          efCO2_manufacturing_construction: data.efCO2 || 0,
          efCO2_commercial_public: data.efCO2 || 0,
          efCO2_domestic_etc: data.efCO2 || 0,
          efCH4_energy: data.efCH4_energy || 0,
          efCH4_manufacturing_construction: data.efCH4_manufacturing_construction || 0,
          efCH4_commercial_public: data.efCH4_commercial_public || 0,
          efCH4_domestic_etc: data.efCH4_domestic_etc || 0,
          efN2O_energy_manufacturing_construction:
            data.efN2O_energy_manufacturing_construction || 0,
          efN2O_commercial_public_domestic_etc:
            data.efN2O_commercial_public_domestic_etc || 0,
          // Mobile combustion emissions
          efCO2_mobile: data.efCO2_mobile || 0,
          efCH4_mobile: data.efCH4_mobile || 0,
          efN2O_mobile: data.efN2O_mobile || 0
        })
      } else {
        console.log(`No matching fuel found for code: ${data.code}`)
      }
    })

    // Insert emission factors
    if (emissionFactorEntries.length > 0) {
      const result = await EmssionFactor.insertMany(emissionFactorEntries)
      console.log(`${result.length} emission factors inserted successfully`)
    } else {
      console.log('No emission factors to insert')
    }
  } catch (error) {
    console.error('Error setting up emission factor data:', error)
  }
}
