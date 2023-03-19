import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { createSpot, createSpotImg } from "../../store/spots"
import './SpotCreateForm.css';

function formValidator(name, description, price, address, city, state, country, image) {
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
  if (!image) errors.push("Please provide a preview image")

  return errors;
}

export default function SpotCreateForm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.session.user)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')
  const [image, setImage] = useState('')
  const [errors, setErrors] = useState([]);

  if (!user) return history.push("/")

  const onSubmit = async (e) => {
    e.preventDefault();
    const errors = formValidator(name, description, price, address, city, state, country, image)
    if (errors.length > 0) {
      return setErrors(errors)
    }

    try {
      const newSpot = await dispatch(createSpot({
        name,
        description,
        price,
        lat: 10,
        lng: 10,
        address,
        city,
        state,
        country,

      }))

      //! FIX THIS CREATE IMAGE THUNK BELOW

      console.log("THIS IS IMAGE ON SUBMIT: " + image)

      dispatch(createSpotImg({
        spotId: newSpot.id,
        url: image,
        preview: true
      }))
        .then(() => history.push(`/spots/${newSpot.id}`))

    } catch (errors) {
      const data = await errors.json();
      setErrors(data.errors);
      return;
    }

    return history.push("/")
  }

  return (
    <div className="spots-form">
      <div className='loginsignup-form'>
        <div className="signuplogin-form-header">
          <h2>Create a New Spot</h2>
        </div>
        <form onSubmit={onSubmit} className="form">
          <ul className="errors">
            {errors.map(error => (<li key={error}>{error}</li>))}
          </ul>
          <div className="signuplogin-form-title">
            <h3>Where's your place located?</h3>
            <p>Guests will only get your exact address once they booked a reservation.</p>
          </div>
          <section className="section-1">
            <p>Country</p>
            <input
              className="input-country"
              type="text"
              value={country}
              onChange={e => setCountry(e.target.value)}
              placeholder="Country"
            />
            <p>Street Address</p>
            <input
              className="input-address"
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Address"
            />
            <p>City</p>
            <input
              className="input-city"
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="City"
            />
            <span><b> , </b></span>
            <p>State</p>
            <input
              className="input-state"
              type="text"
              value={state}
              onChange={e => setState(e.target.value)}
              placeholder="STATE"
            />
          </section>
          <section className="section-2">
            <hr />
            <div>
              <h3>Describe your place to guests</h3>
              <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
            </div>
            <input
              className="input-description"
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Please write at least 30 characters"
            />
          </section>
          <section className="section-3">
            <hr />
            <div>
              <h3>Create a title for your spot</h3>
              <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
            </div>
            <input
              className="input-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name of your spot"
            />
          </section>
          <section className="section-4">
            <hr />
            <div>
              <h3>Set a base price for your spot</h3>
              <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
            </div>
            <span><b> $ </b></span>
            <input
              className="input-price"
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Price per night (USD)"
            />
          </section>
          {/*//!!!! MAKE 5 OF THESE INSTEAD OF 1 !!!*/}
          <section className="section-4">
            <hr />
            <div>
              <h3>Liven up your spot with photos</h3>
              <p>Submit a link to at least one photo to publish your spot</p>
            </div>
            <input
              className="form-last-input"
              type="url"
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="Preview Image Url"
            />
            <input
              className="form-last-input"
              type="url"
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="Image Url"
            />
            <input
              className="form-last-input"
              type="url"
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="Image Url"
            />
            <input
              className="form-last-input"
              type="url"
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="Image Url"
            />
            <input
              className="form-last-input"
              type="url"
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="Image Url"
            />
            <hr />
          </section>
          <button type="submit" className="submit">Create Spot</button>
        </form>
      </div>
    </div>
  )
}