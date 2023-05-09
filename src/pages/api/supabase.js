import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zumicykrwfcfusaacexr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1bWljeWtyd2ZjZnVzYWFjZXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDU3MTA4NDksImV4cCI6MTk2MTI4Njg0OX0.6nWEc4T5x97whyQ236wlW2n1euAXIRyDKirYpohcy_o'
const supabase = createClient(supabaseUrl, supabaseKey)

export async function handleFeedbackSubmit(feedbackData) {
  const { data, error } = await supabase
    .from('feedback')
    .insert({
      feedback: feedbackData.feedback,
      rating: feedbackData.rating,
      age: feedbackData.age,
      gender: feedbackData.gender,
      location: feedbackData.location,
      contact_info: feedbackData.contactInfo
    });
  if (error) {
    console.log(error)
  } else {
    console.log(data)
  }
}

export async function addCity(citydata){
  const { data, error } = await supabase
    .from('city')
    .insert({
      name: citydata
    });
  if (error) {
    console.log(error)
  } else {
    console.log(data)
  }
}

export async function addSpots(spotdata){
  const { data, error } = await supabase
    .from('spots')
    .insert({
      name: spotdata
    });
  if (error) {
    console.log(error)
  } else {
    console.log(data)
  }
}
