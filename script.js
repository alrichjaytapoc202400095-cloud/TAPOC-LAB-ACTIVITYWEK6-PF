const loadBtn = document.getElementById("loadBtn");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const usersContainer = document.getElementById("usersContainer");
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    // Filter users by name
    const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm)
    );
    
    // Show filtered results
    renderUsers(filtered);
});

let users = [];

async function fetchUsers() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

function createUserCard(user) {
    const card = document.createElement("div");
    card.className = "user-card";
    card.innerHTML = `
        <h3>${user.name}</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Company:</strong> ${user.company?.name ?? "N/A"}</p>
        <p><strong>City:</strong> ${user.address?.city ?? "N/A"}</p>
    `;
    return card;
}

function renderUsers(userList) {
    usersContainer.innerHTML = "";
    userList.forEach((user) => {
        const card = createUserCard(user);
        usersContainer.appendChild(card);
    });
}

loadBtn.addEventListener("click", async () => {
    errorDiv.classList.add("hidden");
    errorDiv.textContent = "";
    usersContainer.innerHTML = "";

    loadingDiv.classList.remove("hidden");
    loadBtn.disabled = true;
    loadBtn.textContent = "Loading...";

    try {
        users = await fetchUsers();
        renderUsers(users);
    } catch (error) {
        errorDiv.textContent = "Error: Could not load users. Please try again.";
        errorDiv.classList.remove("hidden");
        console.error("Error loading users:", error);
    } finally {
        loadingDiv.classList.add("hidden");
        loadBtn.disabled = false;
        loadBtn.textContent = "Load Users";
    }
});