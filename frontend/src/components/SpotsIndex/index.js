import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";
// import { actionResetState } from '../store/spots'
import { getAllSpots } from '../../store/spots'
// import 'SpotsIndex.css'

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
      <div>
        {
          spots.map(spot => (
            <Link to={`spots/${spot.id}`}>
              <div>
                {spot.previewImage ?
                  (<img src={`${spot.previewImage}`} />) :
                  (<img src="https://creativeclickmedia.com/wp-content/uploads/2018/04/wireframe-box-270x203.jpg" alt="spot preview frame" />)}
              </div>
              <div className="eachspot-content-description">
                <div >
                  <p>{spot.city}, {spot.state}</p>
                  <p>Available Now!</p>
                  <p>
                    <span>${spot.price}</span> night
                  </p>
                </div>
                <div>
                  <p><i></i>{(spot.avgRating ? (Number(spot.avgRating)).toFixed(2) : (<p>new</p>))}</p>
                </div>
              </div>
            </Link>
          ))
        }
      </div>
    </section >
  );
}