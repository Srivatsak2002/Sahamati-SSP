import React, { useState } from "react";
import "./forgotPassword.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      // Make an API call to request a password reset
      // Example: await requestPasswordReset({ email });
      toast.success(
        "Password reset instructions have been sent to your email."
      );
      navigate("/signin");
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setError("Failed to request password reset. Please try again.");
      toast.error("Failed to request password reset.");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h1 className="forgot-password-title">Forgot Password?</h1>
        <p>
          Enter your email address below, and we will send you instructions to
          reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          <div>
          <a
              href="#"
              className="back-to-signin-link"
              onClick={() => navigate("/signin")}
            >
              Back to Sign In
            </a>
            <button type="submit" className="reset-password-btn">
              Send Reset Instructions
            </button>
           
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
