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
            <b id='mini-avg-star-rating'>★ {Math.round(spot.avgStarRating) || "New"} </b> · <b id='mini-reviews-num'>{spot.numReviews} reviews</b>
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
          {spot.SpotImages.slice(1).map(image => {
            return <div>
              <img src={`${image.url}`}></img>
            </div>
          })}
        </div>
      </div>
      <div>
        <div>
          <div>
            <div>
              <div>Entire home hosted by {spot.Owner.firstName}</div>
              <div>16 guests5 bedrooms10 beds3 baths</div>
            </div>
          </div>
          <div>
            <div>
              <span>air</span>cover
            </div>
            <div>
              Every booking includes free protection from Host cancellations, listing inaccuracies, and other issues like trouble checking in.
            </div>
          </div>

          <div>
            {spot.description}
          </div>

        </div>
        <div>
          <div>
            <div>
              <div> <span id="right-spot-price">${spot.price}</span> night</div>
              <div>

                {spot.numReviews > 0 && <>
                  <div>
                    <i></i>
                    {Number(spot.avgStarRating).toFixed(2) || "New"}
                  </div>
                  <div>
                    {spot.numReviews > 0 && <>{spot.numReviews} Reviews</>}
                  </div>
                </>
                }
              </div>
            </div>
            {user && user.id === spot.Owner.id && <div>

              <Link to={`/spot/${spotId}/edit`} > <button>Edit</button></Link>

              <button id="spot-delete" onClick={handleDelete}>Delete</button>

            </div>}
          </div>
        </div>
      </div>
      <div>
        <ReviewsIndex spot={spot} />
      </div>
    </div >
  );
}