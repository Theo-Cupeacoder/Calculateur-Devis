//Stocker en cookie le formulaire pour le remplir avec le dernier calcul
//Historique de calcul (seulement si click sur calculer)
//Imprimer la page ??
//Convertir en PDF ??
//Animation ??
//Envoyer en mail ??

// Trajet -> Temps Trajet | Tarif Energie | Nombre Km
// Service -> Temps sur place | Volume 
// Autres -> Taux promotion | Taux de charges

function calculGain(){
  //On vérifie si l'input est bien >= 0
  checkInputs();

  //On récupère le formulaire dans le DOM
  let myForm = document.getElementById('form-calcul-gain');
  //On le transforme en objet FormData
  let formObj = new FormData(myForm);
  
  // On récupère les inputs de notre formulaire par leurs noms
  let tempsTrajet = formObj.get('tTrajet')
  let tarifEnergie = formObj.get('tEnergie')
  let nbKilometre = formObj.get('nbKilometre')

  let tempsSurPlace = formObj.get('tSurPlace')
  let volume = formObj.get('volume')

  let tauxPromotion = formObj.get('tPromotion')
  let charges = formObj.get('charges')

  // Varibles de base
      // Assurance (720€ / 50000km) + Entretien(1500€/100000km) 
  let entretienCamion = (720 / 50000) + (1500/100000)
    // Consommation par kilomètre
  let consommationEnergie = (tarifEnergie / 12.5) + entretienCamion
    // Taux horraire / 1 heure
  let tauxMinute = 15 / 60

  //On commence le calcul



  let tarifTravail = (tempsTrajet * tauxMinute) + (tempsSurPlace * tauxMinute);
  let tarifConsommation = consommationEnergie * nbKilometre;

  let totalTTC = (tarifTravail + tarifConsommation)
  let promotion = totalTTC * (tauxPromotion / 100)
  totalTTC -= promotion
  let chargesAInclure = (totalTTC * (charges / 100))
  totalTTC += chargesAInclure
  let totalHT = totalTTC - chargesAInclure

  //Animer le résultat
  animateCompteur('resultat-promotion', promotion)
  animateCompteur('resultat-taxes', chargesAInclure)
  animateCompteur('resultat-TTC', totalTTC)
  animateCompteur('resultat-HT', totalHT) 
  
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
