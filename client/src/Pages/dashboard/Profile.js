import React, { useState } from 'react';
import { FormRow, Alert } from '../../Components/index.js';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

export const Profile = () => {
  const { user, showAlert, displayAlert, updateUser, isLoading } = useAppContext();
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [lastName, setLastName] = useState(user?.lastName);
  const [location, setLocation] = useState(user?.location);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !lastName || !location) {
      displayAlert();
      return;
    }
    const currentUser = {
      name,
      email,
      lastName,
      location
    };
    updateUser(currentUser);
  };

  return (
    <Wrapper>
      <form className='form' onSubmit={handleSubmit}>
        <h3>Profile</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          <FormRow type='text' name='name' value={name} handleChange={(e) => setName(e.target.value)} />
          <FormRow labelText='Last Name' type='text' name='lastName' value={lastName} handleChange={(e) => setLastName(e.target.value)} />
          <FormRow type='text' name='location' value={location} handleChange={(e) => setLocation(e.target.value)} />
          <FormRow type='email' name='email' value={email} handleChange={(e) => setEmail(e.target.value)} />
          <button className='btn btn-block' type='submit' disabled={isLoading}>
            {isLoading ? 'Please wait...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Wrapper>
  );
};
