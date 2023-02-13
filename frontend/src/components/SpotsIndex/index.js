import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { actionResetState } from '../store/spots'
import SpotIndexItem from './SpotIndexItem';

const SpotIndex = () => {
  // const dispatch = useDispatch();
  const spotsObj = useSelector(state => state.spots);
  const spots = Object.values(spotsObj)

  return (
    <section>
      <ul>
        {
          spots.map(Spot => (
            <SpotIndexItem
              Spot={Spot}
              key={Spot.id}
            />
          ))
        }
      </ul>
      <Link to="/spots/new">New Spot</Link>
    </section>
  );
}

export default SpotIndex;
