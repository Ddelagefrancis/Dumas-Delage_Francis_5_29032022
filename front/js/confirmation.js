const id = new URL(window.location.href).searchParams.get("id");
console.log(id);

// On récupère l'identifiant de commande et on l'affiche dans l'HTML
const orderId = document.getElementById('orderId');
orderId.innerHTML = id;

// On supprime le localstorage pour les prochaines commandes
localStorage.clear();