// Récupération de l'id via l'url
const idProduct = new URL(window.location.href).searchParams.get("id");
    // console.log(idProduct);

// Récupération de l'article de son id
let dataProduct = [];

async function fetchProductById(id) {
    await fetch(`http://localhost:3000/api/products/` + id)
        .then((products) => products.json())
        .then((promise) => {
            // console.log(promise);
            dataProduct = promise
            // console.log(dataProduct);
        });
};

// Récupération des sélecteurs
let imgProduct = document.querySelector(".item__img");
let titleProduct = document.getElementById("title");
let priceProduct = document.getElementById("price");
let descriptionProduct = document.getElementById("description");
let colorsProduct = document.getElementById("colors");

let img = document.createElement("img");
imgProduct.appendChild(img);


// Affichage des données dans la page produit
async function writeHtmlProduct() {
    await fetchProductById(idProduct);

    img.setAttribute("src", dataProduct.imageUrl);
    img.setAttribute("alt", dataProduct.altTxt);

    document.title = dataProduct.name;
    // console.log(dataProduct.name);
    titleProduct.innerHTML = dataProduct.name;
    // console.log(dataProduct.price);
    priceProduct.innerHTML = dataProduct.price;
    // console.log(dataProduct.description);
    descriptionProduct.innerHTML = dataProduct.description;

    for (let i = 0; i < dataProduct.colors.length; i++) {
        let color = document.createElement("option");
        color.setAttribute("value", dataProduct.colors[i]);
        color.innerHTML = dataProduct.colors[i];
        colorsProduct.appendChild(color);
    }
}

writeHtmlProduct();


// Ecoute du clic sur le panier
// ajouter produit dans LocalStorage pour pouvoir recuperer ensuite dans le pannier

let btnAddToCart = document.getElementById("addToCart");
console.log(btnAddToCart);
btnAddToCart.addEventListener("click", () => {
    let cartTableau = JSON.parse(localStorage.getItem(addToCart));
    console.log(cartTableau);

    // condition de sélection d'une quantité et d'une couleur pour pouvoir ajouter au panier
    if (document.querySelector("#colors").value == "" || document.querySelector("#quantity").value <= "0") {
        alert("Merci de renseigner une couleur et/ou une quantité");
        return;
    }

    let fusionProduitsValeurs = {
        id: dataProduct._id,
        color: document.querySelector("#colors").value,
        quantity: document.querySelector("#quantity").value,
    }
    console.log(fusionProduitsValeurs);
})
