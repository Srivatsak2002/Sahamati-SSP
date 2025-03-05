import React, { useState } from "react";
import "./signIn.css";
import { useNavigate } from "react-router-dom";
// import { userTokenGenerate } from "../../Services/api";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useApi } from "../../Services/api"; // Import the custom hook
import { useConfig } from "../../Context/configContext";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { userTokenGenerate } = useApi();
  const config = useConfig();
  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   setError("");
  //   try {
  //     const response = await userTokenGenerate({ username: email, password });
  //     const token = response.data.accessToken;
  //     toast.success("Signed in successfully!");
  //     navigate("/home", { state: { email, token } });
  //   } catch (error) {
  //     setError("Incorrect username or password");
  //     toast.error("Failed to sign in. Please check your credentials.");
  //   }
  // };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const response = await userTokenGenerate({ username: email, password });
      const token = response.data.accessToken;
      const decodedToken: any = jwtDecode(token);
      const roles: string[] = decodedToken?.realm_access?.roles || [];
      
      const isSelfServicePortalEnabled = config.REACT_APP_SELF_SERVICE_PORTAL_ENABLED === true;
      if (roles.includes("admin")) {
        toast.success("Admin login successful!");
        navigate("/admin-portal", { state: { email, token } });
      } else {
        if (isSelfServicePortalEnabled) {
          toast.success("Signed in successfully!");
          navigate("/home", { state: { email, token } });
        } else {
          toast.warning(
            "Signed in successfully! But self-service portal is disabled."
          );
        }
      }
    } catch (error) {
      setError("Incorrect username or password");
      toast.error("Failed to sign in. Please check your credentials.");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h1 className="signin-title">Sign in to your account</h1>
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

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="signin-footer">
            <a
              href="#"
              className="forgot-password"
              onClick={() => navigate("/forgotpassword")}
            >
              Forgot Password?
            </a>

            <button type="submit" className="signin-btn">
              Sign In
            </button>
          </div>
        </form>

        <div className="new-user">
          New user?{" "}
          <a href="#" onClick={() => navigate("/register")}>
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
