const userForm = document.querySelector("#userForm");

let users = [];
let editing = false;
let userId = null;

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

  if (!editing) {
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
  } else {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });
    const updatedUser = await response.json();

    users = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    editing = false;
    userId = null;
  }

  renderUser(users);
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
        <button class="btn-delete btn btn-danger btn-sm">Delete</button>
        <button class="btn-edit btn btn-warning btn-sm">Edit</button>
    </div>
    </header>
    <p>${u.email}</p>
    <p class="text-truncate">${u.password}</p>`;

    const btnDelete = userItem.querySelector(".btn-delete");
    btnDelete.addEventListener("click", async () => {
      const response = await fetch(`/api/users/${u.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      users = users.filter((u) => u.id !== data.id);
      renderUser(users);
    });

    const btnEdit = userItem.querySelector(".btn-edit");
    btnEdit.addEventListener("click", async () => {
      const response = await fetch(`/api/users/${u.id}`);
      const data = await response.json();
      userForm["username"].value = data.username;
      userForm["email"].value = data.email;
      editing = true;
      userId = data.id;
    });

    userList.append(userItem);
  });
}
