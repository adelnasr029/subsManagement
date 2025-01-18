import React, { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:2121/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data)

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      console.log("Signup successful:", data);
      alert("Signup successful!"); // Notify the user
      setFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      }); // Reset the form
    } catch (err) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
     <>
          <div className="form-description">
               <h2>Sign Up</h2>
               {error && <div className="alert alert-danger">{error}</div>}
          </div>
          <div className="signup-container">
               <form onSubmit={handleSubmit} method="POST">
                    <div className="form-group">
                         <label htmlFor="userName" >User Name</label>
                         <input 
                         type="text" 
                         name="userName" 
                         value={formData.userName}
                         onChange={handleChange}
                         required
                         id="userName" 
                         />
                    </div >
                    <div className="form-group">
                         <label htmlFor="email" >E-mail</label>
                         <input 
                         type="email" 
                         name="email"
                         value={formData.email}
                         onChange={handleChange}
                         aria-describedby="emailHelp"
                         required
                         id="email" 
                          />
                    </div>
                    <div className="form-group">
                         <label htmlFor="password" >Password</label>
                         <input 
                         type="password" 
                         name="password"
                         value={formData.password}
                         onChange={handleChange}
                         required 
                         id="password"
                         />
                    </div>
                    <div className="form-group">
                         <label htmlFor="confirmPassword" >Confirm      Password</label>
                         <input 
                         type="password" 
                         name="confirmPassword" 
                         value={formData.confirmPassword}
                         onChange={handleChange}
                         required
                         id="confirmPassword"
                         />
                    </div>
                    <button>
                         {loading ? "Signing Up..." : "Submit"}
                    </button>
               </form>
          </div>
     </>
    )
}




























// import { useState } from "react"

// export default function Signup(){
//      const [formData, setFormData] = useState({
//           userName: '',
//           email: '',
//           password: '',
//           confirmPassword: ''
//      })
//      function handleSubmit(event){
//           e.preventDefault()
//           const formElement = event.currentTarget
//           const formInputs =  new FormData(formElement)
//           formEl.reset()

//           console.log(formInputs)
//           try{
//                const res = fetch('localhost:2121/signup', {
//                     method: "POST", 
//                     headers: {
//                          "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({
//                          userName: formInputs.userName,
//                          email: formInputs.email,
//                          password: formInputs.password,
//                          confirmPassword: formInputs.confirmPassword
//                     })
//                })
//           } catch (err) {
//                console.log(err);
//           }
//      }


// }



