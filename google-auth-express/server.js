/**
 * Express Project to Verify Google Token
 * Time Complexity: O(1) - Constant time verification logic
 * Space Complexity: O(1) - Minimal memory for payload storage
 */

import express from "express";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("req", req.url);

  res.send("Welcome to the Google Token Verification API");
});

// Step 4: Verification Logic inside a Controller/Route
app.post("/api/v1/auth/google", async (req, res) => {
  const { auth_token } = req.body;
  console.log("token:", auth_token);

  // Optional Chaining and Nullish Coalescing for safety
  if (!auth_token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    // Step 5: Verify the token with Google's library
    const ticket = await client.verifyIdToken({
      idToken: auth_token,
      audience: process.env.GOOGLE_CLIENT_ID, // Ensures the token is meant for your app
    });

    const payload = ticket.getPayload();

    // Destructuring for readability
    const { sub, email, name, picture } = payload;

    console.log(`User ${name} verified successfully.`);

    // Step 6: Response with user data
    res.status(200).json({
      message: "Verification successful",
      user: { id: sub, email, name, picture },
    });
  } catch (error) {
    // Step 7: Handle Edge Cases (Expired or Invalid Token)
    res.status(401).json({
      error: "Invalid or expired token",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
