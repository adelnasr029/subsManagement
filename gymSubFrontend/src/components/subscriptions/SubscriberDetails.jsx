import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
const SubscriberDetails = () => {
  const { id } = useParams(); // Get the subscriber ID from the URL
  const navigate = useNavigate();
  const [subscriber, setSubscriber] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false); 

    // Function to calculate remaining days
    const calculateRemainingDays = ( endDate) => {
      const start = Date.now();
      const end = new Date(endDate);
      const differenceInMs = end - start;
      const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
      return differenceInDays >= 0 ? differenceInDays : 0;
    };

      // Function to determine subscription status
  const getSubscriptionStatus = (startDate, remainingDays) => {
    const currentDate = new Date();
    const start = new Date(startDate);

    if (currentDate < start) {
      return "Upcoming"; 
    } else if (remainingDays > 0) {
      return "Active"; 
    } else {
      return "Expired"; 
    }
  };

  // Fetch subscriber details
  useEffect(() => {
    const fetchSubscriber = () => {
      setIsLoading(true); // Set loading state to true
      setError(null); // Clear any previous errors
  
      fetch(`http://localhost:5174/post/subscriber/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch subscriber details");
          }
          return response.json(); // Parse the JSON response
        })
        .then((data) => {
          // Calculate remaining days and subscription status
          const remainingDays = calculateRemainingDays(data.endDate);
          const status = getSubscriptionStatus(data.startDate, remainingDays);
  
          // Create a subscriber object with additional details
          const subscriberWithDetails = {
            ...data,
            daysRemaining: remainingDays,
            status,
          };
            setSubscriber(subscriberWithDetails);
        })
        .catch((error) => {
          setError(error.message); 
        })
        .finally(() => {
          setIsLoading(false); 
        });
    };
  
    fetchSubscriber(); 
  }, [id]); 

  // Handle subscription renewal
 const handleRenew = async (newStartDate, newEndDate) => {
    try {
      const response = await fetch(`http://localhost:5174/subscriber/${id}/renew`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ startDate: newStartDate, endDate: newEndDate }),
      });
      if (!response.ok) {
        throw new Error("Failed to renew subscription");
      }
      const updatedSubscriber = await response.json();
      setSubscriber(updatedSubscriber);
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5174/post/deleteSubscriper/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete subscriber");
      }
      navigate("/home"); // Redirect to dashboard after deletion
    } catch (error) {
      setError(error.message);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="subscriber-details">
          <div className="header">
              <button onClick={() => navigate("/home")} className="back-button">
              <i className="fas fa-arrow-left"></i> 
              </button>
              <button onClick={() => setShowConfirmation(true)} className="delete-button">
              <i className="fas fa-trash"></i>
              </button>
          </div>
          <h2>
                {subscriber.firstName} {subscriber.lastName}
              </h2>
          {subscriber.image && (
            <div className="subscriber-image">
              <img src={subscriber.image} alt={`${subscriber.firstName} ${subscriber.lastName}`} />
            </div>
          )}

          <dl className="subscriber-info">
            <div className="info-item">
              <dt>Phone</dt>
              <dd>{subscriber.phone}</dd>
            </div>
            <div className="info-item">
              <dt>Start Date</dt>
                <dd>
                  {new Date(subscriber.startDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </dd>
            </div>
            <div className="info-item">
              <dt>End Date</dt>
                <dd>
                  {new Date(subscriber.endDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </dd>
            </div>
            <div className="info-item">
              <dt>Countdown</dt>
              <dd>{subscriber.daysRemaining}</dd>
            </div>
            <div className="info-item">
              <dt>Amount</dt>
              <dd>{subscriber.amount}</dd>
            </div>
            <div  className={`status ${subscriber.status} info-item`}>
              <dt >Status</dt>
              <dd>{subscriber.status}</dd>
            </div>
          </dl>

      {/* Renew Subscription Form */}
          <div className="renewal-form">
          <form
              onSubmit={(e) => {
                e.preventDefault();
                const newStartDate = e.target.startDate.value;
                const newEndDate = e.target.endDate.value;
                handleRenew(newStartDate, newEndDate);
              }}
              >
              <div className="renewal-input">
                <label htmlFor="startDate">New Start Date</label>
                <input type="date" id="startDate" name="startDate" required />
              </div>
              <div className="renewal-input">
                <label htmlFor="endDate">New End Date</label>
                <input type="date" id="endDate" name="endDate" required />
              </div>
              <div className="renewal-input">
                <label htmlFor="amount">Amount</label>
                <input type="number" id="amount" name="amount" required />
              </div>
              <div className="form-btn">
                <button type="submit">Renew Subscription</button>
              </div>
            </form>
          </div>
            
          {/* Confirmation Modal */}
          {showConfirmation && (
            <div className="confirmation-modal">
              <p>Are you sure you want to delete this subscriber?</p>
              <div className="button-container">
              <button className="cancel" onClick={() => setShowConfirmation(false)}>
                  Cancel
                </button>
                <button className="confirm" onClick={handleDelete}>
                  Yes, Delete
                </button>
              </div>
            </div>
          )}
    </div>
  );
};

export default SubscriberDetails;


