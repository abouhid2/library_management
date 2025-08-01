import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { authAPI } from "../services/api";

const Login = ({ onLogin }) => {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
    name: "",
    userType: "member",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      setError("");
      setFormData({
        email: "",
        password: "",
        passwordConfirmation: "",
        name: "",
        userType: "member",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (mode === "register") {
      if (!formData.name.trim()) {
        setError("Name is required");
        return false;
      }
      if (formData.password !== formData.passwordConfirmation) {
        setError("Passwords do not match");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      let response;

      if (mode === "login") {
        response = await authAPI.login(formData.email, formData.password);
      } else {
        // Register mode
        const userData = {
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.passwordConfirmation,
          name: formData.name,
          user_type: formData.userType,
        };
        response = await authAPI.register(userData);
      }

      if (response.data.success) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("authToken", "dummy-token"); // In a real app, you'd use JWT
        onLogin(response.data.user);
      }
    } catch (err) {
      if (mode === "register" && err.response?.data?.errors) {
        setError(err.response.data.errors.join(", "));
      } else {
        setError(
          err.response?.data?.message ||
            `${mode === "login" ? "Login" : "Registration"} failed`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Library Management System
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              aria-label="authentication mode"
            >
              <ToggleButton value="login" aria-label="login">
                Sign In
              </ToggleButton>
              <ToggleButton value="register" aria-label="register">
                Register
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {mode === "register" && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
              />
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus={mode === "login"}
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              value={formData.password}
              onChange={handleChange}
            />

            {mode === "register" && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="passwordConfirmation"
                  label="Confirm Password"
                  type="password"
                  id="passwordConfirmation"
                  autoComplete="new-password"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel id="user-type-label">User Type</InputLabel>
                  <Select
                    labelId="user-type-label"
                    id="userType"
                    name="userType"
                    value={formData.userType}
                    label="User Type"
                    onChange={handleChange}
                  >
                    <MenuItem value="member">Member</MenuItem>
                    <MenuItem value="librarian">Librarian</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading
                ? mode === "login"
                  ? "Signing In..."
                  : "Creating Account..."
                : mode === "login"
                ? "Sign In"
                : "Sign Up"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
