import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function setupProductsTable() {
  console.log('--- Establishing Product Protocol ---')

  // Create products table if it doesn't exist
  // We'll use SQL via the Supabase client if possible, or just check
  // Note: Standard Supabase JS client can't run raw SQL easily without a stored proc.
  // We will assume the user can run this in their SQL editor, but we'll try to insert a test product to see if it exists.
  
  const { error: checkError } = await supabase.from('products').select('*').limit(1)
  
  if (checkError && checkError.code === '42P01') {
    console.error('Table "products" does not exist. Please run the following SQL in your Supabase Dashboard:')
    console.log(`
      CREATE TABLE products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        color TEXT,
        color_hex TEXT,
        price INTEGER NOT NULL,
        compare_at INTEGER,
        fit TEXT DEFAULT 'Oversized',
        gsm TEXT DEFAULT '240 GSM',
        sizes TEXT[] DEFAULT '{S,M,L,XL,XXL}',
        stock INTEGER DEFAULT 0,
        gallery TEXT[] DEFAULT '{}',
        copy TEXT,
        details TEXT[] DEFAULT '{}',
        category TEXT,
        collection_id UUID REFERENCES collections(id),
        published BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now()
      );

      -- Enable RLS
      ALTER TABLE products ENABLE ROW LEVEL SECURITY;

      -- Allow public read access
      CREATE POLICY "Allow public read access" ON products
        FOR SELECT USING (true);

      -- Allow admin/staff full access
      CREATE POLICY "Allow admin full access" ON products
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND (profiles.role = 'admin' OR profiles.role = 'staff')
          )
        );
    `)
  } else {
    console.log('Product table detected or accessible.')
  }
}

setupProductsTable()
