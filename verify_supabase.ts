
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
  console.log('Starting verification...');

  // 1. Insert
  const testId = 'test-' + Math.random().toString(36).substr(2, 9);
  const newRequest = {
    id: testId,
    date: new Date().toISOString(),
    status: 'new',
    service_name: 'Test Service',
    total_estimate: '0',
    client_name: 'Test Client',
    client_email: 'test@example.com',
    client_company: 'Test Company',
    message: 'This is a test request',
    has_maintenance: false
  };

  console.log('Inserting test request...');
  const { error: insertError } = await supabase
    .from('client_requests')
    .insert([newRequest]);

  if (insertError) {
    console.error('Insert failed:', insertError);
    process.exit(1);
  }
  console.log('Insert successful.');

  // 2. Fetch
  console.log('Fetching requests...');
  const { data: fetchData, error: fetchError } = await supabase
    .from('client_requests')
    .select('*')
    .eq('id', testId);

  if (fetchError || !fetchData || fetchData.length === 0) {
    console.error('Fetch failed:', fetchError);
    process.exit(1);
  }
  console.log('Fetch successful:', fetchData[0].id);

  // 3. Update
  console.log('Updating status...');
  const { error: updateError } = await supabase
    .from('client_requests')
    .update({ status: 'contacted' })
    .eq('id', testId);

  if (updateError) {
    console.error('Update failed:', updateError);
    process.exit(1);
  }
  console.log('Update successful.');

  // 4. Delete
  console.log('Deleting test request...');
  const { error: deleteError } = await supabase
    .from('client_requests')
    .delete()
    .eq('id', testId);

  if (deleteError) {
    console.error('Delete failed:', deleteError);
    process.exit(1);
  }
  console.log('Delete successful.');

  console.log('Verification passed!');
}

verify();
