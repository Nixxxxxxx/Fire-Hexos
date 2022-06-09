var importedCards = "";
var editCard = "";
var details = "";
var abilities = "";
var ability;

document.getElementById('file-input').addEventListener('change', readSingleFile, false);

document.getElementById('cardForm').style.visibility = "collapse";
document.getElementById('abilityForm').style.visibility = "collapse";
clearActiveContainer();

document.getElementById('tutorials').onclick = function () {
    clearActiveContainer();
    document.getElementById('tutorialContainer').style.visibility = "visible";
    document.getElementById('tutorials').className += " active";
};

document.getElementById('guild').onclick = function () {
    clearActiveContainer();
    document.getElementById('innerContainer').style.visibility = "visible";
    document.getElementById('guild').className += " active";
};

document.getElementById('ranking').onclick = function () {
    clearActiveContainer();
    document.getElementById('rankingContainer').style.visibility = "visible";
    document.getElementById('ranking').className += " active";
};

document.getElementById('news').onclick = function () {
    clearActiveContainer();
    document.getElementById('newsContainer').style.visibility = "visible";
    document.getElementById('news').className += " active";
};

function clearActiveContainer() {
    document.getElementById('innerContainer').style.visibility = "collapse";
    document.getElementById('tutorialContainer').style.visibility = "collapse";
    document.getElementById('rankingContainer').style.visibility = "collapse";
    document.getElementById('newsContainer').style.visibility = "collapse";

    document.getElementById('guild').className -= "active";
    document.getElementById('tutorials').className -= "active";
    document.getElementById('ranking').className -= "active";
    document.getElementById('news').className -= "active";
}


document.getElementById('innerContainer').style.visibility = "visible";
document.getElementById('guild').className += " active";

function LoadFromFirebase() {
    fetch('https://fire-hexos-default-rtdb.europe-west1.firebasedatabase.app/cards.json')
        .then(response => response.json())
        .then(data => processCards(data));
}



function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    document.getElementById('innerContainer').innerHTML = "";
    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;
        console.log(contents);
        processCards(JSON.parse(contents));
    };
    reader.readAsText(file);
}

function LoadEdited() {
    document.getElementById('innerContainer').innerHTML = "";
    processCards(importedCards);
}


function processCards(cards) {
    importedCards = cards;
    var arrayLength = cards.length;
    for (var i = 0; i < arrayLength; i++) {
        //console.log(cards[i].name);
        insertCard(cards[i])
    }


}

function insertCard(card) {
    var cardDiv = document.createElement('div');
    cardDiv.className += "col-md-2 ";


    var div = document.createElement('div');
    div.className += "customCard ";

    var img = document.createElement('img');
    img.src = card.imageUrl;
    var button = document.createElement('button');
    button.innerHTML = card.name;

    button.onclick = function () {
        loadingCardForm(card);
    };

    div.appendChild(img);
    div.appendChild(button);



    var infoDiv = document.createElement('p');
    infoDiv.className = "infoCard";
    infoDiv.innerText = "$:" + card.cost + "-Atk:" + card.atk + "-Def:" + card.def + " " + card.job + "-" + card.race + "-" + card.animationType + "- $$" + card.gold;

    div.appendChild(infoDiv);

    cardDiv.appendChild(div);
    document.getElementById('innerContainer').appendChild(cardDiv);

}

function loadingCardForm(card) {
    console.log(card.name);
    editCard = card;

    toggleCardFormVisibility();
    document.getElementById('card-image').src = editCard.imageUrl;
    document.getElementById('card-name').value = editCard.name;
    document.getElementById('card-atk').value = editCard.atk;
    document.getElementById('card-def').value = editCard.def;
    document.getElementById('card-cost').value = editCard.cost;
    document.getElementById('card-gold').value = editCard.gold;
    //document.getElementById('card-description').innerText = card.description;
    //try {
    //    var editor = new Jodit('#editor');
    //    editor.value = card.description;
    //} catch (error) {
    document.getElementById('editor').value = editCard.description;
    //}


    document.getElementById('card-job').value = card.job;
    document.getElementById('card-rarity').value = card.rarity;
    document.getElementById('card-race').value = card.race;
    document.getElementById('card-animationType').value = card.animationType;

    var skillsBtnContainer = document.getElementById('skill-btns');
    while (skillsBtnContainer.lastElementChild) {
        skillsBtnContainer.removeChild(skillsBtnContainer.lastElementChild);
    }

    if (typeof editCard.abilities !== 'undefined') {
        for (const element of editCard.abilities) {
            var abilityContainer = document.createElement('div');
            abilityContainer.className += "customAbilityCard ";

            var button = document.createElement('button');
            button.innerHTML = "<b>" + element.name + "</b>";
            button.className += " ability-btn";
            button.onclick = function () {
                loadingSkillForm(element);
            };

            var p = document.createElement('p');
            p.innerText = JSON.stringify(element);

            abilityContainer.appendChild(p);
            abilityContainer.appendChild(button);
            skillsBtnContainer.appendChild(abilityContainer);
        }
    }



}

function GetSkill() {
    document.getElementById('ability-card-image').src = editCard.imageUrl;
    document.getElementById('skill-name').value = "Skill Name";
    document.getElementById('skill-description').value = "Skill description";
    document.getElementById('skill-atk-bonus').value = 0;
    document.getElementById('skill-def-bonus').value = 0;
    document.getElementById('skill-cost-bonus').value = 0;
    document.getElementById('skill-gold-bonus').value = 0;
    abilities = new Array();
    details = new Map();
    document.getElementById('sourceDetailsInfo').innerHTML = "";
}

function loadingSkillForm(skill) {
    abilities = editCard.abilities;
    details = new Map();
    toggleSkillFormVisibility();
    document.getElementById('ability-card-image').src = editCard.imageUrl;
    document.getElementById('skill-name').value = skill.name;
    document.getElementById('skill-action').value = skill.actionType;
    document.getElementById('skill-description').value = skill.description;
    document.getElementById('skill-atk-bonus').value = skill.atk;
    document.getElementById('skill-def-bonus').value = skill.def;
    document.getElementById('skill-cost-bonus').value = skill.cost;
    document.getElementById('skill-gold-bonus').value = skill.gold;

    document.getElementById('skill-job').value = skill.job;
    document.getElementById('skill-trigger').value = skill.triggerType;
    document.getElementById('has-silence').checked = skill.silence;

    document.getElementById('skill-target').value = skill.targets.target;

    document.getElementById('skill-source').value = skill.sources.target;
    details = skill.sources.details;

    //document.getElementById('update-current-skill').setAttribute('onclick', 'updateCurrentAbility( " ' + skill + ' " )');
}



function exportCardsAsJson() {
    var myJsonString = JSON.stringify(importedCards);
    var bb = new Blob([myJsonString], { type: 'text/plain' });
    var a = document.createElement('a');
    a.download = 'fire_hexos_cards.json';
    a.href = window.URL.createObjectURL(bb);
    a.click();
}

function toggleSkillFormVisibility() {
    console.log("toggling ability");
    var x = document.getElementById('abilityForm');
    if (x.style.visibility === 'collapse') {
        x.style.visibility = 'visible';
        GetSkill();
    } else {
        x.style.visibility = 'collapse';
    }
}

function toggleCardFormVisibility() {
    var x = document.getElementById('cardForm');
    if (x.style.visibility === 'collapse') {
        x.style.visibility = 'visible';
    } else {
        x.style.visibility = 'collapse';
    }
    LoadEdited();
}

function saveTemporaryChanges() {
    editCard.name = document.getElementById('card-name').value;
    editCard.atk = new Number(document.getElementById('card-atk').value);
    editCard.def = new Number(document.getElementById('card-def').value);
    editCard.cost = new Number(document.getElementById('card-cost').value);
    editCard.gold = new Number(document.getElementById('card-gold').value);

    editCard.description = editor.value;

    editCard.job = document.getElementById('card-job').value;
    editCard.rarity = document.getElementById('card-rarity').value;
    editCard.race = document.getElementById('card-race').value;
    editCard.animationType = document.getElementById('card-animationType').value;
}

function addDetailToSkill() {
    var sourceCategory = document.getElementById('skill-source-category').value;
    var sourceCategoryDetail = document.getElementById('skill-source-category-detail').value;
    details.set(sourceCategory, sourceCategoryDetail);
}

function updateCurrentAbility(ability2) {
    ability2.actionType = document.getElementById('skill-action').value;
    ability2.atk = new Number(document.getElementById('skill-atk-bonus').value);
    ability2.cost = new Number(document.getElementById('skill-cost-bonus').value);
    ability2.def = new Number(document.getElementById('skill-def-bonus').value);
    ability2.description = document.getElementById('skill-description').value;
    ability2.gold = new Number(document.getElementById('skill-gold-bonus').value);
    ability2.job = document.getElementById('skill-job').value;
    ability2.loop = 1;
    ability2.name = document.getElementById('skill-name').value;
    ability2.range = new Number(document.getElementById('skill-range').value);
    ability2.triggerType = document.getElementById('skill-trigger').value;
    ability2.silence = document.getElementById('has-silence').checked;
    var targets = new Object();
    targets.target = document.getElementById('skill-target').value;
    ability2.targets = targets;

    var sources = new Object();
    sources.target = document.getElementById('skill-source').value;

    if (details.size > 0) {
        console.log("Details were added");
        sources.details = Object.fromEntries(details);
    }

    ability2.sources = sources;

    var abilityInfo = ""

    for (let i = 0; i < abilities.length; i++) {
        var a = abilities[i];
        abilityInfo = (abilityInfo + "<br>" + a.name + "::=>" + JSON.stringify(a.sources.details));
    }


    document.getElementById('sourceDetailsInfo').innerHTML = abilityInfo;
    details = new Map();
}

function updateAbility() {
    ability = new Object();
    ability.actionType = document.getElementById('skill-action').value;
    ability.atk = new Number(document.getElementById('skill-atk-bonus').value);
    ability.cost = new Number(document.getElementById('skill-cost-bonus').value);
    ability.def = new Number(document.getElementById('skill-def-bonus').value);
    ability.description = document.getElementById('skill-description').value;
    ability.gold = new Number(document.getElementById('skill-gold-bonus').value);
    ability.job = document.getElementById('skill-job').value;
    ability.loop = 1;
    ability.name = document.getElementById('skill-name').value;
    ability.range = new Number(document.getElementById('skill-range').value);;
    ability.triggerType = document.getElementById('skill-trigger').value;
    ability.changeRaceTo = document.getElementById('skill-race').value;
    ability.animationType = document.getElementById('skill-animation').value;
    ability.silence = document.getElementById('has-silence').checked;
    ability.hasAttachment = document.getElementById('has-attachment').checked;
    var targets = new Object();
    targets.target = document.getElementById('skill-target').value;
    ability.targets = targets;

    var sources = new Object();
    sources.target = document.getElementById('skill-source').value;

    if (details.size > 0) {
        console.log("Details were added");
        sources.details = Object.fromEntries(details);
    }


    ability.sources = sources;

    abilities.push(ability);
    editCard.abilities = abilities;

    var abilityInfo = ""

    for (let i = 0; i < abilities.length; i++) {
        var a = abilities[i];
        abilityInfo = (abilityInfo + "<br>" + a.name + "::=>" + JSON.stringify(a.sources.details));
    }


    document.getElementById('sourceDetailsInfo').innerHTML = abilityInfo;
    details = new Map();
}

function addChildAbility() {
    child = new Object();
    child.actionType = document.getElementById('skill-action').value;
    child.atk = new Number(document.getElementById('skill-atk-bonus').value);
    child.cost = new Number(document.getElementById('skill-cost-bonus').value);
    child.def = new Number(document.getElementById('skill-def-bonus').value);
    child.description = document.getElementById('skill-description').value;
    child.gold = new Number(document.getElementById('skill-gold-bonus').value);
    child.job = document.getElementById('skill-job').value;
    child.loop = 1;
    child.name = document.getElementById('skill-name').value;
    child.range = new Number(document.getElementById('skill-range').value);;
    child.triggerType = document.getElementById('skill-trigger').value;
    child.changeRaceTo = document.getElementById('skill-race').value;
    child.animationType = document.getElementById('skill-animation').value;
    child.silence = document.getElementById('has-silence').checked;
    var targets = new Object();
    targets.target = document.getElementById('skill-target').value;
    child.targets = targets;

    var sources = new Object();
    sources.target = document.getElementById('skill-source').value;

    if (details.size > 0) {
        console.log("Details were added");
        sources.details = Object.fromEntries(details);
    }


    child.sources = sources;
    ability.child = child;
    //abilities.push(ability);
    //editCard.abilities = abilities;


    var abilityInfo = ""

    for (let i = 0; i < abilities.length; i++) {
        var a = abilities[i];
        abilityInfo = (abilityInfo + "<br>" + a.name + "::=>" + JSON.stringify(a.sources.details));
    }


    var info = document.getElementById('sourceDetailsInfo');
    document.getElementById('sourceDetailsInfo').innerHTML = info.textContent + "<br>" + abilityInfo;
    details = new Map();
}

