const loadBtn = document.getElementById("loadBtn");
const refreshBtn = document.getElementById("refreshBtn");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const usersContainer = document.getElementById("usersContainer");
const searchInput = document.getElementById("searchInput");

let users = [];

searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    // Filter users by name
    const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm)
    );
    
    // Show filtered results
    renderUsers(filtered);
});

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

async function loadAndRenderUsers() {
    errorDiv.classList.add("hidden");
    errorDiv.textContent = "";
    usersContainer.innerHTML = "";

    loadingDiv.classList.remove("hidden");
    loadBtn.disabled = true;
    refreshBtn.disabled = true;
    loadBtn.textContent = "Loading...";

    try {
        users = await fetchUsers();
        renderUsers(users);
        refreshBtn.classList.remove("hidden");
    } catch (error) {
        errorDiv.textContent = "Error: Could not load users. Please try again.";
        errorDiv.classList.remove("hidden");
        console.error("Error loading users:", error);
    } finally {
        loadingDiv.classList.add("hidden");
        loadBtn.disabled = false;
        refreshBtn.disabled = false;
        loadBtn.textContent = "Load Users";
    }
}

loadBtn.addEventListener("click", loadAndRenderUsers);

refreshBtn.addEventListener("click", async () => {
    loadingDiv.classList.remove("hidden");
    refreshBtn.disabled = true;
    refreshBtn.textContent = "Refreshing...";

    try {
        users = await fetchUsers();
        renderUsers(users);
        searchInput.value = "";
    } catch (error) {
        errorDiv.textContent = "Error: Could not refresh users. Please try again.";
        errorDiv.classList.remove("hidden");
        console.error("Error refreshing users:", error);
    } finally {
        loadingDiv.classList.add("hidden");
        refreshBtn.disabled = false;
        refreshBtn.textContent = "Refresh";
    }
});