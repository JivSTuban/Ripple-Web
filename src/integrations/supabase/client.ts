// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gqnpuimmkyzsvipxpysy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxbnB1aW1ta3l6c3ZpcHhweXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MDEyNzAsImV4cCI6MjA1MDE3NzI3MH0.xy3yAFjaPt1pTpSq4SSAXUeG3P8oL1O7_3qYNf7DAF0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);