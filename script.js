//Stocker en cookie le formulaire pour le remplir avec le dernier calcul
//Historique de calcul (seulement si click sur calculer)
//Imprimer la page ??
//Convertir en PDF ??
//Animation ??
//Envoyer en mail ??

function calculGain(){
  //On vérifie si l'input est bien >= 0
  checkInputs();

  //On récupère le formulaire dans le DOM
  let myForm = document.getElementById('form-calcul-gain');
  //On le transforme en objet FormData
  let formObj = new FormData(myForm);
  
  // On récupère les inputs de notre formulaire par leurs noms
  let tauxHoraire = formObj.get('TH')
  let tauxJournalier = formObj.get('TJM')
  let extras = formObj.get('Extras')

  let quantityTauxHoraire = formObj.get('quantity-TH')
  let quantityTauxJournalier = formObj.get('quantity-TJM')
  let quantityExtras = formObj.get('quantity-Extras')

  let charges = formObj.get('Charges')

  //On commence le calcul
  let gainHeure = tauxHoraire * quantityTauxHoraire;
  let gainJour = tauxJournalier * quantityTauxJournalier;
  let gainExtras = extras * quantityExtras;

  let totalBrut = gainHeure + gainJour + gainExtras;
  let chargeADeduire = (totalBrut * (charges / 100))
  let totalNet = totalBrut - chargeADeduire

  //Animer le résultat du Brut
  animateCompteur('resultat-brut', totalBrut)
  animateCompteur('resultat-taxes', chargeADeduire)
  animateCompteur('resultat-net', totalNet) 
  
}

async function animateCompteur(idARemplacer, total){
  let cpt = 0
  let animationDuration = 100
  let monElementHtmlDeResultat = document.getElementById(idARemplacer)


  if (monElementHtmlDeResultat.innerText != total.toFixed(2) + ' €'){
    let increment = Math.round(total / 10)
    if (increment == 0){
      increment = 1
    }
    while (cpt <= total){
      monElementHtmlDeResultat.innerText = cpt.toFixed(2) + ' €'
      await timer(animationDuration)
      cpt = cpt + increment
    }
    monElementHtmlDeResultat.innerText =total.toFixed(2) + ' €'
  }
}

function timer(ms){
  return new Promise(res => setTimeout(res, ms))
}

function checkInputs(){
  //Récupère tout les inputs
  let mesInputs = document.querySelectorAll('#form-calcul-gain input.form-control')
  //Pour chaque input, on vérifie si il est < 0 
  mesInputs.forEach(monInput => {
    //Vérifier si il vaut moins de 0
    if (monInput.value < 0){
      monInput.value = 0;
    }
    saveElementInCookies(monInput)
  });

}

function saveElementInCookies(input){
  document.cookie = input.name + '=' + input.value;
}

//Récupérer les cookies
function getCookie(input){
  let mesCookies = document.cookie;

  const name = input.name + '='
  const tableauCookies = mesCookies.split('; ')
  let valeurCookie = null

  //Pour chaque cookie du tableau: vérifier si on a le bon
  tableauCookies.forEach(cookie => {
    if (cookie.indexOf(name) === 0){
      //On a le bon cookie
      valeurCookie = cookie.substring(name.length)
    }
  })
  return valeurCookie
}

//Ajout des événements
let btn = document.getElementById('button-validation')
btn.addEventListener('click', calculGain)

//Récupère tout les inputs
let mesInputs = document.querySelectorAll('#form-calcul-gain input.form-control')

//Raffraichir le résultat au changement de l'input (onchange et onkeyup)
mesInputs.forEach(monInput => {
  //Si il a une valeur en cookie: lui donner
  let cookie = getCookie(monInput)

  if (cookie != undefined && cookie != null){
    monInput.value = cookie
  }

  monInput.addEventListener('change', calculGain)
  monInput.addEventListener('keyup', calculGain)
})
