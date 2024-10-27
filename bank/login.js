function login() {
    event.preventDefault();
    
    // Validate inputs
    const surname = document.getElementById("surname").value;
    const dob = document.getElementById("dob").value;
    const postcode = document.getElementById("postcode").value;
    const account = document.getElementById("account").value;
    const sortcode = document.getElementById("sortcode").value;

    if (surname && dob && postcode && account && sortcode) {
        // For now, just simulate a login action
        alert("Logging in...");
        // Add actual login logic or API request here
    } else {
        alert("Please fill in all required fields.");
    }
}
