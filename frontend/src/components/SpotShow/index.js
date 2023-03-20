import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteASpot, getASpot } from "../../store/spots.js";
import './SpotShow.css'
import { Link } from "react-router-dom";
import ReviewsIndex from "../ReviewsIndex";


export default function SpotShow() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const history = useHistory();
  const [errors, setErrors] = useState([]);

  // console.log("THIS IS THE SPOT ID:", spotId)

  const spot = useSelector(state => state.spots.singleSpot);
  const user = useSelector(state => state.session.user)
  useEffect(() => {
    // console.log("I ran!!")
    dispatch(getASpot(spotId))
  }, [dispatch])

  const handleDelete = async () => {
    const deleteResponse = await dispatch(deleteASpot(spotId))
    if (deleteResponse.ok) {
      history.push("/")
    } else {
      setErrors([deleteResponse.message])
    }
    // useEffect for errors for a form
    // for errors from a button click, create error state and set errors to returned errors
  }

  // console.log("THIS IS SPOT:", spot)
  if (!spot.SpotImages) return null

  // for (let index = 1; index < 5; index++) {
  //   spot.SpotImages[index] ??= { url: "https://images.pexels.com/photos/4439444/pexels-photo-4439444.jpeg" }
  // }

  // return (
  //   <h2>HELLO!!!</h2>
  // )

  return (
    <div className='spot-container'>
      <div className="header-details-container">
        <div className="spot-name">
          <h2>
            {spot.name}
          </h2>
        </div>
        <div className="spot-header-details-container">
          <div className='spot-header-mini-ratings'>
            <b id='mini-avg-star-rating'><span id='star-rating-1'>★</span> {Math.round(spot.avgStarRating) || "New"} </b> · <b id='mini-reviews-num'>{spot.numReviews} reviews</b>
          </div>
          <div className="spot-header-location-details">
            {spot.city}, {spot.state}, {spot.country}
          </div>
        </div>
      </div>
      <div className="spot-images-container">
        <div className="main-spot-img">
          <img src={`${spot.SpotImages[0]?.url}`}></img>
        </div>
        <div className="other-spot-imgs">
          <div><img src="https://creativeclickmedia.com/wp-content/uploads/2018/04/wireframe-box-270x203.jpg"></img>
            <img src="https://creativeclickmedia.com/wp-content/uploads/2018/04/wireframe-box-270x203.jpg"></img></div>
          <div><img src="https://creativeclickmedia.com/wp-content/uploads/2018/04/wireframe-box-270x203.jpg"></img>
            <img src="https://creativeclickmedia.com/wp-content/uploads/2018/04/wireframe-box-270x203.jpg"></img></div>
          {/* {spot.SpotImages.slice(1).map(image => {
            return <div>
              <img src={`${image.url}`}></img>
            </div>
          })} */}
        </div>
      </div>
      <div className="spot-details-container">
        <div className="spot-details-container-1">
          <div>
            <div>
              <div><h3>Entire home hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h3></div>
            </div>
          </div>
          <div className="spot-details-container-1-a">
            <div>
              {spot.description}
            </div>
          </div>

        </div>
        <div className="spot-details-container-2">
          <div className="spot-details-container-2-a">
            <div className="spot-details-container-2-a-1">
              <div className="spot-details-container-2-a-1-a">
                <div className="spot-details-container-2-a-1-a-1"> <span id="right-spot-price">${spot.price}</span> night</div>
                <div className="spot-details-container-2-a-1-a-2">
                  <span>★</span>
                  {spot.numReviews === 0 ? (<span className='no-reviews'><i>New!</i></span>)
                    : spot.numReviews === 1 ? <>
                      {Number(spot.avgStarRating).toFixed(2)} · {spot.numReviews} Review
                    </>
                      : <>
                        {Number(spot.avgStarRating).toFixed(2)} · {spot.numReviews} Reviews
                      </>}
                </div>
              </div>
              <button
                className="reserve-button"
                onClick={() => window.alert('Feature coming soon!')}>
                Reserve
              </button>
            </div>
            {/* {user && user.id === spot.Owner.id && <div>

              <Link to={`/spot/${spotId}/edit`} > <button>Update</button></Link>

              <button id="spot-delete" onClick={handleDelete}>Delete</button>

            </div>} */}

          </div>
        </div>
      </div>
      <hr />
      <div className="reviews-index-container">
        <ReviewsIndex spot={spot} />
      </div>
    </div >
  );
}