const userForm = document.querySelector("#userForm");

let users = [];

window.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("/api/users");
  const data = await res.json();
  users = data;
  renderUser(users);
});

userForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = userForm["username"].value;
  const email = userForm["email"].value;
  const password = userForm["password"].value;

  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
  const data = await response.json();
  users.unshift(data);
  renderUser(users)
  userForm.reset();
});

function renderUser(users) {
  const userList = document.querySelector("#userList");
  userList.innerHTML = "";

  users.forEach((u) => {
    const userItem = document.createElement("li");

    userItem.classList = "list-group-item list-group-item-dark my-2";
    userItem.innerHTML = `<header class="d-flex justify-content-between align-items-center">
    <h3>${u.username}</h3>
    <div>
        <button class="btn btn-danger btn-sm">Delete</button>
        <button class="btn btn-warning btn-sm">Edit</button>
    </div>
    </header>
    <p>${u.email}</p>
    <p class="text-truncate">${u.password}</p>`;

    userList.append(userItem);
  });
}
