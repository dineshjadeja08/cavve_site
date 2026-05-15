import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!)

async function inspectTable() {
  const { data, error } = await supabase.from('products').select('*').limit(1)
  if (error) {
    console.error(error)
  } else {
    console.log('Sample Product:', data[0] || 'Table is empty')
  }
}

inspectTable()
