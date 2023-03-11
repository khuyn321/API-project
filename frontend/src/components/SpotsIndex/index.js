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

  // console.log(`THIS IS SPOTS: ${spots}`)

  useEffect(() => {
    dispatch(getAllSpots())
  }, [dispatch])

  if (spots.length === 0 || !spots) return null;

  return (
    <section id="section-spotsIndex">
      <div id="spotsIndex">
        {
          spots.map(spot => (
            <div className='spot'>
              <Link to={`spots/${spot.id}`} className='spot-link' >
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