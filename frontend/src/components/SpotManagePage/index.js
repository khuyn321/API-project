import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import './SpotManagePage.css'
import { Link } from 'react-router-dom';
import { getAllSpots } from '../../store/spots'

export default function SpotManagePage() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user)
  const spotsObj = useSelector(state => state.spots.allSpots)
  const spots = Object.values(spotsObj)

  console.log(`THIS IS SPOTS: ${spots}`)

  const filteredSpots = spots.filter(spot => spot.ownerId === user.id)

  useEffect(() => {
    dispatch(getAllSpots())
  }, [dispatch])

  if (spots.length === 0 || !spots) return null;

  return (
    <section id="section-spotsIndex">
      <div id="spotsIndex">
        {
          filteredSpots.map(spot => (
            <div className='spot'>
              <Link to={`/${spot.id}`} className='spot-link' >
                <span className='tooltip-text'>{spot.name}</span>
                <div className='spot-image-container'>
                  {spot.previewImage ?
                    (<img src={`${spot.previewImage}`} />) :
                    (<img src="https://creativeclickmedia.com/wp-content/uploads/2018/04/wireframe-box-270x203.jpg" alt="spot preview frame" />)}
                </div>
                <div className="spot-description-container">

                  <p>{spot.city}, {spot.state}</p>
                  <div className='spot-rating-container'>
                    <p>{(spot.avgRating ? <b><span id='rating-star'>★</span> {(Number(spot.avgRating)).toFixed(2)}</b> : (<p className='ratings-no-reviews'><i>New!</i></p>))}</p>
                  </div>

                  <p>
                    <span><b>${spot.price}</b></span> night
                  </p>
                </div>
              </Link>
            </div>
          ))
        }
      </div>
    </section >
  );
}