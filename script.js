//Arrondir le résultat pour ne pas avoir de chiffre à virgule à rallonge
//Raffraichir le résultat au changement de l'input (onchange et onkeyup)
//Vérifier les données (si < 0)
//Stocker en cookie le formulaire pour le remplir avec le dernier calcul
//Historique de calcul (seulement si click sur calculer)
//Imprimer la page ??
//Convertir en PDF ??
//Animation ??
//Envoyer en mail ??

function calculGain(){
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

  document.getElementById('resultat-brut').innerText = totalBrut + ' €'
  document.getElementById('resultat-taxes').innerText = chargeADeduire + ' €'
  document.getElementById('resultat-net').innerText = totalNet + ' €' 
  
}