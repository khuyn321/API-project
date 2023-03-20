
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { deleteReviewThunk, getReviewsThunk } from "../../store/review";
import "./ReviewsIndex.css"
import ReviewDeleteModal from "../ReviewDeleteModal";
import OpenModalButton from "../OpenModalButton"


export default function ReviewIndex({ spot }) {
  const dispatch = useDispatch();
  // const ownerId = spot.ownerId
  const reviewsObj = useSelector(state => state.reviews)
  const reviews = Object.values(reviewsObj);
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false)
  const ulRef = useRef();
  const [errors, setErrors] = useState([]);
  const user = useSelector(state => state.session.user)

  const open = () => {
    if (showMenu) return;
    setShowMenu(true)
  }
  const close = () => setShowMenu(false)

  useEffect(() => {
    if (!showMenu) return;

    const close = (e) => {
      if (!ulRef.current.contains(e.target)) setShowMenu(false);
    }

    document.addEventListener('click', close);

    return () => document.removeEventListener('click', close);
  }, [showMenu])

  useEffect(() => {
    dispatch(getReviewsThunk(spot.id));
  }, [dispatch])

  if (!reviews) return (
    console.log("My reviews have no length... :(")
    // null
  );

  let userReview;
  if (reviews.length && user) {
    userReview = reviews.find(review => user.id === review.User.id);
  }

  const handleDelete = async () => {
    const deleteResponse = await dispatch(deleteReviewThunk(userReview.id))
    if (deleteResponse.ok) {
      history.push("/")
    } else {
      setErrors([deleteResponse.message])
    }
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
      <div className="review-edit-or-write">
        {user ? (
          !userReview && (user.id !== spot.Owner.id) ?
            (user && <div><button>
              <Link to={`/spot/${spot.id}/reviews/create`} id="write-review">Post your review</Link>
            </button></div>)
            : user.id !== spot.Owner.id ?
              <div className="review-delete-button">
                <OpenModalButton
                  id="review-delete"
                  itemText={`Delete`}
                  onClick={open}
                  onItemClick={close}
                  modalComponent={<ReviewDeleteModal
                    userReview={userReview}
                    spotId={spot.id}
                  />}
                >
                  Delete
                </OpenModalButton>
              </div>
              : <></>)
          : <></>
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
                <div className="review-name"> 🔵 <span id="review-name-span">{spot.User.firstName}</span></div>
                <div className="review-date">{new Date(spot.createdAt).toLocaleString("en-US", { month: "long", year: "numeric" })}</div>
              </div>
            </div>
            <div className="review-bottom-description">
              <div>{spot.review}</div>
            </div>
          </div>
        )).reverse()}
      </div>
    </div>
  )
}

// console.log("THIS IS REVIEWS:", reviews)
// console.log("I ran!!")
// console.log("THIS IS USERREVIEW:", userReview)

// useEffect for errors for a form
// for errors from a button click, create error state and set errors to returned errors

{/* {user && user.id === spot.Owner.id && <div>

<Link to={`/spot/${spotId}/edit`} > <button>Update</button></Link>

<button id="spot-delete" onClick={handleDelete}>Delete</button>

</div>} */}

{/* <button>
              <Link to={{ pathname: `/spot/${spot.id}/reviews/${userReview.id}/edit`, userReview }} id="write-review">Edit Review</Link>
            </button> */}