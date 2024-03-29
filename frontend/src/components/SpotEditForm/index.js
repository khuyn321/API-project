import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useParams } from "react-router-dom"
// import * as sessionActions from "../../store/spotsReducer"
import * as sessionActions from "../../store/spots"
import { useEffect } from "react"
import './SpotEditForm.css'


function formValidator(name, description, price, address, city, state, country) {
  const errors = []

  if (!name) errors.push("Please provide your spot's name")
  else if (name.length > 255) errors.push("Name cannot be longer than 255 characters")
  if (description.length === 0) errors.push("Description cannot be empty")
  else if (description.length > 255) errors.push("Description cannot be over 255 characters");
  if (price < 0 || price > 100000) errors.push("Price cannot exceed $100,000")
  if (address.length === 0) errors.push("Please enter your address")
  if (address.length > 256) errors.push("Please keep address under 255 characters")
  if (city.length === 0) errors.push("Please enter your city")
  if (city.length > 256) errors.push("Please keep city under 255 characters")
  if (state.length === 0) errors.push("Please enter your state")
  if (state.length > 256) errors.push("Please keep state under 255 characters")
  if (country.length === 0) errors.push("Please enter your country")
  if (country.length > 256) errors.push("Please keep country under 255 characters")

  return errors;
}

export default function EditSpotForm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.session.user)
  const [isLoaded, setIsLoaded] = useState(false)
  const { spotId } = useParams();
  const spot = useSelector(state => state.spots.singleSpot) || {}

  useEffect(() => {
    dispatch(sessionActions.getASpot(spotId))
  }, [dispatch, spotId]);

  // async function getSpot(spotId) {
  //   await dispatch(sessionActions.getASpot(spotId))
  // }

  // useEffect(() => {
  //   async function getSpot(spotId) {
  //     await dispatch(sessionActions.getASpot(spotId))
  //   }
  //   if (getSpot) {
  //     console.log('its working?')
  //   }
  // }, [dispatch, spotId]);

  // useEffect(() => {
  //   setTimeout(() => {
  //   }, 3000);
  // })
  // if (!user) return history.push("/")
  // if (!spot.id) return history.push(`/spots/${spotId}`)


  const [name, setName] = useState(spot.name)
  const [description, setDescription] = useState(spot.description)
  const [price, setPrice] = useState(spot.price)
  const [address, setAddress] = useState(spot.address)
  const [city, setCity] = useState(spot.city)
  const [state, setState] = useState(spot.state)
  const [country, setCountry] = useState(spot.country)
  const [errors, setErrors] = useState([]);

  // if (!user) return history.push("/")
  if (!spot.id) return history.push(`/spots/${spotId}`)

  const onSubmit = async (e) => {
    e.preventDefault();
    const errors = formValidator(name, description, price, address, city, state, country)
    if (errors.length > 0) {
      setErrors(errors)
      return
    }
    try {
      await dispatch(sessionActions.editASpot({
        id: spot.id,
        name,
        description,
        price,
        lat: 10,
        lng: 10,
        address,
        city,
        state,
        country
      }))
    } catch (errors) {
      const data = await errors.json();
      setErrors(data.errors);
      return;
    }


    return history.push(`/spots/${spot.id}`)
  }

  return (
    <div className="spots-form">
      <div className='loginsignup-form'>
        <div className="signuplogin-form-header">
          <div className="signuplogin-form-title">
            <h2>Update your Spot</h2>
          </div>
        </div>
        <form onSubmit={onSubmit} className="form">
          <ul className="errors">
            {errors.map(error => (<li key={error}>{error}</li>))}
          </ul>
          <h3>Country</h3>
          <input
            className="form-last-input"
            type="text"
            value={country}
            onChange={e => setCountry(e.target.value)}
            placeholder="Country"
          />
          <h3>Street Address</h3>
          <input
            className="form-mid-input"
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Address"
          />
          <h3>City</h3>
          <input
            className="form-mid-input"
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="City"
          />
          <h3>State</h3>
          <input
            className="form-mid-input"
            type="text"
            value={state}
            onChange={e => setState(e.target.value)}
            placeholder="State"
          />
          <h3>Description</h3>
          <input
            className="form-mid-input"
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
          />
          <h3>Name</h3>
          <input
            className="form-first-input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
          />
          <h3>Price</h3>
          <input
            className="form-mid-input"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Price"
          />
          <button type="submit" className="submit">Update your Spot</button>
        </form>
      </div>
    </div>
  )
}