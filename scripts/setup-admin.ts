import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey || serviceRoleKey === 'your_service_role_key_here') {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is not set in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdmin() {
  const email = 'admin@cavve.in'
  const password = 'WearDiscipline2024'

  console.log(`Creating admin user: ${email}...`)

  // 1. Create the user in auth.users
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'CAVVE Admin' }
  })

  if (authError) {
    if (authError.message.toLowerCase().includes('already registered') || authError.message.toLowerCase().includes('already been registered')) {
      console.log('User already exists. Updating role to Admin...')
      const { data: listData } = await supabase.auth.admin.listUsers()
      const existingUser = listData?.users.find(u => u.email === email)
      
      if (!existingUser) {
        console.error('Could not find existing user in the list.')
        return
      }
      
      const { error: roleError } = await supabase
        .from('profiles')
        .upsert({ id: existingUser.id, role: 'admin', full_name: 'CAVVE Admin' })

      if (roleError) console.error('Error updating role:', roleError.message)
      else console.log('Successfully updated existing user to Admin.')
    } else {
      console.error('Error:', authError.message)
    }
    return
  }

  const user = authData.user
  console.log('User created successfully. ID:', user.id)

  // 2. Set role to admin in profiles
  // Note: The handle_new_user trigger in Postgres usually creates the profile automatically.
  // We wait a moment for the trigger to finish or just upsert it.
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ 
      id: user.id, 
      role: 'admin', 
      full_name: 'CAVVE Admin' 
    })

  if (profileError) {
    console.error('Error setting admin role:', profileError.message)
  } else {
    console.log('--------------------------------------------------')
    console.log('ADMIN ACCOUNT READY')
    console.log('Email: ' + email)
    console.log('Password: ' + password)
    console.log('Access: http://localhost:5174/admin')
    console.log('--------------------------------------------------')
  }
}

createAdmin()
