// -----Récupération du localstorage-----
let cartTableau = JSON.parse(localStorage.getItem("addToCart"));
console.log(cartTableau);


function renderCart() {
    if (cartTableau) {
        // -----Récupération des infos manquantes via l'API-----
        for (let product of cartTableau) {
            fetch(`http://localhost:3000/api/products/${product.id}`)
                .then((response) => response.json())
                .then(function (productApi) {

                    // Création de la balise "article" et insertion dans la section
                    let productArticle = document.createElement("article");
                    document.querySelector("#cart__items").appendChild(productArticle);
                    productArticle.className = "cart__item";

                    // Création des dataset pour faciliter le ciblage de chaque produit dans la page panier
                    productArticle.setAttribute('data-id', product.id);
                    productArticle.setAttribute('data-color', product.color);

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

                    // Création de la key price et récupération du prix
                    product.price = productApi.price;

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

                    totalPrice(productApi);
                    modifyQuantity()
                    removeProduct();
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

// -----Fonction pour supprimer le produit avec l'id et la couleur correspondante-----
function removeFromCart(id, color) {
    cartTableau = cartTableau.filter(product => {
        if (product.id == id && product.color == color) {
            return false;
        }
        return true;
    });
    localStorage.setItem("addToCart", JSON.stringify(cartTableau));
};
function removeProduct() {
    document.querySelectorAll(".deleteItem").forEach(button => {
        // Pour chaque clique
        button.addEventListener("click", (e) => {
            // Récupération de l'id et de la couleur du produit
            let removeId = e.target.closest('article').getAttribute('data-id');
            let removeColor = e.target.closest('article').getAttribute('data-color');

            // Suppression du produit
            removeFromCart(removeId, removeColor);
            if (cartTableau.length === 0) {
                localStorage.clear();
                window.location.reload();
            }
            // Actualisation de la page
            window.location.reload();
        });
    })
}

// -----Validation Formulaire + envoie de la commande-----
function checkForm(form) {
    // Instauration formulaire avec regex
    let emailRegex = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
    let adresseRegex = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");
    let cityRegex = new RegExp("^[a-zA-Z-Zàâäéèêëïîôöùûüç ,.'-]+$");
    let namesRegex = new RegExp("^[a-zA-Z-Zàâäéèêëïîôöùûüç ,.'-]+$");

    // On met à zéro les messages d'erreurs 
    document.getElementById('firstNameErrorMsg').innerText = "";
    document.getElementById('lastNameErrorMsg').innerText = "";
    document.getElementById('addressErrorMsg').innerText = "";
    document.getElementById('cityErrorMsg').innerText = "";
    document.getElementById('emailErrorMsg').innerText = "";

    // On vérifie pour chaques input que les regex soient bien respecté    
    let validFirstName = form.firstName;
    if (!namesRegex.test(validFirstName)) {
        let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
        firstNameErrorMsg.innerText = "Veuillez renseigner un prénom valide";
        return false;
    }

    let validLastName = form.lastName;
    if (!namesRegex.test(validLastName)) {
        let firstNameErrorMsg = document.getElementById('lastNameErrorMsg');
        firstNameErrorMsg.innerText = "Veuillez renseigner un nom valide";
        return false;
    }
    let validAddress = form.address;
    if (!adresseRegex.test(validAddress)) {
        let firstNameErrorMsg = document.getElementById('addressErrorMsg');
        firstNameErrorMsg.innerText = "Veuillez renseigner une adresse valide";
        return false;
    }

    let validCity = form.city;
    if (!cityRegex.test(validCity)) {
        let firstNameErrorMsg = document.getElementById('cityErrorMsg');
        firstNameErrorMsg.innerText = "Veuillez renseigner une ville valide";
        return false;
    }
    let validEmail = form.email;
    if (!emailRegex.test(validEmail)) {
        let firstNameErrorMsg = document.getElementById('emailErrorMsg');
        firstNameErrorMsg.innerText = "Veuillez renseigner une adresse mail valide";
        return false;
    } else {
        // Si tous les inputs sont correctement remplis la fonction retourne true
        return true;
    }
};

// -----Fonction qui récupère le formulaire de contact, le panier et redirige vers la page confirmation-----
function postForm() {
    const order = document.getElementById("order");
    order.addEventListener("click", (e) => {
        e.preventDefault();

        // On récupère les données du formulaire dans un objet
        const contact = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            email: document.getElementById("email").value,
        }
        // On vérifit que le formulaire est complet 
        if (checkForm(contact)) {
            // On vérifit que le panier ne soit pas vide 
            if (cartTableau == null) {
                alert("Votre panier est vide")
                console.log("Votre panier est vide");
            } else {
                // On créé un tableau pour ajouter tous les id du panier 
                let products = [];
                for (let i = 0; i < cartTableau.length; i++) {
                    products.push(cartTableau[i].id);
                }
                console.log(products);

                // On créé un objet avec les valeurs du formulaire et les produits du panier
                let sendFormData = {
                    contact,
                    products,
                };
                sendPost(sendFormData);
            };
        }
        else {
            alert("Veuillez vérifier que le formulaire soit bien rempli.")
            return null
        }
    })
}
postForm()

// -----Fonction qui redirige vers la page confirmation-----
function sendPost(sendFormData) {
    const post = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendFormData),
    };

    // On requête l'API avec la méthode POST
    fetch("http://localhost:3000/api/products/order", post)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            localStorage.setItem("orderId", data.orderId);

            document.location.href = "confirmation.html?id=" + data.orderId;
        })
        .catch((err) => {
            alert("Oups, le serveur rencontre un problème." + err.message);
        });
}