import './css/Profile.css';
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios'; // Axios instance

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
      
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await apiClient.get("/user", { headers }); // API call
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setFormError(
        error.response?.data?.message || 'Failed to fetch user data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for profile form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for password form
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setSuccessMessage('');
    setFormError('');
  };

  const handlePasswordResetToggle = () => {
    setIsPasswordResetting(!isPasswordResetting);
    setSuccessMessage('');
    setFormError('');
  };

  // Update Profile Info
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put('/user', user);
      setSuccessMessage('Profile updated successfully.');
      fetchUserData(); // Refresh user info
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setFormError(
        error.response?.data?.message || 'Failed to update profile information.'
      );
    }
  };

  // Reset Password
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (passwords.new_password !== passwords.confirm_new_password) {
      setFormError('Passwords do not match!');
      return;
    }

    try {
      await apiClient.put('/user/password', {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
        new_password_confirmation: passwords.confirm_new_password,
      });
      setSuccessMessage('Password reset successfully.');
      setIsPasswordResetting(false);
      setFormError('');
      setPasswords({
        current_password: '',
        new_password: '',
        confirm_new_password: '',
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      setFormError(
        error.response?.data?.message || 'Failed to reset password. Please try again.'
      );
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h1>User Profile</h1>

      {/* Profile Information */}
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
            <button type="submit" className="btn-submit">
              Update Info
            </button>
            <button type="button" className="btn-cancel" onClick={handleEditToggle}>
              Cancel
            </button>
          </form>
        ) : (
          <div className="profile-details">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <button className="bttn-edit" onClick={handleEditToggle}>
              Edit Info
            </button>
          </div>
        )}
      </div>

      {/* Password Reset Section */}
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
            <button type="submit" className="btn-submit">
              Reset Password
            </button>
            <button type="button" className="btn-cancel" onClick={handlePasswordResetToggle}>
              Cancel
            </button>
          </form>
        ) : (
          <button className="bttn-edit" onClick={handlePasswordResetToggle}>
            Change Password
          </button>
        )}
      </div>

      {/* Error and Success Messages */}
      {formError && <p className="error-message">{formError}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default ProfilePage;
