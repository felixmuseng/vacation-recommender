import { handleFeedbackSubmit } from '../api/supabase'
import { useState } from 'react'

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState('')
  const [generalFeedback, setGeneralFeedback] = useState('')
  const [rating, setRating] = useState('')
  const [specificQuestionAnswer, setSpecificQuestionAnswer] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [location, setLocation] = useState('')
  const [contactInfo, setContactInfo] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    // handle feedback submission
    const feedbackData = {
      feedback,
      generalFeedback,
      rating,
      specificQuestionAnswer,
      age,
      gender,
      location,
      contactInfo,
    }
    handleFeedbackSubmit(feedbackData)
    // reset form
    setFeedback('')
    setGeneralFeedback('')
    setRating('')
    setSpecificQuestionAnswer('')
    setAge('')
    setGender('')
    setLocation('')
    setContactInfo('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col mx-8">
      <label htmlFor="feedback">Enter your feedback:</label>
      <textarea
        id="feedback"
        value={feedback}
        onChange={(event) => setFeedback(event.target.value)}
      />
      <label htmlFor="general-feedback">General feedback:</label>
      <textarea
        id="general-feedback"
        value={generalFeedback}
        onChange={(event) => setGeneralFeedback(event.target.value)}
      />

      <fieldset>
        <legend>Rating:</legend>
        <input type="radio" id="rating1" name="rating" value="1" onChange={(event) => setRating(event.target.value)} />
        <label htmlFor="rating1">1</label>
        <input type="radio" id="rating2" name="rating" value="2" onChange={(event) => setRating(event.target.value)} />
        <label htmlFor="rating2">2</label>
        <input type="radio" id="rating3" name="rating" value="3" onChange={(event) => setRating(event.target.value)} />
        <label htmlFor="rating3">3</label>
        <input type="radio" id="rating4" name="rating" value="4" onChange={(event) => setRating(event.target.value)} />
        <label htmlFor="rating4">4</label>
        <input type="radio" id="rating5" name="rating" value="5" onChange={(event) => setRating(event.target.value)} />
        <label htmlFor="rating5">5</label>
      </fieldset>
      {/* ishld remove this */}
      <label htmlFor="specific-question-answer">
        Answer to specific question:
      </label>

      <input
        type="text"
        id="specific-question-answer"
        value={specificQuestionAnswer}
        onChange={(event) =>
          setSpecificQuestionAnswer(event.target.value)
        }
      />
      <label htmlFor="age">Age:</label>
      <input
        type="text"
        id="age"
        value={age}
        onChange={(event) => setAge(event.target.value)}
      />
      <label htmlFor="gender">Gender:</label>
      <select
        id="gender"
        value={gender}
        onChange={(event) => setGender(event.target.value)}
      >
        <option value="">-- Select a gender --</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <label htmlFor="location">Location:</label>
      <input
        type="text"
        id="location"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
      />
      <label htmlFor="contact-info">Contact information:</label>
      <input
        type="text"
        id="contact-info"
        value={contactInfo}
        onChange={(event) => setContactInfo(event.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  )
}