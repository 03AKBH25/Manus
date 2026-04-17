import axios from "axios";

async function test() {
  try {
    // 1. Register/Login
    const registerResponse = await axios.post("http://localhost:5000/auth/register", {
      name: "TestUser",
      email: "test1@test.com",
      password: "password123"
    }).catch(e => e.response);

    let token = registerResponse?.data?.data?.token;

    if (!token && registerResponse?.status === 400) {
      // maybe already registered, try login
      const loginResponse = await axios.post("http://localhost:5000/auth/login", {
        email: "test1@test.com",
        password: "password123"
      });
      token = loginResponse.data.data.token;
    }

    console.log("Got token:", token);

    // 2. Fetch bootstrap
    const bootstrapResponse = await axios.get("http://localhost:5000/chat/bootstrap", {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Bootstrap success:", Object.keys(bootstrapResponse.data.data));

  } catch (error) {
    console.error("Test failed:", error.response?.data || error.message);
  }
}

test();
