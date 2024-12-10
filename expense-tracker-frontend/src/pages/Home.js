import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './css/home.css'; // Import CSS for styling

const Home = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Check if the user is logged in
  const token = localStorage.getItem('token'); // Replace 'token' with the key you're using to store the token

  // Set userLoggedIn to true if token exists, otherwise false
  const userLoggedIn = token ? true : false;

  // Function to handle the "Get Started" click when the user has no expenses
  const handleGetStartedClick = () => {
    const userHasExpenses = false;//brb

    if (!userHasExpenses) {
      navigate('/all-expenses'); // Navigate to all-expenses page
    }
  };

  // Function to handle the "Start Exploring" click for users who are not logged in
  const handleStartExploringClick = () => {
    navigate('/login'); // Navigate to the login page for users who are not logged in
  };

  return (
    <div>
      <div className="hero">
        <div className="hero__bg">
          <picture>
            <img
              src="https://images.pexels.com/photos/934062/pexels-photo-934062.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Background"
            />
          </picture>
        </div>

        <div className="hero__cnt">
          <h1>S E T</h1>
          <h6>SAFF Expenses Tracker</h6>

          {!userLoggedIn ? (
            <button className="start-exploring-btn" onClick={handleStartExploringClick}>
              Start Exploring
            </button>
          ) : (
            <button className="get-started-btn" onClick={handleGetStartedClick}>
              Get Started
            </button>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="features-title">SAFF Expenses Tracker Features</h2>
        <div className="features-container">
          <div className="feature-item">
            <img
              src="https://images.pexels.com/photos/128867/coins-currency-investment-insurance-128867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Feature 1"
              className="feature-icon"
            />
            <h3>Track Expenses</h3>
            <p>Effortlessly track and manage all your expenses in one place.</p>
          </div>
          <div className="feature-item">
            <img
              src="https://images.pexels.com/photos/7111954/pexels-photo-7111954.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Feature 2"
              className="feature-icon"
            />
            <h3>Set Budgets</h3>
            <p>Set monthly or yearly budgets and stay within your spending limits.</p>
          </div>
          <div className="feature-item">
            <img
              src="https://images.pexels.com/photos/6328860/pexels-photo-6328860.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Feature 3"
              className="feature-icon"
            />
            <h3>Expense Insights</h3>
            <p>Get detailed insights on your spending habits and save more.</p>
          </div>
          
        </div>
      </div>
      <section class="testimonials-section">
  <h2 class="testimonials-title">What Our Clients Say</h2>
  <div class="testimonials-container">
    <div class="testimonial-item">
      <div class="quote-icon">“</div>
      <p>
        I had an amazing experience using this service. The team was
        professional and attentive to every detail.
      </p>
      <p class="author">- Jane Doe</p>
    </div>
    <div class="testimonial-item">
      <div class="quote-icon">“</div>
      <p>
        This platform has completely transformed the way I manage my projects. Highly recommended!
      </p>
      <p class="author">- John Smith</p>
    </div>
    <div class="testimonial-item">
      <div class="quote-icon">“</div>
      <p>
        Exceptional service and fantastic results. I couldn't be happier with the outcome.
      </p>
      <p class="author">- Emily Clark</p>
    </div>
  </div>
</section>

    </div>
  );
};

export default Home;
