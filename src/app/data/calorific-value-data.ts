import {CalorificValue, Fuel} from '../schemas'

export async function setupCalorificValueData() {
  try {
    // Clear existing calorific value data
    await CalorificValue.deleteMany({})

    // Get all fuels to match by code
    const fuels = await Fuel.find({}).lean()

    // Initial calorific value data from 발열량-에너지법 시행규칙 별표
    const initialCalorificValueData = [
      {code: '11', gcbUnit: 'MJ/kg', ncvUnit: 'TJ/Gg', gcv: 44.9, ncv: 42.2},
      {code: '14', gcbUnit: 'MJ/l', ncvUnit: 'TJ/1000㎥', gcv: 32.6, ncv: 30.3},
      {code: '18', gcbUnit: 'MJ/l', ncvUnit: 'TJ/1000㎥', gcv: 36.8, ncv: 34.3},
      {code: '21', gcbUnit: 'MJ/l', ncvUnit: 'TJ/1000㎥', gcv: 36.8, ncv: 34.3},
      {code: '20', gcbUnit: 'MJ/l', ncvUnit: 'TJ/1000㎥', gcv: 37.7, ncv: 35.3},
      {code: '32', gcbUnit: 'MJ/l', ncvUnit: 'TJ/1000㎥', gcv: 38.9, ncv: 36.4},
      {code: '33', gcbUnit: 'MJ/l', ncvUnit: 'TJ/1000㎥', gcv: 40.5, ncv: 38.0},
      {code: '34', gcbUnit: 'MJ/l', ncvUnit: 'TJ/1000㎥', gcv: 41.6, ncv: 39.2},
      {code: '35', gcbUnit: 'MJ/kg', ncvUnit: 'TJ/Gg', gcv: 50.4, ncv: 46.3},
      {code: '36', gcbUnit: 'MJ/kg', ncvUnit: 'TJ/Gg', gcv: 49.6, ncv: 45.6},
      {code: '24', gcbUnit: 'MJ/l', ncvUnit: 'TJ/1000㎥', gcv: 32.3, ncv: 30.3},
      {code: '31', gcbUnit: 'MJ/l', ncvUnit: 'TJ/1000㎥', gcv: 33.3, ncv: 31.0},
      {code: '15', gcbUnit: 'MJ/l', ncvUnit: 'TJ/1000㎥', gcv: 36.5, ncv: 34.1},
      {code: '25', gcbUnit: 'MJ/kg', ncvUnit: 'TJ/Gg', gcv: 41.5, ncv: 39.2},
      {code: '26', gcbUnit: 'MJ/l', ncvUnit: 'TJ/1000㎥', gcv: 39.8, ncv: 37.0},
      {code: '27', gcbUnit: 'MJ/kg', ncvUnit: 'TJ/Gg', gcv: 33.5, ncv: 31.6},
      {code: '57', gcbUnit: 'MJ/l', ncvUnit: 'TJ/1000㎥', gcv: 36.9, ncv: 34.3},
      {code: '58', gcbUnit: 'MJ/l', ncvUnit: 'TJ/1000㎥', gcv: 40.0, ncv: 37.9},
      {code: '51', gcbUnit: 'MJ/kg', ncvUnit: 'TJ/Gg', gcv: 54.6, ncv: 49.3},
      {code: '55', gcbUnit: 'MJ/㎥', ncvUnit: 'TJ/10^6㎥', gcv: 43.6, ncv: 39.4},
      {code: '56', gcbUnit: 'MJ/㎥', ncvUnit: 'TJ/10^6㎥', gcv: 62.8, ncv: 57.7},
      {code: '22', gcbUnit: 'MJ/㎥', ncvUnit: 'TJ/10^6㎥', gcv: 62.8, ncv: 57.7},
      {code: '39', gcbUnit: 'MJ/kg', ncvUnit: 'TJ/Gg', gcv: 18.9, ncv: 18.6},
      {code: '40', gcbUnit: 'MJ/kg', ncvUnit: 'TJ/Gg', gcv: 24.7, ncv: 24.4},
      {code: '42', gcbUnit: 'MJ/kg', ncvUnit: 'TJ/Gg', gcv: 25.8, ncv: 24.7},
      {code: '41', gcbUnit: 'MJ/kg', ncvUnit: 'TJ/Gg', gcv: 29.3, ncv: 28.2},
      {code: '43', gcbUnit: 'MJ/kg', ncvUnit: 'TJ/Gg', gcv: 22.7, ncv: 21.4},
      {code: '45', gcbUnit: 'MJ/kg', ncvUnit: 'TJ/Gg', gcv: 29.1, ncv: 28.9},
      {code: '61', gcbUnit: 'MJ/㎾h', ncvUnit: 'TJ/GWh', gcv: 9.6, ncv: 9.6},
      {code: '87', gcbUnit: 'MJ/l', ncvUnit: 'TJ/1000㎥', gcv: 38.53, ncv: 27}
    ]

    // IPCC data for codes that don't have values in the first source
    const ipccCalorificValueData = [
      {code: '12', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 27.5},
      {code: '13', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 44.2},
      {code: '16', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 44.3},
      {code: '17', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 44.1},
      {code: '19', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 38.1},
      {code: '23', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 46.4},
      {code: '28', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 43.0},
      {code: '29', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 49.5},
      {code: '30', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 40.2},
      {code: '37', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 40.2},
      {code: '44', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 11.9},
      {code: '52', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 37.8},
      {code: '53', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 2.47},
      {code: '54', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 7.06},
      {code: '73', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 15.6},
      {code: '88', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 15.6},
      {code: '89', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 15.6},
      {code: '90', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 29.5},
      {code: '83', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 50.4},
      {code: '84', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 27.0},
      {code: '86', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 50.4},
      {code: '92', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 11.6},
      {code: '93', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 11.6},
      {code: '94', gcbUnit: 'TJ/Gg', ncvUnit: 'TJ/Gg', gcv: null, ncv: 11.6}
    ]

    // Combine both data sources
    const allCalorificValueData = [
      ...initialCalorificValueData,
      ...ipccCalorificValueData
    ]

    // Create calorific value entries by matching fuel codes
    const calorificValueEntries = []

    for (const data of allCalorificValueData) {
      const matchingFuel = fuels.find(fuel => fuel.code === data.code)

      if (matchingFuel) {
        calorificValueEntries.push({
          fuelId: matchingFuel._id,
          gcbUnit: data.gcbUnit,
          ncvUnit: data.ncvUnit,
          gcv: data.gcv,
          ncv: data.ncv
        })
      } else {
        console.log(`No matching fuel found for code: ${data.code}`)
      }
    }

    // Insert calorific values
    if (calorificValueEntries.length > 0) {
      const result = await CalorificValue.insertMany(calorificValueEntries)
      console.log(`${result.length} calorific values inserted successfully`)
    } else {
      console.log('No calorific values to insert')
    }
  } catch (error) {
    console.error('Error during calorific value data setup:', error)
  } finally {
    // Close the connection after setup
    // mongoose.connection.close()
  }
}
