import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zumicykrwfcfusaacexr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1bWljeWtyd2ZjZnVzYWFjZXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDU3MTA4NDksImV4cCI6MTk2MTI4Njg0OX0.6nWEc4T5x97whyQ236wlW2n1euAXIRyDKirYpohcy_o'
const supabase = createClient(supabaseUrl, supabaseKey)

export async function handleFeedbackSubmit(feedbackData) {
  const { data, error } = await supabase
    .from('feedback')
    .insert([{ feedback: feedbackData }])
  if (error) {
    console.log(error)
  } else {
    console.log(data)
  }
}