import mongoose from 'mongoose'
import {setupCalorificValueData} from './calorific-value-data'
import {setupEmissionFactorData} from './emission-factor-data'
import {setupFuelData} from './fuel-data'

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/db'

const connectDatabaseAndSetupData = async () => {
  try {
    await mongoose.connect(MONGO_URL)
    console.log('✅ MongoDB 연결 성공')

    console.log('Setting up fuel data...')
    await setupFuelData()

    console.log('Setting up calorific value data...')
    await setupCalorificValueData()

    console.log('Setting up emission factor data...')
    await setupEmissionFactorData()
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error)
    process.exit(1)
  } finally {
    // Close the MongoDB connection
    await mongoose.disconnect()
    console.log('✅ MongoDB 연결 종료')
    // Exit the process with success code
    process.exit(0)
  }
}

connectDatabaseAndSetupData()
