// appel produit API
async function getProducts() {
    let products = await fetch("http://localhost:3000/api/products")  
    if (products.ok) {
        return products.json();
    } else {
        alert(`Nous n'avons pas réussi à afficher nos canapés. Si le problème persiste, contactez-nous.`) ;
    }
}


// Creation des cards Produit
let results = getProducts()
cardProduct(results);

async function cardProduct(results) {
    results.then( (product) => {
        for (let i = 0; i < product.length; i ++) {

            // Insertion de l'élément "a"
            let productLink = document.createElement("a");
            document.querySelector(".items").appendChild(productLink);
            productLink.href = `product.html?id=${product[i]._id}`;

            // Insertion de l'élément "article"
            let productArticle = document.createElement("article");
            productLink.appendChild(productArticle);

            // Insertion de l'image
            let productImg = document.createElement("img");
            productArticle.appendChild(productImg);
            productImg.src = product[i].imageUrl;
            productImg.alt = product[i].altTxt;

            // Insertion du titre "h3"
            let productName = document.createElement("h3");
            productArticle.appendChild(productName);
            productName.classList.add("productName");
            productName.innerHTML = product[i].name;
            
            // Insertion de la description "p"
            let productDescription = document.createElement("p");
            productArticle.appendChild(productDescription);
            productDescription.classList.add("productDescription");
            productDescription.innerHTML = product[i].description;
        }
    });
}