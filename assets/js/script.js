document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded successfully!");

    // ✅ Handle Signup Form Submission
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent default form submission
            
            // Capture input values
            const name = document.getElementById("name")?.value.trim();
            const email = document.getElementById("email")?.value.trim();
            const password = document.getElementById("password")?.value;
            const confirmPassword = document.getElementById("confirm-password")?.value;

            console.log("Signup Attempt:", { name, email, password, confirmPassword });

            // Validation
            if (!name || !email || !password || !confirmPassword) {
                alert("All fields are required!");
                return;
            }
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            try {
                // Send signup request to backend
                const response = await fetch("https://phishing-detector-backend.onrender.com/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                });

                const data = await response.json();
                console.log("Signup Response:", data);

                if (response.ok) {
                    alert("Signup successful! You can now log in.");
                    window.location.href = "login.html"; // Redirect to login page
                } else {
                    alert(data.message || "Signup failed!");
                }
            } catch (error) {
                console.error("Signup Error:", error);
                alert("Something went wrong. Please try again.");
            }
        });
    }

    // ✅ Handle Login Form Submission
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            if (!email || !password) {
                alert("Please enter both email and password!");
                return;
            }

            console.log("Login Attempt:", { email, password });

            try {
                // Send login request to backend
                const response = await fetch("https://phishing-detector-backend.onrender.com/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                console.log("Login Response:", data);

                if (response.ok) {
                    alert("Login successful!");
                    localStorage.setItem("token", data.token); // Store JWT token
                    window.location.href = "scan.html"; // Redirect after login
                } else {
                    alert(data.message || "Invalid email or password!");
                }
            } catch (error) {
                console.error("Login Error:", error);
                alert("Something went wrong. Please try again.");
            }
        });
    }

    // ✅ Handle URL Scanning
    function scanURL() {
        let urlInput = document.getElementById("urlInput"); // Corrected ID
        let scanResultDiv = document.getElementById("scanResult");
    
        if (!urlInput) {
            console.error("Error: URL input field not found!");
            return false;
        }
    
        let urlValue = urlInput.value.trim(); // Get input value and trim whitespace
    
        if (!urlValue) {
            scanResultDiv.innerHTML = `<p style="color:red;">Please enter a URL.</p>`;
            return false;
        }
    
        // Call API using POST method with JSON payload
        fetch("https://phishing-detector-backend.onrender.com/scan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: urlValue }) // Send URL as JSON
        })
        .then(response => response.json()) // Parse response as JSON
        .then(data => {
            console.log("API Response:", data); // Debugging
    
            if (data.safe === true) {
                scanResultDiv.innerHTML = `<p style="color:green;">✅ Safe URL</p>`;
            } else if (data.safe === false) {
                scanResultDiv.innerHTML = `<p style="color:red;">⚠️ Phishing Detected!</p>`;
            } else {
                scanResultDiv.innerHTML = `<p style="color:orange;">⚠️ Unexpected response.</p>`;
            }
        })
        .catch(error => {
            scanResultDiv.innerHTML = `<p style="color:red;">Error scanning URL.</p>`;
            console.error("Error:", error);
        });
    
        return false; // Prevent form submission
    }
    
});
