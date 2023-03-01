import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";
// import { actionResetState } from '../store/spots'
import { getAllSpots } from '../../store/spots'
import './SpotsIndex.css'

export default function SpotsIndex() {
  const dispatch = useDispatch();

  const spotsObj = useSelector(state => state.spots.allSpots)
  const spots = Object.values(spotsObj)

  console.log(`THIS IS SPOTS: ${spots}`)

  useEffect(() => {
    dispatch(getAllSpots())
  }, [dispatch])

  if (spots.length === 0 || !spots) return null;

  return (
    <section>
      <div id="spotsIndex">
        {
          spots.map(spot => (
            <Link to={`spots/${spot.id}`}>
              <div className='spot-image-container'>
                {spot.previewImage ?
                  (<img src={`${spot.previewImage}`} />) :
                  (<img src="https://creativeclickmedia.com/wp-content/uploads/2018/04/wireframe-box-270x203.jpg" alt="spot preview frame" />)}
              </div>
              <div className="spot-description-container">
                <div className='spot-location-rating-container'>
                  <p>{spot.city}, {spot.state}</p>
                  <div className='spot-rating-container'>
                    <p>{(spot.avgRating ? <b>★ {(Number(spot.avgRating)).toFixed(2)}</b> : (<p>No reviews yet</p>))}</p>
                  </div>
                </div>
                <p>
                  <span><b>${spot.price}</b></span> night
                </p>
              </div>
            </Link>
          ))
        }
      </div>
    </section >
  );
}