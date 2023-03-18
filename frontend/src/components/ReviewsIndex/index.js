
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { deleteReviewThunk, getReviewsThunk } from "../../store/review";
import "../SpotShow/SpotShow.css"

export default function ReviewIndex({ spot }) {
  const dispatch = useDispatch();
  // const ownerId = spot.ownerId
  const reviewsObj = useSelector(state => state.reviews)
  const reviews = Object.values(reviewsObj);
  const history = useHistory();
  const [errors, setErrors] = useState([]);

  console.log("THIS IS REVIEWS:", reviews)
  const user = useSelector(state => state.session.user)

  useEffect(() => {
    console.log("I ran!!")
    dispatch(getReviewsThunk(spot.id));
  }, [dispatch])

  if (!reviews) return (
    console.log("My reviews have no length... :(")
    // null
  );

  let userReview;
  if (reviews.length && user) {
    userReview = reviews.find(review => user.id === review.User.id);
    console.log("THIS IS USERREVIEW:", userReview)
  }

  const handleDelete = async () => {
    const deleteResponse = await dispatch(deleteReviewThunk(userReview.id))
    if (deleteResponse.ok) {
      history.push("/")
    } else {
      setErrors([deleteResponse.message])
    }
    // useEffect for errors for a form
    // for errors from a button click, create error state and set errors to returned errors
  }

  return (
    <div>
      <div className="review-heading">
        <div>
          <p className="review-rating"> <span id="rating-star-1">★</span>
            {spot.numReviews === 0 && user ? (<span className='user-no-reviews'><i> Be the first to post a review! </i></span>)
              : spot.numReviews === 0 ? (<span className='no-reviews'><i>New!</i></span>)
                : spot.numReviews === 1 ? <>
                  {Number(spot.avgStarRating).toFixed(2)} · {spot.numReviews} Review
                </>
                  : <>
                    {Number(spot.avgStarRating).toFixed(2)} · {spot.numReviews} Reviews
                  </>}

          </p>
        </div>
      </div>
      {/* {user && user.id === spot.Owner.id && <div>

<Link to={`/spot/${spotId}/edit`} > <button>Update</button></Link>

<button id="spot-delete" onClick={handleDelete}>Delete</button>

</div>} */}
      <div className="review-edit-or-write">
        {user.id === spot.Owner.id ?
          (<></>) :
          !userReview ?
            (user && <div><button>
              <Link to={`/spot/${spot.id}/reviews/create`} id="write-review">Post your review</Link>
            </button></div>)
            : <div>
              {/* <button>
              <Link to={{ pathname: `/spot/${spot.id}/reviews/${userReview.id}/edit`, userReview }} id="write-review">Edit Review</Link>
            </button> */}
              <button id="review-delete" onClick={handleDelete}>Delete</button>
            </div>
        }
      </div>

      <div className="review-outer-container">
        {reviews.map(spot => (
          <div className="review-container">
            <div className="review-top">
              <div className="review-top-left">
                <i className="fa-solid fa-circle-user"></i>
              </div>
              <div className="review-top-right">
                <div className="review-name">{spot.User.firstName}</div>
                <div className="review-date">{new Date(spot.createdAt).toLocaleString("en-US", { month: "long", year: "numeric" })}</div>
              </div>
            </div>
            <div className="review-bottom-description">
              <div>{spot.review}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}