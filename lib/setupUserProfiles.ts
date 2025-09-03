import { supabase } from './supabase'

export async function setupUserProfilesTable() {
  try {
    console.log('Setting up user_profiles table...')
    
    // First, check if the table exists
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'user_profiles')

    if (tableError) {
      console.error('Error checking for user_profiles table:', tableError)
      return false
    }

    if (tables && tables.length > 0) {
      console.log('user_profiles table already exists')
      return true
    }

    // Create the user_profiles table
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE user_profiles (
          id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
          email TEXT NOT NULL,
          full_name TEXT,
          phone TEXT,
          role TEXT DEFAULT 'customer',
          avatar_url TEXT,
          date_of_birth TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Users can view own profile" ON user_profiles
          FOR SELECT USING (auth.uid() = id);

        CREATE POLICY "Users can update own profile" ON user_profiles
          FOR UPDATE USING (auth.uid() = id);

        CREATE POLICY "Users can insert own profile" ON user_profiles
          FOR INSERT WITH CHECK (auth.uid() = id);

        -- Create index for role lookups
        CREATE INDEX idx_user_profiles_role ON user_profiles(role);
      `
    })

    if (createError) {
      console.error('Error creating user_profiles table:', createError)
      return false
    }

    console.log('user_profiles table created successfully')
    return true
  } catch (error) {
    console.error('Error setting up user_profiles table:', error)
    return false
  }
}

export async function migrateUsersToProfiles() {
  try {
    console.log('Migrating users from auth.users to user_profiles...')
    
    // Get all users from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('Error fetching auth users:', authError)
      return false
    }

    if (!authUsers || authUsers.users.length === 0) {
      console.log('No users found in auth.users')
      return true
    }

    // Create user profiles for each auth user
    for (const user of authUsers.users) {
      try {
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', user.id)
          .single()

        if (existingProfile) {
          console.log(`Profile already exists for user ${user.id}`)
          continue
        }

        // Extract full_name from user_metadata
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown'
        
        // Determine role based on email or other criteria
        const role = user.email === 'admin@gemstore.com' ? 'admin' : 'customer'

        // Create user profile
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: fullName,
            phone: user.user_metadata?.phone || null,
            role: role,
            avatar_url: user.user_metadata?.avatar_url || null,
            date_of_birth: user.user_metadata?.date_of_birth || null,
            created_at: user.created_at,
            updated_at: user.updated_at
          })

        if (insertError) {
          console.error(`Error creating profile for user ${user.id}:`, insertError)
        } else {
          console.log(`Created profile for user ${user.email} with role ${role}`)
        }
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error)
      }
    }

    console.log('User migration completed')
    return true
  } catch (error) {
    console.error('Error migrating users:', error)
    return false
  }
}

export async function initializeUserProfiles() {
  try {
    console.log('Initializing user profiles system...')
    
    // Step 1: Setup the table
    const tableSetup = await setupUserProfilesTable()
    if (!tableSetup) {
      return false
    }

    // Step 2: Migrate existing users
    const migration = await migrateUsersToProfiles()
    if (!migration) {
      return false
    }

    console.log('User profiles system initialized successfully')
    return true
  } catch (error) {
    console.error('Error initializing user profiles:', error)
    return false
  }
}

