import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createReviewThunk } from "../../store/review"
import { useHistory, useParams } from "react-router-dom"


function formValidator(stars, feedback) {
  const errors = []

  if (stars < 0 || stars > 5) errors.push("Please select one of the valid options")
  if (!feedback) errors.push("Please provide some feedback")
  else if (feedback.length > 255) errors.push("Please keep your review under 255 characters")

  return errors;
}
export default function ReviewCreateForm() {
  const [stars, setStars] = useState('');
  const [feedback, setFeedback] = useState('');
  const [errors, setErrors] = useState([]);
  const user = useSelector(state => state.session.user)

  const dispatch = useDispatch();
  const { spotId } = useParams();
  const history = useHistory();

  if (!user) return history.push(`/spots/${spotId}`)
  const onSubmit = async (e) => {
    e.preventDefault();
    const errors = formValidator(stars, feedback)

    if (errors.length > 0) {
      setErrors(errors)
      return
    }
    try {
      const newSpot = await dispatch(createReviewThunk(spotId, {
        review: feedback,
        stars: stars[0]
      }))

    } catch (errors) {
      const data = await errors.json();
      setErrors(data.errors || [data.message]);
      return;

    }
    history.push(`/spots/${spotId}`)
  }

  return (
    <div className="spots-form">
      <div className="loginsignup-form">
        <div className="signuplogin-form-header">
          <div className="signuplogin-form-title">
            <h2>How was your stay?</h2>
          </div>
        </div>
        <form onSubmit={onSubmit} className="form">
          <ul className="errors">{errors.map(error => (<li key={error}>{error}</li>))}</ul>
          <div>
            <select
              onChange={e => setStars(e.target.value)}
              value={stars}
              className="form-first-input"
              id="create-review-select"
            >
              <option value="" disabled>Rate your experience!</option>
              <option>1 ★- awful </option>
              <option>2 ★★ - could be better </option>
              <option>3 ★★★ - okay </option>
              <option>4 ★★★★ - good </option>
              <option>5 ★★★★★ - wonderful! </option>
            </select> Stars
            {/* <div class="rate">
              <input type="radio" id="star5" name="rate" value="5" />
              <label for="star5" title="text">5</label>
              <input type="radio" id="star4" name="rate" value="4" />
              <label for="star4" title="text">4</label>
              <input type="radio" id="star3" name="rate" value="3" />
              <label for="star3" title="text">3</label>
              <input type="radio" id="star2" name="rate" value="2" />
              <label for="star2" title="text">2</label>
              <input type="radio" id="star1" name="rate" value="1" />
              <label for="star1" title="text">1</label>
              Stars
            </div> */}
          </div>
          <div>
            <textarea id="create-review-text-area" className="form-last-input" value={feedback} onChange={event => setFeedback(event.target.value)} placeholder="Leave your review here..." />
          </div>
          < div>
            <button type="submit" className="submit">Submit Your Review</button>
          </div>
        </form>
      </div>
    </div>
  )
}