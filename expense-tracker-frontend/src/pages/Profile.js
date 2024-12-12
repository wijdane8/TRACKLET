import './css/Profile.css';
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordResetting, setIsPasswordResetting] = useState(false);
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: '',
  });
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await apiClient.get('/user');
      setUser(response.data.user);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to fetch user data. Please try again.');
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setSuccessMessage(''); // Reset success message when toggling edit mode
  };

  const handlePasswordResetToggle = () => {
    setIsPasswordResetting(!isPasswordResetting);
    setSuccessMessage(''); // Reset success message when toggling password reset
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.put('/user', user);
      setSuccessMessage('Profile information updated successfully.');
      fetchUserData();
      setIsEditing(false);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to update profile information.');
      console.error('Error updating user info:', error);
    }
  };
  

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (passwords.new_password !== passwords.confirm_new_password) {
        setFormError('Passwords do not match!');
        return;
    }

    try {
        const response = await apiClient.put('/user/password', {
            current_password: passwords.current_password,
            new_password: passwords.new_password,
            new_password_confirmation: passwords.confirm_new_password,
        });

        console.log('Password reset successfully:', response.data);
        setSuccessMessage('Password reset successfully.');
        setIsPasswordResetting(false);
        setFormError('');
    } catch (error) {
        console.error('Error resetting password:', error.response?.data?.message || error.message);
        setFormError(error.response?.data?.message || 'Failed to reset password. Please try again.');
    }
};

  

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
  <h1>User Profile</h1>

  <div className="profile-section">
    <h2>Profile Information</h2>
    {isEditing ? (
      <form onSubmit={handleEditSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn-submit">Update Info</button>
        <button type="button" className="btn-cancel" onClick={handleEditToggle}>Cancel</button>
      </form>
    ) : (
      <div className="profile-details">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <button className="btn-edit" onClick={handleEditToggle}>Edit Info</button>
      </div>
    )}
  </div>

  <div className="password-section">
    <h2>Reset Password</h2>
    {isPasswordResetting ? (
      <form onSubmit={handlePasswordReset}>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            name="current_password"
            value={passwords.current_password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="new_password"
            value={passwords.new_password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirm_new_password"
            value={passwords.confirm_new_password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit" className="btn-submit"> Reset Password</button>
        <button type="button" className="btn-cancel" onClick={handlePasswordResetToggle}>Cancel</button>
      </form>
    ) : (
      <button className="btn-edit" onClick={handlePasswordResetToggle}>Change Password</button>
    )}
  </div>

  {formError && <p className="error-message">{formError}</p>}
  {successMessage && <p className="success-message">{successMessage}</p>}
</div>

  );
};

export default ProfilePage;
