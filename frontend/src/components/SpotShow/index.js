import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteASpot, getASpot } from "../../store/spots.js";
import './SpotShow.css'
import { Link } from "react-router-dom";
// import ReviewIndex from "../Reviews/ReviewIndex";

export default function SpotShow() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const history = useHistory();
  const [errors, setErrors] = useState([]);

  const spot = useSelector(state => state.aSpot);
  const user = useSelector(state => state.session.user)
  useEffect(() => {
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


  if (!spot) return null

  for (let index = 1; index < 5; index++) {
    spot.SpotImages[index] ??= { url: "https://images.pexels.com/photos/4439444/pexels-photo-4439444.jpeg" }
  }

  return (
    <div>
      <div>
        <div>
          {spot.name}
        </div>
        <div>
          <div>
            <div>
              <i></i>
            </div>
            <div>
              {Math.round(spot.avgStarRating) || "New"} · {spot.numReviews} Reviews
            </div>
          </div>
          <div>.</div>
          <div>
            {spot.city}, {spot.state}, {spot.country}
          </div>
        </div>
      </div>
      <div>
        <div>
          <img src={`${spot.SpotImages[0]?.url}`}></img>
        </div>
        <div>
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
        (reviews will go here)
      </div>
    </div >
  );
}