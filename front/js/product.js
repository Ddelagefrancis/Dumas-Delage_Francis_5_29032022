// -----Récupération de l'id via l'url-----
const idProduct = new URL(window.location.href).searchParams.get("id");
// console.log(idProduct);

// -----Récupération de l'article de son id-----
let dataProduct = [];

async function fetchProductById(id) {
    await fetch(`http://localhost:3000/api/products/` + id)
        .then((products) => products.json())
        .then((promise) => {
            // console.log(promise);
            dataProduct = promise
            // console.log(dataProduct);
        })
        .catch((err) => {
            alert("Oups, le serveur rencontre un problème.");
            console.log(err);
        });
};

// -----Récupération des sélecteurs-----
let imgProduct = document.querySelector(".item__img");
let titleProduct = document.getElementById("title");
let priceProduct = document.getElementById("price");
let descriptionProduct = document.getElementById("description");
let colorsProduct = document.getElementById("colors");

let img = document.createElement("img");
imgProduct.appendChild(img);


// -----Affichage des données dans la page produit-----
async function writeHtmlProduct() {
    await fetchProductById(idProduct);

    img.setAttribute("src", dataProduct.imageUrl);
    img.setAttribute("alt", dataProduct.altTxt);

    document.title = dataProduct.name;
    
    titleProduct.innerHTML = dataProduct.name;
    priceProduct.innerHTML = dataProduct.price;
    descriptionProduct.innerHTML = dataProduct.description;
    for (let i = 0; i < dataProduct.colors.length; i++) {
        let color = document.createElement("option");
        color.setAttribute("value", dataProduct.colors[i]);
        color.innerHTML = dataProduct.colors[i];
        colorsProduct.appendChild(color);
    }
}

writeHtmlProduct();

// -----Ecoute du clic sur le panier-----
// -----ajouter produit dans LocalStorage pour pouvoir recuperer ensuite dans le pannier-----
document.querySelector("#addToCart").addEventListener('click', () => {

    if (document.querySelector("#colors").value == "" || document.querySelector("#quantity").value == "0" || document.querySelector("#quantity").value >= 101) {
        alert("Merci de renseigner une couleur et/ou une quantité");
        return;
    }

// -----création d'un nouveau produit avec récupération des valeurs-----
    let fusionProduitsValeurs = { 
        id: dataProduct._id,
        color: document.querySelector("#colors").value,
        quantity: document.querySelector("#quantity").value,
        // console.log(fusionProduitsValeurs);
    }

// -----récupération du panier dans le localstorage-----
    let cartTableau = JSON.parse(localStorage.getItem("addToCart"));

// -----Ajouter produit selectionner, mais si même id et même color on incrémente-----
// -----sinon ajouter produit non présent----- 
    if (cartTableau == null) {
        cartTableau = [];
        cartTableau.push(fusionProduitsValeurs);
        // console.log(cartTableau);
    }
    else {
        let existCartTableau = false;
        let incrementeProduit;
        cartTableau.forEach(item => {
            // -----verification de l existance du produit dans le panier ainsi que même color même id-----
            // -----récupération de sont index-----
            switch (item.color + item.id) {
                case fusionProduitsValeurs.color + fusionProduitsValeurs.id:
                    existCartTableau = true;
                    incrementeProduit = cartTableau.indexOf(item);
            }
        })
        if (existCartTableau) {
            cartTableau[incrementeProduit].quantity = +cartTableau[incrementeProduit].quantity + + fusionProduitsValeurs.quantity;
        }
        else {
            cartTableau.push(fusionProduitsValeurs);
        }
    }

// -----ajout dans le localstorage-----
    localStorage.setItem("addToCart", JSON.stringify(cartTableau));
    console.table(cartTableau);
}) 