import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ImageTooltip from "./ImageTooltip";

const Dashboard = () => {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState([]);
  const [query, setQuery] = useState(""); // State for search query

  const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      phone: "",
      startDate: "",
      endDate: "",
      amount: "",
      image: null,
    })
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSubscriberId, setCurrentSubscriberId] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  
        // Function to calculate remaining days
        const calculateRemainingDays = ( endDate) => {
          const start = Date.now();
          const end = new Date(endDate);
            // Check if endDate is valid
          if (isNaN(end)) {
            throw new Error("Invalid endDate");
          }
          const differenceInMs = end - start;
          const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
          return differenceInDays >= 0 ? differenceInDays : 0;
        };
    
      // Function to determine subscription status
      const getSubscriptionStatus = (startDate, remainingDays) => {
        const currentDate = new Date();
        const start = new Date(startDate);
            // Check if startDate is valid
          if (isNaN(start)) {
          throw new Error("Invalid startDate");
        }
        if (currentDate < start) {
          return "Upcoming"; 
        } else if (remainingDays > 0) {
          return "Active"; 
        } else {
          return "Expired"; 
        }
      };

  useEffect(() => {
    const fetchSubscribers = () => {
      fetch(`http://localhost:5174/home`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Add daysRemaining to each subscriber
          const subscribersWithDetails = data.map((subscriber) => {
            const remainingDays = calculateRemainingDays(subscriber.endDate);
            const status = getSubscriptionStatus(
              subscriber.startDate,
              remainingDays
            );
            return {
              ...subscriber,
              daysRemaining: remainingDays,
              status,
            };
          });
          setSubscribers(subscribersWithDetails);
        })
        .catch((error) => {
          console.error("Error fetching subscribers:", error);
        });
    };
    fetchSubscribers();
  }, [refreshData]);

  // Handle search input change
  const handleSearch = (e) => {
    setQuery(e.target.value);
  };
    // Filter subscribers based on the search query (ID or name)
    const handleEdit = (id) => {
      const subscriberToEdit = subscribers.find((subscriber) => subscriber._id === id);
      if (subscriberToEdit) {
        setFormData({
          firstName: subscriberToEdit.firstName,
          lastName: subscriberToEdit.lastName,
          phone: subscriberToEdit.phone || "", 
          startDate: subscriberToEdit.startDate.split('T')[0],
          endDate: subscriberToEdit.endDate.split('T')[0],
          amount: subscriberToEdit.amount || "", 
          image: subscriberToEdit.image, 
        });
      }
      setIsEditMode(true); 
      setCurrentSubscriberId(id);
    };

  const filteredSubscribers =
      query.trim() === ""
      ? subscribers 
      : subscribers.filter((subscriber) => {
          const fullName = `${subscriber.firstName} ${subscriber.lastName}`.toLowerCase();
          return (
            subscriber._id.includes(query) ||
            subscriber.firstName.toLowerCase().includes(query.toLowerCase()) || 
            subscriber.lastName.toLowerCase().includes(query.toLowerCase()) || 
            fullName.includes(query.toLowerCase()) 
          );
      });
    
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0], 
    });
  };

  const handleUpdate = async () => {
    if (!currentSubscriberId) return; 
    setIsLoading(true);
    setError(null);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("startDate", formData.startDate);
      formDataToSend.append("endDate", formData.endDate);
      formDataToSend.append("amount", formData.amount);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      const response = await fetch(`http://localhost:5174/post/updateSubscriber/${currentSubscriberId}`, {
        method: "PUT",
        credentials: "include",
        body: formDataToSend,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const updatedSubscriber = await response.json();
      // Calculate remaining days and subscription status
      const remainingDays = calculateRemainingDays(updatedSubscriber.endDate);
      const subscriptionStatus = getSubscriptionStatus(
      updatedSubscriber.startDate,
      remainingDays
      );
      // Add the status to the updated subscriber object
      updatedSubscriber.status = subscriptionStatus;
      updatedSubscriber.daysRemaining = remainingDays;
      setSubscribers(subscribers.map(sub => sub._id === currentSubscriberId ? { ...sub, ...updatedSubscriber } : sub));
      // Reset form and edit mode
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        startDate: "",
        endDate: "",
        amount: "",
        image: null,
      });
      setIsEditMode(false);
      setCurrentSubscriberId(null);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to update the subscriber. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false); 
    setCurrentSubscriberId(null); 
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      startDate: "",
      endDate: "",
      amount: "",
      image: null,
    }); 
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName ||
    !formData.lastName ||
    !formData.startDate ||
    !formData.endDate ||
    !formData.phone ||
    !formData.amount ){
      alert("Please fill in all fields");
      setIsLoading(false); 
      return;
    }
    if (isEditMode) {
      await handleUpdate(); // Call handleUpdate if in edit mode
      return; // Exit the function to prevent further execution
    }
    setIsLoading(true); 
    setError(null); 
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("startDate", formData.startDate);
      formDataToSend.append("endDate", formData.endDate);
      formDataToSend.append("amount", formData.amount);
      console.log(formDataToSend)
      if (formData.image) {
        formDataToSend.append("image", formData.image); 
      }

      const response = await fetch("http://localhost:5174/post/createSub", {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });
      console.log('Add Sub triggered')
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        startDate: "",
        endDate: "",
        amount: "",
        image: null,
      }); 

    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit the form. Please try again."); // Set error message
    } finally {
      setRefreshData(prev => !prev)
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="dashboard">
      {/* Add New Subscriber Form */}
        <div className="form-btn-container">
            <div>
                <h1>Create Or Update Subscription Form </h1>
              </div>
            <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="01348587455"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="200 EGP"
                value={formData.amount}
                onChange={handleChange}
                required
              />
              </div>
              <div className="form-group">
                <label htmlFor="image">Subscriper Photo</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                />
              </div>
            </form>
          </div>
          <div className="form-btn">
          <button type="submit"
            onClick={handleSubmit}
           >
            {isEditMode ? "Update Subscriber" : "Add Subscriber"}
          </button>
    
            {isEditMode && (
          <button type="button" onClick={handleCancelEdit}>
              Cancel Edit
          </button>
            )}
          </div>
      </div>

      {/* Subscribers Table */}
      <div className="table-container">
        <div className="table-header">
          <h2>Subscribers List</h2>
          {/* Search Subscribers */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by ID or name..."
              value={query}
              onChange={handleSearch}
            />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Duration</th>
              <th>Start Date</th>
              <th>Status</th>
              <th>End Date</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscribers.map((subscriber) => (
              <tr key={subscriber._id}>
                <td>
                  <ImageTooltip imageUrl={subscriber.image}>
                    <Link to={`/subscriber/${subscriber._id}`}>
                     {subscriber.firstName} {subscriber.lastName}
                    </Link>
                  </ImageTooltip>
                </td>
                <td>{subscriber.daysRemaining}</td>
                <td>
                  { new Date(subscriber.startDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </td>
                <td>
                  <span className={`status ${subscriber.status}`}>
                    {subscriber.status}
                  </span>
                </td>
                <td>
                  {new Date(subscriber.endDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </td>
                <td>
                  {subscriber.amount} EGP
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(subscriber._id)}
                    className="edit-button"
                    >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
