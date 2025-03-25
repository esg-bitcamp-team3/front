import mongoose from 'mongoose'
import {Organization} from '../schemas/organization'
import {Subsidiary} from '../schemas/subsidiary'
import {
  EmissionFromStationaryCombustion,
  EmissionActivityTypeForStationaryCombustion,
  ActivityDataForStationaryCombustion
} from '../schemas/emission_data/stationary_combustion'

// MongoDB connection URL
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/db'

// Random data generators
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRandomFloat = (min: number, max: number, decimals = 2): number => {
  const value = Math.random() * (max - min) + min
  return parseFloat(value.toFixed(decimals))
}

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

// Generate random organization data
const generateOrganizations = async (count: number) => {
  console.log(`Generating ${count} organizations...`)

  const organizationData = []

  for (let i = 0; i < count; i++) {
    organizationData.push({
      name: `Sample Company ${i + 1}`,
      representative: `CEO ${i + 1}`,
      registrationNumber: `110-81-${getRandomInt(10000, 99999)}`,
      industryType: getRandomElement([
        'Manufacturing',
        'Energy',
        'Chemical',
        'Technology',
        'Construction'
      ]),
      phoneNumber: `02-${getRandomInt(1000, 9999)}-${getRandomInt(1000, 9999)}`,
      address: `Seoul, Korea, Office Building ${getRandomInt(1, 100)}`,
      mainProducts: getRandomElement([
        'Electronics',
        'Semiconductors',
        'Automobiles',
        'Steel',
        'Chemicals'
      ]),
      productionVolume: getRandomInt(1000, 10000),
      unit: getRandomElement(['ton', 'kg', 'unit']),
      numberOfEmployees: getRandomInt(50, 5000),
      capital: getRandomInt(100000000, 10000000000),
      annualRevenue: getRandomInt(1000000000, 100000000000),
      annualEnergyCost: getRandomInt(10000000, 1000000000)
    })
  }

  // Insert organizations
  const organizations = await Organization.insertMany(organizationData)
  console.log(`✅ ${organizations.length} organizations created`)
  return organizations
}

// Generate random subsidiaries for each organization
const generateSubsidiaries = async (organizations: any[], count: number) => {
  console.log(`Generating ${count} subsidiaries per organization...`)

  const subsidiaryData = []

  for (const org of organizations) {
    for (let i = 0; i < count; i++) {
      subsidiaryData.push({
        organization: org._id,
        name: `${org.name} - Branch ${i + 1}`,
        representative: `Manager ${i + 1}`,
        registrationNumber: `220-85-${getRandomInt(10000, 99999)}`,
        industryType: org.industryType,
        phoneNumber: `02-${getRandomInt(1000, 9999)}-${getRandomInt(1000, 9999)}`,
        address: `${getRandomElement([
          'Seoul',
          'Busan',
          'Incheon',
          'Daegu',
          'Ulsan'
        ])}, Korea`,
        mainProducts: org.mainProducts,
        productionVolume: getRandomInt(500, 5000),
        unit: org.unit,
        numberOfEmployees: getRandomInt(10, 1000),
        capital: getRandomInt(10000000, 1000000000),
        annualRevenue: getRandomInt(100000000, 10000000000),
        annualEnergyCost: getRandomInt(5000000, 500000000)
      })
    }
  }

  // Insert subsidiaries
  const subsidiaries = await Subsidiary.insertMany(subsidiaryData)
  console.log(`✅ ${subsidiaries.length} subsidiaries created`)
  return subsidiaries
}

// Generate random emission data for each subsidiary
const generateEmissions = async (
  subsidiaries: any[],
  year: number,
  facilitiesPerSubsidiary: number
) => {
  console.log(`Generating emission data for ${subsidiaries.length} subsidiaries...`)

  const emissionData = []

  // Convert enum objects to arrays for random selection
  const emissionActivityTypes = Object.values(EmissionActivityTypeForStationaryCombustion)
  const activityDataTypes = Object.values(ActivityDataForStationaryCombustion)

  for (const subsidiary of subsidiaries) {
    for (let i = 0; i < facilitiesPerSubsidiary; i++) {
      // Generate 12 months of random emission data
      const monthlyData = Array.from({length: 12}, () => getRandomFloat(1, 100, 2))
      const total = parseFloat(monthlyData.reduce((sum, val) => sum + val, 0).toFixed(2))

      emissionData.push({
        subsidiary: subsidiary._id,
        year: year,
        serialNumber: `EM-${getRandomInt(10000, 99999)}`,
        facilityName: `Facility ${String.fromCharCode(65 + i)}`,
        emissionActivity: getRandomElement(emissionActivityTypes),
        activityData: getRandomElement(activityDataTypes),
        total: total,
        uncertainty: getRandomFloat(0.5, 5, 2),
        data: monthlyData
      })
    }
  }

  // Insert emission data
  const emissions = await EmissionFromStationaryCombustion.insertMany(emissionData)
  console.log(`✅ ${emissions.length} emission records created`)
  return emissions
}

// Main function to set up all dummy data
const setupDummyData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URL)
    console.log('Connected to MongoDB')

    // Clear existing data
    await Organization.deleteMany({})
    await Subsidiary.deleteMany({})
    await EmissionFromStationaryCombustion.deleteMany({})
    console.log('Cleared existing data')

    // Generate data
    const organizations = await generateOrganizations(3)
    const subsidiaries = await generateSubsidiaries(organizations, 2)
    const emissions = await generateEmissions(subsidiaries, 2023, 3)

    console.log('All dummy data generated successfully!')
  } catch (error) {
    console.error('Error generating dummy data:', error)
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect()
    console.log('MongoDB connection closed')
    process.exit(0)
  }
}

// Execute the setup function
setupDummyData()
