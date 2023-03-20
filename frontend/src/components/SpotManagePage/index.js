import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import './SpotManagePage.css'
import { Link } from 'react-router-dom';
import { getAllSpots, deleteASpot } from '../../store/spots'
import OpenModalButton from "../OpenModalButton"
import SpotDeleteModal from "../SpotDeleteModal"

export default function SpotManagePage() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user)
  const spotsObj = useSelector(state => state.spots.allSpots)
  const spots = Object.values(spotsObj)
  const history = useHistory();
  const ulRef = useRef();
  const [errors, setErrors] = useState([]);
  const [showMenu, setShowMenu] = useState(false)

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

  // console.log(`THIS IS SPOTS: ${spots}`)

  const filteredSpots = spots.filter(spot => spot.ownerId === user.id)

  useEffect(() => {
    dispatch(getAllSpots())
  }, [dispatch])

  if (spots.length === 0 || !spots) return null;

  return (
    <section id="section-spotsIndex">
      <div className="manage-spots-header">
        <div>
          <h1>Manage Yours Spots</h1></div>
        <div>
          {user && <button id="become-a-host-button-2"><Link to="/spot/create">Create a New Spot</Link></button>}</div>
      </div>
      <div id="spotsIndex">
        {
          filteredSpots.map(spot => (
            <div className='spot'>
              <Link to={`/Spots/${spot.id}`} className='spot-link' >
                <span className='tooltip-text'>{spot.name}</span>
                <div className='spot-image-container'>
                  {spot.previewImage ?
                    (<img src={`${spot.previewImage}`} />) :
                    (<img src="https://creativeclickmedia.com/wp-content/uploads/2018/04/wireframe-box-270x203.jpg" alt="spot preview frame" />)}
                </div>
              </Link>
              <div className="spot-description-container">

                <p>{spot.city}, {spot.state}</p>
                <div className='spot-rating-container'>
                  <p>{(spot.avgRating ? <b><span id='rating-star'>★</span> {(Number(spot.avgRating)).toFixed(2)}</b> : (<p className='ratings-no-reviews'><i>New!</i></p>))}</p>
                </div>
                <p>
                  <span><b>${spot.price}</b></span> night
                </p>
              </div>

              <div className="update-delete-buttons">
                <Link to={`/spot/${spot.id}/edit`} > <button>Update</button></Link>
                <div className="spot-delete-button">
                  <OpenModalButton
                    id="spot-delete"
                    itemText={`Delete`}
                    onClick={open}
                    onItemClick={close}
                    modalComponent={<SpotDeleteModal
                      spotId={spot.id}
                    />}
                  >
                    Delete
                  </OpenModalButton>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </section >
  );
}