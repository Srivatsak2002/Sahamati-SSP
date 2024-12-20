import React, { useState } from "react";
import "./forgotPassword.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../Services/api";
import CircularIndeterminate from "../../Components/CircularProgress/circularProgress";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response =await resetPassword(email);
      console.log("reponsens",response)
      toast.success(
        "Password reset instructions have been sent to your email."
      );
      navigate("/signin");
    } catch (error) {
      setError("Failed to request password reset. Please try again.");
      toast.error("Failed to request password reset.");
    } finally {
      setLoading(false);
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

        <form onSubmit={handleSubmit} className="forgot-password-form">
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

            <button type="submit" className="reset-password-btn" disabled={loading}>
              Send Reset Instructions
            </button>
          </div>
        </form>

        {loading && (
          <div className="loading-overlay">
            <CircularIndeterminate />
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
