// -----Récupération du localstorage-----
let cartTableau = JSON.parse(localStorage.getItem("addToCart"));
console.log(cartTableau);


async function renderCart() {
    if (cartTableau) {
        // -----Récupération des infos manquantes via l'API-----
        for (let product of cartTableau) {
            await fetch(`http://localhost:3000/api/products/${product.id}`)
                .then((response) => response.json())
                .then(function (productApi) {

                    // Création de la balise "article" et insertion dans la section
                    let productArticle = document.createElement("article");
                    document.querySelector("#cart__items").appendChild(productArticle);
                    productArticle.className = "cart__item";

                    // Insertion de l'élément "div" pour l'image produit
                    let productDivImg = document.createElement("div");
                    productArticle.appendChild(productDivImg);
                    productDivImg.className = "cart__item__img";

                    // Insertion de l'image
                    let productImg = document.createElement("img");
                    productDivImg.appendChild(productImg);
                    productImg.src = productApi.imageUrl;
                    productImg.alt = productApi.altTxt;

                    // Insertion de l'élément "div" pour la description produit
                    let productItemContent = document.createElement("div");
                    productArticle.appendChild(productItemContent);
                    productItemContent.className = "cart__item__content";

                    // Insertion de l'élément "div"
                    let productItemContentDescription = document.createElement("div");
                    productItemContent.appendChild(productItemContentDescription);
                    productItemContentDescription.className = "cart__item__content__description";

                    // Insertion du titre h2
                    let productTitle = document.createElement("h2");
                    productItemContentDescription.appendChild(productTitle);
                    productTitle.innerHTML = productApi.name;

                    // Insertion de la couleur
                    let productColor = document.createElement("p");
                    productItemContentDescription.appendChild(productColor);
                    productColor.innerHTML = product.color;

                    // Insertion du prix
                    let productPrice = document.createElement("p");
                    productItemContentDescription.appendChild(productPrice);
                    productPrice.innerHTML = productApi.price + " €";
                    product.price = productApi.price; // Création de la key price et récupération du prix

                    // Insertion de l'élément "div"
                    let productItemContentSettings = document.createElement("div");
                    productItemContent.appendChild(productItemContentSettings);
                    productItemContentSettings.className = "cart__item__content__settings";

                    // Insertion de l'élément "div"
                    let productItemContentSettingsQuantity = document.createElement("div");
                    productItemContentSettings.appendChild(productItemContentSettingsQuantity);
                    productItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";

                    // Insertion de "Qté : "
                    let productQty = document.createElement("p");
                    productItemContentSettingsQuantity.appendChild(productQty);
                    productQty.innerHTML = "Qté : ";

                    // Insertion de la quantité
                    let productQuantity = document.createElement("input");
                    productItemContentSettingsQuantity.appendChild(productQuantity);
                    productQuantity.value = product.quantity;
                    productQuantity.className = "itemQuantity";
                    productQuantity.setAttribute("type", "number");
                    productQuantity.setAttribute("min", "1");
                    productQuantity.setAttribute("max", "100");
                    productQuantity.setAttribute("name", "itemQuantity");

                    // Insertion de l'élément "div"
                    let productItemContentSettingsDelete = document.createElement("div");
                    productItemContentSettings.appendChild(productItemContentSettingsDelete);
                    productItemContentSettingsDelete.className = "cart__item__content__settings__delete";

                    // Insertion de "p" supprimer
                    let productDelete = document.createElement("p");
                    productItemContentSettingsDelete.appendChild(productDelete);
                    productDelete.className = "deleteItem";
                    productDelete.innerHTML = "Supprimer";

                    // Suppression pour chaque clique
                    productDelete.addEventListener("click", (e) => {
                        e.preventDefault;

                        // Récupération de l'id et de la couleur du produit
                        let deleteId = product.id;
                        let deleteColor = product.color;

                        // Suppression du produit
                        removeProduct(deleteId, deleteColor);
                        if (cartTableau.length === 0) {
                            localStorage.clear();
                            window.location.reload();
                        }
                        window.location.reload();
                    })
                    totalPrice(productApi);
                    modifyQuantity()
                    // removeProduct();
                    calculeTotals();
                });
            totalQuantity();
        }
    } else {
        const titleCart = document.querySelector("h1");

        titleCart.innerHTML = "Le panier est vide !";
        console.log("Le panier est vide");
    }
}
renderCart();


// -----Fonction pour Afficher la quantité & prix total-----
function totalQuantity() {
    // Calcul de la quantité total 
    let quantityArray = cartTableau.map(x => x.quantity);
    let totalQuantity = 0;
    for (let i = 0; i < quantityArray.length; i++) {
        totalQuantity += parseInt(quantityArray[i]);
    }

    document.getElementById("totalQuantity").innerHTML = totalQuantity;
}

function totalPrice(productApi) {
    // Calcul du prix total
    let totalPrice = 0;
    for (let i = 0; i < productApi.length; i++) {
        totalPrice += parseInt(productApi[i].price) * parseInt(productApi[i].quantity);
    }

    document.getElementById("totalPrice").innerHTML = totalPrice;
}

// Récupération des deux fonctions de calculs 
function calculeTotals() {
    totalQuantity(cartTableau)
    totalPrice(cartTableau);
}

// -----Fonction pour Modifier quantité de l'article-----
function modifyQuantity() {

    const itemToChangeQuantity = document.getElementsByClassName("cart__item");
    for (let i = 0; i < itemToChangeQuantity.length; i++) {

        let buttonChangeQuantity = itemToChangeQuantity[i].getElementsByClassName("itemQuantity");
        buttonChangeQuantity[0].addEventListener('change', function (event) {
            cartTableau[i].quantity = parseInt(event.target.value);

            if (buttonChangeQuantity[0].value <= 100 && buttonChangeQuantity[0].value >= 1) {
                localStorage.setItem("addToCart", JSON.stringify(cartTableau));
            } else {
                alert("La quantitée du produit doit être comprise entre 1 et 100.");
                buttonChangeQuantity[0].value = 1;
                cartTableau[i].quantity = 1;
                localStorage.setItem("addToCart", JSON.stringify(cartTableau));
            }
            calculeTotals();
        })
    }
}

// -----Fonction pour Supprimer l'article au clic-----
// function removeProduct() {
//     let itemToRemove = document.getElementsByClassName("cart__item");
//     let btnRemove = document.getElementsByClassName("deleteItem");

//     for (let i = 0; i < btnRemove.length; i++) {
//         let remove = btnRemove[i];
//         remove.addEventListener('click', () => {
//             cartTableau.splice(i, 1); // On supprime l'article du localstorage avec splice (i est sont index et 1 la quantité)
//             itemToRemove[i].remove(); // On supprime l'article du DOM 
//             localStorage.setItem("addToCart", JSON.stringify(cartTableau));
//             if (cartTableau.length === 0) {
//                 localStorage.clear();
//                 window.location.reload();
//             }
//             calculeTotals();
           
//         })
//     }
// }

function removeProduct(id, color) {
    cartTableau = cartTableau.filter(product => {
        if (product.id == id && product.color == color) {
           return false;
        }
        return true;
    });

    localStorage.setItem("addToCart", JSON.stringify(cartTableau));
};


// -----Validation Formulaire + envoie de la commande-----
