let products = [
    {
        id: 1,
        name: "Носки мужские, 5 пар",
        description: "Носки обеспечивают хорошую вентиляцию и комфорт при ношении. Их можно легко сочетать с самой разнообразной обувью.",
        price: 69,
        category: "Одежда",
        image: "https://ir.ozone.ru/s3/multimedia-1-h/wc1000/10698649865.jpg"
    },
    {
        id: 2,
        name: "Зарядка для iPhone",
        description: "Быстрый и надежный. Максимальный ток кабеля - 5А, что позволяет зарядить Ваш телефон от 30-40 минут до 100%.",
        price: 67,
        category: "Электроника",
        image: "https://ir.ozone.ru/s3/multimedia-1-a/wc1000/9033763978.jpg"
    },
    {
        id: 3,
        name: "Набор маркеров строительных для разметки по металлу",
        description: "Набор строительных маркеров VIRA предназначен для нанесения точной разметки на металле, дереве, стекле и других поверхностях.",
        price: 666,
        category: "Инструменты",
        image: "https://ir.ozone.ru/s3/multimedia-1-v/wc1000/13572987871.jpg"
    },
    {
        id: 4,
        name: "Игрушка для кошек интерактивная",
        description: "Игрушка для кошек и собак в виде умного автоматического шара отлично подойдет для развлечения домашнего питомца.",
        price: 404,
        category: "Животные",
        image: "https://ir.ozone.ru/s3/multimedia-1-k/wc1000/10818318620.jpg"
    }
];


let cart = JSON.parse(localStorage.getItem("cart")) || {};
let users = JSON.parse(localStorage.getItem("users")) || [];
let username = localStorage.getItem("username") || "";
let favorites = {};

if (username != "") {
    favorites = JSON.parse(localStorage.getItem("favorites_" + username)) || {};
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id) {
    if (cart[id]) {
        cart[id]++;
    } else {
        cart[id] = 1;
    }

    saveCart();
    updateCartCount();
    showProducts();
    showFavorites();
    showCart();
}

function removeFromCart(id) {
    if (cart[id] > 1) {
        cart[id]--;
    } else {
        delete cart[id];
    }

    saveCart();
    updateCartCount();
    showProducts();
    showFavorites();
    showCart();
}

function deleteFromCart(id) {
    delete cart[id];

    saveCart();
    updateCartCount();
    showProducts();
    showFavorites();
    showCart();
}

function updateCartCount() {
    let count = 0;

    for (let id in cart) {
        count = count + cart[id];
    }

    let cartCount = document.getElementById("cart-count");
    let profileCount = document.getElementById("profile-cart-count");

    if (cartCount) {
        cartCount.textContent = count;
    }

    if (profileCount) {
        profileCount.textContent = count;
    }
}

function toggleFavorite(id) {
    if (username == "") {
        alert("Сначала войдите в аккаунт!");
        window.location.href = "login.html";
        return;
    }

    if (favorites[id]) {
        delete favorites[id];
    } else {
        favorites[id] = true;
    }

    localStorage.setItem("favorites_" + username, JSON.stringify(favorites));

    showProducts();
    showFavorites();
}

function showProducts() {
    let productList = document.getElementById("product-list");

    if (!productList) {
        return;
    }

    let search = document.getElementById("search").value.toLowerCase();
    let category = document.getElementById("category").value;
    let sort = document.getElementById("sort").value;

    let filteredProducts = products.filter(function(product) {
        let nameMatch = product.name.toLowerCase().includes(search);
        let categoryMatch = category == "all" || product.category == category;

        return nameMatch && categoryMatch;
    });

    if (sort == "price-up") {
        filteredProducts.sort(function(a, b) {
            return a.price - b.price;
        });
    }

    if (sort == "price-down") {
        filteredProducts.sort(function(a, b) {
            return b.price - a.price;});
    }

    if (sort == "name") {
        filteredProducts.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
    }

    productList.innerHTML = "";

    for (let i = 0; i < filteredProducts.length; i++) {
        let product = filteredProducts[i];
        let count = cart[product.id] || 0;

        let heartClass = "favorite-button";
        let heart = "♡";

        if (favorites[product.id]) {
            heartClass = "favorite-button active";
            heart = "♥";
        }

        productList.innerHTML += `
            <div class="product-card">
                <button class="${heartClass}" onclick="toggleFavorite(${product.id})">${heart}</button>

                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p class="description">${product.description}</p>
                <p class="price">${product.price} $</p>
                <p class="product-count">В корзине: ${count} шт.</p>

                <button class="buy-button" onclick="addToCart(${product.id})">
                    Купить сейчас
                </button>
            </div>
        `;
    }

    if (filteredProducts.length == 0) {
        productList.innerHTML = "<p>Товары не найдены</p>";
    }
}

function showFavorites() {
    let favoriteList = document.getElementById("favorite-list");

    if (!favoriteList) {
        return;
    }

    favoriteList.innerHTML = "";

    let count = 0;

    for (let i = 0; i < products.length; i++) {
        let product = products[i];

        if (favorites[product.id]) {
            count++;

            favoriteList.innerHTML += `
                <div class="product-card">
                    <button class="favorite-button active" onclick="toggleFavorite(${product.id})">♥</button>

                    <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p class="price">${product.price} $</p>
                    <p class="product-count">
                        В корзине: ${cart[product.id] || 0} шт.
                    </p>

                    <button class="buy-button" onclick="addToCart(${product.id})">
                        Купить сейчас
                    </button>
                </div>
            `;
        }
    }

    if (count == 0) {
        favoriteList.innerHTML = "<p>В избранном пока ничего нет</p>";
    }
}

function showCart() {
    let cartList = document.getElementById("cart-list");
    let cartTotal = document.getElementById("cart-total");

    if (!cartList || !cartTotal) {
        return;
    }

    cartList.innerHTML = "";

    let total = 0;
    let count = 0;

    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let quantity = cart[product.id];

        if (quantity) {
            count++;

            let productTotal = product.price * quantity;
            total = total + productTotal;

            cartList.innerHTML += `
                <div class="cart-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p>Цена: ${product.price} $</p>

                    <div class="quantity">
                        <button onclick="removeFromCart(${product.id})">-</button>
                        <span>${quantity}</span>
                        <button onclick="addToCart(${product.id})">+</button>
                    </div>

                    <p>Сумма: ${productTotal} $</p>

                    <button class="remove-button" onclick="deleteFromCart(${product.id})">
                        Удалить
                    </button>
                </div>
            `;
        }
    }

    if (count == 0) {
        cartList.innerHTML = "<p>Корзина пуста</p>";
    }

    cartTotal.textContent = total;
}

function registerUser() {
    let name = document.getElementById("reg-name").value.trim();let email = document.getElementById("reg-email").value.trim();
    let password = document.getElementById("reg-password").value;

    if (name == "" || email == "" || password == "") {
        alert("Заполните все поля!");
        return;
    }

    for (let i = 0; i < users.length; i++) {
        if (users[i].name.toLowerCase() == name.toLowerCase()) {
            alert("Такой пользователь уже существует!");
            return;
        }
    }

    users.push({
        name: name,
        email: email,
        password: password
    });

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("username", name);

    window.location.href = "profile.html";
}

function loginUser() {
    let name = document.getElementById("login-name").value.trim();
    let password = document.getElementById("login-password").value;

    if (name == "" || password == "") {
        alert("Введите имя и пароль!");
        return;
    }

    for (let i = 0; i < users.length; i++) {
        if (users[i].name.toLowerCase() == name.toLowerCase() && users[i].password == password) {
            localStorage.setItem("username", users[i].name);
            window.location.href = "profile.html";
            return;
        }
    }

    alert("Неверное имя или пароль!");
}

function showProfile() {
    let profileName = document.getElementById("profile-name");

    if (!profileName) {
        return;
    }

    if (username == "") {
        window.location.href = "login.html";
        return;
    }

    profileName.textContent = username;

    let avatar = document.getElementById("profile-avatar");
    avatar.textContent = username[0].toUpperCase();

    let email = document.getElementById("profile-email");

    for (let i = 0; i < users.length; i++) {
        if (users[i].name == username) {
            email.textContent = users[i].email;
        }
    }
}

function logoutUser() {
    localStorage.removeItem("username");
    window.location.href = "login.html";
}

function updateProfileLink() {
    let link = document.getElementById("profile-link");

    if (link) {
        if (username != "") {
            link.href = "profile.html";
        } else {
            link.href = "login.html";
        }
    }
}
function showRegister() {
    document.getElementById("login-block").style.display = "none";
    document.getElementById("reg-block").style.display = "block";
}

function showLogin() {
    document.getElementById("reg-block").style.display = "none";
    document.getElementById("login-block").style.display = "block";
}

updateProfileLink();
updateCartCount();
showProfile();
showProducts();
showFavorites();
showCart();