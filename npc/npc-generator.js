let roll;
let level;
let determiner;
let suffix;
let proficiencyBonus;
let raceRoll;
let race;
let subraceRoll;
let subrace;
let characterName;
let size;
let speed;
let racialFeat;
let resistances;
let languages;
let hasDarkvision;
let isSpellcaster;
let str;
let dex;
let con;
let int;
let wis;
let cha;
let strMod;
let dexMod;
let conMod;
let intMod;
let wisMod;
let chaMod;
let armorType;
let armorWeight;
let armorClass;
let strReq;
let stealthDis;
let baseAC;
let isOverencumbered;
let baseHP;
let conBonus;
let hitPoints;
let proficiencyRoll1;
let proficiency1;
let proficiencyRoll2;
let proficiency2;
let skillRoll1;
let skill1;
let skill1Mod;
let skillRoll2;
let skill2;
let skill2Mod;
let save1;
let save2;
let passivePerception;
let spellRoll1;
let spell1;
let spellRoll2;
let spell2;
let spellRoll3;
let spell3;
let spellRoll4;
let spell4;
let spellRoll5;
let spell5;
let cantrip1;
let cantrip2;
let cantrip3;
let cantrip4;
let cantrip5;
let firstLevel1;
let firstLevel2;
let firstLevel3;
let firstLevel4;
let secondLevel1;
let secondLevel2;
let secondLevel3;
let thirdLevel1;
let thirdLevel2;
let thirdLevel3;
let fourthLevel1;
let fourthLevel2;
let fourthLevel3;
let fifthLevel1;
let fifthLevel2;
let sixthLevel;
let seventhLevel;
let eigthLevel;
let ninthLevel;
let spellcastingAbility;
let spellSaveDC;
let spellToHit;
let spellcasting;
let spells;
let hasMagicResistance;
let hasFeat;
let feat;
let weaponProficiency;
let toHit;
let meleeWeapon;
let reach;
let meleeDamageDice;
let meleeDamageType;
let isThrowable;
let thrownRange;
let isVersatile;
let versatileDamageDice;
let isTwoHanded;
let rangedWeapon;
let range;
let rangedDamageDice;
let rangedDamageType;
let meleeAction;
let rangedAction;
let savingThrow;
let hasShield;
let sneakAttackDamageDice;
let hasInitiative;
let isCooperative;
let hasMultiattack;
let hasReaction;
let reaction;
let statblockActive;

const prompt = document.getElementById('prompt');
const statblock = document.getElementById('statblock');
const npcName = document.getElementById('npc-name');
const description = document.getElementById('description');
const ac = document.getElementById('ac');
const hp = document.getElementById('hp');
const movement = document.getElementById('movement');
const strStats = document.getElementById('str-stats');
const dexStats = document.getElementById('dex-stats');
const conStats = document.getElementById('con-stats');
const intStats = document.getElementById('int-stats');
const wisStats = document.getElementById('wis-stats');
const chaStats = document.getElementById('cha-stats');
const savingThrows = document.getElementById('saving-throws');
const skills = document.getElementById('skills');
const dmgResistance = document.getElementById('dmg-resistance');
const senses = document.getElementById('senses');
const lang = document.getElementById('lang');
const profBonus = document.getElementById('prof-bonus');
const featSection = document.getElementById('feat-section');
const racialFeature = document.getElementById('racial-feature');
const stealthDisadvantage = document.getElementById('stealth-disadvantage');
const overEncumbered = document.getElementById('over-encumbered');
const bonusFeature = document.getElementById('bonus-feature');
const magicResistance = document.getElementById('magic-resistance');
const spellcastingFeature = document.getElementById('spellcasting-feature');
const spellList = document.getElementById('spell-list');
const multiattack = document.getElementById('multiattack');
const meleeAttack = document.getElementById('melee-attack');
const rangedAttack = document.getElementById('ranged-attack');
const reactionSection = document.getElementById('reaction-section');
const moveReaction = document.getElementById('move-reaction');
const commonerRadio = document.getElementById('commoner');
const adventurerRadio = document.getElementById('adventurer');
const heroRadio = document.getElementById('hero');
const legendRadio = document.getElementById('legend');
const rollButton = document.getElementById('roll-btn');

const rollD20 = () => {
    return Math.ceil(Math.random() * 20);
};

const rollMultiple = (numRolls, diceValue) => {
    let total = 0;

    for (let timesRolled = 0; timesRolled < numRolls; timesRolled++) {
        return total += Math.ceil(Math.random() * diceValue);
    };
};

const rollNPC = () => {
    const rollLevel = () => {
        // Get NPC level
        if (commonerRadio.checked) {
            roll = Math.ceil(Math.random() * 4);
        } else if (adventurerRadio.checked) {
            roll = Math.ceil(Math.random() * 6) + 4;
        } else if (heroRadio.checked) {
            roll = Math.ceil(Math.random() * 6) + 10;
        } else if (legendRadio.checked) {
            roll = Math.ceil(Math.random() * 4) + 16;
        };

        level = roll;
    };
    
    rollLevel();

    if (level == 8 || level == 11 || level == 18) {
        determiner = "an";
    } else {
        determiner = "a";
    };

    if (level == 1) {
        suffix = 'st';
    } else if (level == 2) {
        suffix = 'nd';
    } else if (level == 3) {
        suffix = 'rd';
    } else {
        suffix = 'th';
    };

    // Get proficiency bonus
    const getProficiencyBonus = () => {
        if (level <= 4) {
            proficiencyBonus = 2;
        } else if (level <= 8) {
            proficiencyBonus = 3
        } else if (level <= 12) {
            proficiencyBonus = 4
        } else if (level <= 16) {
            return proficiencyBonus = 5
        } else {
            proficiencyBonus = 6;
        };
    };

    getProficiencyBonus();

    // Get name, race and racial traits
    const getRace = () => {
        raceRoll = Math.floor(Math.random() * races.length);
        race = races[raceRoll][0];

        const getSubrace = () => {
            subraceRoll = Math.floor(Math.random() * races[raceRoll][1].length);
            subrace = races[raceRoll][1][subraceRoll];
        };

        getSubrace();

        if (!subrace) {
            subrace = race;
        };

        const getName = (array) => {
            roll = Math.floor(Math.random() * array.length);
            characterName = array[roll];
        };

        if (race == 'Dragonborn') {
            getName(dragonbornNames);
        };

        if (race == 'Dwarf') {
            getName(dwarfNames);
        };

        if (race == 'Elf' || race == 'Half-Elf') {
            getName(elfNames);
        };

        if (race == 'Gnome') {
            getName(gnomeNames);
        };

        if (race == 'Halfling') {
            getName(halflingNames);
        };

        if (race == 'Human') {
            getName(humanNames);
        };

        if (race == 'Half-Orc') {
            getName(orcNames);
        };

        if (race == 'Tiefling') {
            getName(tieflingNames);
        };
        
        size = races[raceRoll][2];
        speed = races[raceRoll][3];
        racialFeat = races[raceRoll][4];
        resistances = races[raceRoll][5];
        languages = races[raceRoll][6];
        hasDarkvision = races[raceRoll][7];
    };

    getRace();

    // Get ability scores
    const rollScore = () => {
        roll = rollD20();
    
        if (roll < 8) {
            return 8;
        } else {
            return roll;
        };
    };

    str = rollScore();
    dex = rollScore();
    con = rollScore();
    int = rollScore();
    wis = rollScore();
    cha = rollScore();

    // Get ability score modifiers
    const getModifier = (stat) => {
        if (stat <= 9) {
            return '-1';
        } else if (stat <= 11) {
            return '+0';
        } else if (stat <= 13) {
            return '+1';
        } else if (stat <= 15) {
            return '+2';
        } else if (stat <= 17) {
            return '+3';
        } else if (stat <= 19) {
            return '+4';
        } else {
            return '+5';
        };
    };

    strMod = getModifier(str);
    dexMod = getModifier(dex);
    conMod = getModifier(con);
    intMod = getModifier(int);
    wisMod = getModifier(wis);
    chaMod = getModifier(cha);

    // Get armor class and armor specifications
    const getArmor = () => {
        const dexMax = () => {
            if (+dexMod > 2) {
                return 2;
            } else {
                return +dexMod;
            };
        };

        const armorArray = [
            //[armorType, armorWeight, armorClass, strReq, stealthDisadvantage]
            ['Padded', 'Light', 11 + +dexMod, 0, true],
            ['Leather', 'Light', 11 + +dexMod, 0, false],
            ['Studded Leather', 'Light', 12 + +dexMod, 0, false],
            ['Hide', 'Medium', 12 + dexMax(), 0, false],
            ['Chain Shirt', 'Medium', 13 + dexMax(), 0, false],
            ['Scale Mail', 'Medium', 14 + dexMax(), 0, true],
            ['Breastplate', 'Medium', 14 + dexMax(), 0, false],
            ['Half Plate', 'Medium', 15 + dexMax(), 0, true],
            ['Ring Mail', 'Heavy', 14, 0, true],
            ['Chain Mail', 'Heavy', 16, 13, true],
            ['Splint', 'Heavy', 17, 15, true],
            ['Plate', 'Heavy', 18, 15, true]
        ];

        const rollArmor = () => {
            roll = Math.floor(Math.random() * armorArray.length);
        };

        rollArmor();

        armorType = armorArray[roll][0];
        armorWeight = armorArray[roll][1]
        armorClass = armorArray[roll][2];
        strReq = armorArray[roll][3];
        stealthDis = armorArray[roll][4];
        baseAC = armorClass;

        if (str < strReq) {
            isOverencumbered = true;
        };
    };
    
    getArmor();

    // Get hit points
    const getHealth = () => {
        baseHP = 8 + (rollMultiple(1, 8) * (level - 1));
        conBonus = +conMod * level;
        hitPoints = baseHP + conBonus;
    };

    getHealth();

    // Get proficiencies, skills and saving throws
    const getAbilities = () => {
        const rollAbilities = () => {
            const rollProficiencies = () => {
                proficiencyRoll1 = Math.floor(Math.random() * proficiencies.length);
                proficiencyRoll2 = Math.floor(Math.random() * proficiencies.length);
            };

            do {
                rollProficiencies();
            } while (proficiencyRoll1 == proficiencyRoll2);

            proficiency1 = proficiencies[proficiencyRoll1][0];
            proficiency2 = proficiencies[proficiencyRoll2][0];

            const rollSkills = (var1, var2) => {
                skillRoll1 = Math.floor(Math.random() * proficiencies[var1][1].length);
                skillRoll2 = Math.floor(Math.random() * proficiencies[var2][1].length);

                skill1 = proficiencies[var1][1][skillRoll1];
                skill2 = proficiencies[var2][1][skillRoll2];
            }

            if ((proficiency1 == 'Strength' && proficiency2 == 'Constitution') || (proficiency1 == 'Constitution' && proficiency2 == 'Strength')) {
                skill1 = 'Athletics';
                skill1Mod = +strMod + proficiencyBonus;
            } else if (proficiency1 == 'Constitution') {
                do {
                    rollSkills(proficiencyRoll2, proficiencyRoll2)
                } while (proficiency1 == proficiency2);
            } else if (proficiency2 == 'Constitution') {
                do {
                    rollSkills(proficiencyRoll1, proficiencyRoll1)
                } while (proficiency1 == proficiency2);
            } else {
                rollSkills(proficiencyRoll1, proficiencyRoll2);
            };

            switch (proficiency1) {
                case 'Strength': skill1Mod = +strMod + proficiencyBonus;
                break;
                case 'Dexterity': skill1Mod = +dexMod + proficiencyBonus;
                break;
                case 'Intelligence': skill1Mod = +intMod + proficiencyBonus;
                break;
                case 'Wisdom': skill1Mod = +wisMod + proficiencyBonus;
                break;
                case 'Charisma': skill1Mod = +chaMod + proficiencyBonus;
                break;
            };
        
            switch (proficiency2) {
                case 'Strength': skill2Mod = +strMod + proficiencyBonus;
                break;
                case 'Dexterity': skill2Mod = +dexMod + proficiencyBonus;
                break;
                case 'Intelligence': skill2Mod = +intMod + proficiencyBonus;
                break;
                case 'Wisdom': skill2Mod = +wisMod + proficiencyBonus;
                break;
                case 'Charisma': skill2Mod = +chaMod + proficiencyBonus;
                break;
            };

            if (proficiency1 == 'Constitution') {
                skill1Mod = skill2Mod;
            } else if (proficiency2 == 'Constitution') {
                skill2Mod = skill1Mod;
            };
        };

        rollAbilities();
    };

    getAbilities();

    // Get saving throws
    switch (proficiency1) {
        case 'Strength': save1 = `STR +${+strMod + proficiencyBonus}`;
        break;
        case 'Dexterity': save1 = `DEX +${+dexMod + proficiencyBonus}`;
        break;
        case 'Constitution': save1 = `CON +${+conMod + proficiencyBonus}`;
        break;
        case 'Intelligence': save1 = `INT +${+intMod + proficiencyBonus}`;
        break;
        case 'Wisdom': save1 = `WIS +${+wisMod + proficiencyBonus}`;
        break;
        case 'Charisma': save1 = `CHA +${+chaMod + proficiencyBonus}`;
        break;
    };

    switch (proficiency2) {
        case 'Strength': save2 = `STR +${+strMod + proficiencyBonus}`;
        break;
        case 'Dexterity': save2 = `DEX +${+dexMod + proficiencyBonus}`;
        break;
        case 'Constitution': save2 = `CON +${+conMod + proficiencyBonus}`;
        break;
        case 'Intelligence': save2 = `INT +${+intMod + proficiencyBonus}`;
        break;
        case 'Wisdom': save2 = `WIS +${+wisMod + proficiencyBonus}`;
        break;
        case 'Charisma': save2 = `CHA +${+chaMod + proficiencyBonus}`;
        break;
    };

    // Get passive perception
    if (skill1 == 'Perception' || skill2 == 'Perception') {
        passivePerception = 10 + +wisMod + proficiencyBonus;
    } else {
        passivePerception = 10 + +wisMod;
    };

    // Get spellcasting ability
    const getSpellcasting = () => {
        if (Math.round(Math.random()) == 1) {
            isSpellcaster = true
        } else {
            isSpellcaster = false;
        };
    };

    getSpellcasting()

    // Get spell list and magic resistance status
    if (isSpellcaster) {
        const getSpells = (spellArray) => {
            do {
                spellRoll1 = Math.floor(Math.random() * spellArray.length);
                spellRoll2 = Math.floor(Math.random() * spellArray.length);
                spellRoll3 = Math.floor(Math.random() * spellArray.length);
                spellRoll4 = Math.floor(Math.random() * spellArray.length);
                spellRoll5 = Math.floor(Math.random() * spellArray.length);
            } while (
                spellRoll1 == spellRoll2 ||
                spellRoll1 == spellRoll3 ||
                spellRoll1 == spellRoll4 ||
                spellRoll1 == spellRoll5 ||
                spellRoll2 == spellRoll3 ||
                spellRoll2 == spellRoll4 ||
                spellRoll2 == spellRoll5 ||
                spellRoll3 == spellRoll4 ||
                spellRoll3 == spellRoll5 ||
                spellRoll4 == spellRoll5
            );

            spell1 = spellArray[spellRoll1];
            spell2 = spellArray[spellRoll2];
            spell3 = spellArray[spellRoll3];
            spell4 = spellArray[spellRoll4];
            spell5 = spellArray[spellRoll5];
        };

        const getCantrips = () => {
            getSpells(cantrips);

            cantrip1 = spell1;
            cantrip2 = spell2;
            cantrip3 = spell3;
            cantrip4 = spell4;
            cantrip5 = spell5;
        };

        getCantrips();

        const get1stLevelSpells = () => {
            getSpells(spells1st);

            firstLevel1 = spell1;
            firstLevel2 = spell2;
            firstLevel3 = spell3;
            firstLevel4 = spell4;
        };

        get1stLevelSpells();

        const get2ndLevelSpells = () => {
            getSpells(spells2nd);

            secondLevel1 = spell1;
            secondLevel2 = spell2;
            secondLevel3 = spell3
        };

        get2ndLevelSpells();

        const get3rdLevelSpells = () => {
            getSpells(spells3rd);

            thirdLevel1 = spell1;
            thirdLevel2 = spell2;
            thirdLevel3 = spell3;
        };

        get3rdLevelSpells();

        const get4thLevelSpell = () => {
            getSpells(spells4th);

            fourthLevel1 = spell1;
            fourthLevel2 = spell2;
            fourthLevel3 = spell3;
        };

        get4thLevelSpell();

        const get5thLevelSpells = () => {
            getSpells(spells5th);

            fifthLevel1 = spell1;
            fifthLevel2 = spell2;
        };

        get5thLevelSpells();

        const get6thLevelSpells = () => {
            getSpells(spells6th);

            sixthLevel = spell1;
        };

        get6thLevelSpells();

        const get7thLevelSpells = () => {
            getSpells(spells7th);

            seventhLevel = spell1;
        };

        get7thLevelSpells();

        const get8thLevelSpells = () => {
            getSpells(spells8th);

            eigthLevel = spell1;
        };

        get8thLevelSpells();

        const get9thLevelSpells = () => {
            getSpells(spells9th);

            ninthLevel = spell1;
        };

        get9thLevelSpells();

        if (race == 'Tiefling') {
            cantrip1 = '<a href="https://www.dndbeyond.com/spells/thaumaturgy" target="_blank">Thaumaturgy</a>';
            firstLevel1 = '<a href="https://www.dndbeyond.com/spells/hellish-rebuke" target="_blank">Hellish Rebuke</a>';
            secondLevel1 = '<a href="https://www.dndbeyond.com/spells/darkness" target="_blank">Darkness</a>';
        };

        const getSpellSaveDC = (spellcastingAbilityModifier) => {
            return 8 + spellcastingAbilityModifier + proficiencyBonus;
        };

        const getSpellToHit = (spellcastingAbilityModifier) => {
            return spellcastingAbilityModifier + proficiencyBonus;
        };

        if (race == 'Gnome') {
            spellcastingAbility = 'Intelligence';
            spellSaveDC = getSpellSaveDC(+intMod);
            spellToHit = getSpellToHit(+intMod);
        } else if (race == 'Dragonborn' || race == 'Half-Elf' || race =='Tiefling') {
            spellcastingAbility = 'Charisma';
            spellSaveDC = getSpellSaveDC(+chaMod);
            spellToHit = getSpellToHit(+chaMod);
        } else {
            spellcastingAbility = 'Wisdom';
            spellSaveDC = getSpellSaveDC(+wisMod);
            spellToHit = getSpellToHit(+wisMod);
        };

        spellcasting = `<strong>Spellcasting.</strong> The ${race} is ${determiner} ${level}${suffix}-level spellcaster. Its spellcasting ability is ${spellcastingAbility} (spell save DC ${spellSaveDC}, +${spellToHit} to hit with spell attacks). They have the following spells prepared:`;

        if (level == 1) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}</p><p>1st level (2 slots): ${firstLevel1}</p>`;
        } else if (level == 2) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}</p><p>1st level (3 slots): ${firstLevel1}</p>`;
        } else if (level == 3) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}</p><p>2nd level (2 slots): ${secondLevel1}</p>`;
        } else if (level == 4) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}, ${cantrip4}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}, ${firstLevel2}</p><p>2nd level (3 slots): ${secondLevel1}</p>`;
        } else if (level == 5) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}, ${cantrip4}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}, ${firstLevel2}</p><p class="break-sm">2nd level (3 slots): ${secondLevel1}</p><p>3rd level (2 slots): ${thirdLevel1}</p>`;
        } else if (level == 6) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}, ${cantrip4}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}, ${firstLevel2}</p><p class="break-sm">2nd level (3 slots): ${secondLevel1}, ${secondLevel2}</p><p>3rd level (3 slots): ${thirdLevel1}</p>`;
        } else if (level == 7) {
            spells = `<p class="break-smp">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}, ${cantrip4}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}, ${firstLevel2}</p><p class="break-sm">2nd level (3 slots): ${secondLevel1}, ${secondLevel2}</p><p class="break-sm">3rd level (3 slots): ${thirdLevel1}</p><p>4th level (1 slot): ${fourthLevel1}</p>`;
        } else if (level == 8) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}, ${cantrip4}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}, ${firstLevel2}, ${firstLevel3}</p><p class="break-sm">2nd level (3 slots): ${secondLevel1}, ${secondLevel2}</p><p class="break-sm">3rd level (3 slots): ${thirdLevel1}</p><p>4th level (2 slots): ${fourthLevel1}</p>`;
        } else if (level == 9) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}, ${cantrip4}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}, ${firstLevel2}, ${firstLevel3}</p><p class="break-sm">2nd level (3 slots): ${secondLevel1}, ${secondLevel2}</p><p class="break-sm">3rd level (3 slots): ${thirdLevel1}</p><p class="break-sm"><p>4th level (3 slots): ${fourthLevel1}</p>5th level (1 slot): ${fifthLevel1}</p>`;
        } else if (level == 10) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}, ${cantrip4}, ${cantrip5}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}, ${firstLevel2}, ${firstLevel3}</p><p class="break-sm">2nd level (3 slots): ${secondLevel1}, ${secondLevel2}</p><p class="break-sm">3rd level (3 slots): ${thirdLevel1}, ${thirdLevel2}</p><p class="break-sm">4th level (3 slots): ${fourthLevel1}</p><p>5th level (2 slots): ${fifthLevel1}</p>`;
        } else if (level == 11) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}, ${cantrip4}, ${cantrip5}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}, ${firstLevel2}, ${firstLevel3}</p><p class="break-sm">2nd level (3 slots): ${secondLevel1}, ${secondLevel2}</p><p class="break-sm">3rd level (3 slots): ${thirdLevel1}, ${thirdLevel2}</p><p class="break-sm">4th level (3 slots): ${fourthLevel1}</p><p class="break-sm">5th level (2 slots): ${fifthLevel1}</p><p>6th level (1 slot): ${sixthLevel}</p>`;
        } else if (level == 12) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}, ${cantrip4}, ${cantrip5}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}, ${firstLevel2}, ${firstLevel3}, ${firstLevel4}</p><p class="break-sm">2nd level (3 slots): ${secondLevel1}, ${secondLevel2}</p><p class="break-sm">3rd level (3 slots): ${thirdLevel1}, ${thirdLevel2}</p><p class="break-sm">4th level (3 slots): ${fourthLevel1}</p><p class="break-sm">5th level (2 slots): ${fifthLevel1}</p><p>6th level (1 slot): ${sixthLevel}</p>`;
        } else if (level == 13) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}, ${cantrip4}, ${cantrip5}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}, ${firstLevel2}, ${firstLevel3}, ${firstLevel4}</p><p class="break-sm">2nd level (3 slots): ${secondLevel1}, ${secondLevel2}</p><p class="break-sm">3rd level (3 slots): ${thirdLevel1}, ${thirdLevel2}</p><p class="break-sm">4th level (3 slots): ${fourthLevel1}</p><p class="break-sm">5th level (2 slots): ${fifthLevel1}</p><p class="break-sm">6th level (1 slot): ${sixthLevel}</p><p>7th level (1 slot): ${seventhLevel}</p>`;
        } else if (level == 14) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}, ${cantrip4}, ${cantrip5}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}, ${firstLevel2}, ${firstLevel3}, ${firstLevel4}</p><p class="break-sm">2nd level (3 slots): ${secondLevel1}, ${secondLevel2}, ${secondLevel3}</p><p class="break-sm">3rd level (3 slots): ${thirdLevel1}, ${thirdLevel2}</p><p class="break-sm">4th level (3 slots): ${fourthLevel1}</p><p class="break-sm">5th level (2 slots): ${fifthLevel1}</p><p class="break-sm">6th level (1 slot): ${sixthLevel}</p><p>7th level (1 slot): ${seventhLevel}</p>`;
        } else if (level == 15) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}, ${cantrip4}, ${cantrip5}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}, ${firstLevel2}, ${firstLevel3}, ${firstLevel4}</p><p class="break-sm">2nd level (3 slots): ${secondLevel1}, ${secondLevel2}, ${secondLevel3}</p><p class="break-sm">3rd level (3 slots): ${thirdLevel1}, ${thirdLevel2}</p><p class="break-sm">4th level (3 slots): ${fourthLevel1}</p><p class="break-sm">5th level (2 slots): ${fifthLevel1}</p><p class="break-sm">6th level (1 slot): ${sixthLevel}</p><p class="break-sm"><p>7th level (1 slot): ${seventhLevel}</p>8th level (1 slot): ${eigthLevel}</p>`;
        } else if (level == 16) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}, ${cantrip4}, ${cantrip5}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}, ${firstLevel2}, ${firstLevel3}, ${firstLevel4}</p><p class="break-sm">2nd level (3 slots): ${secondLevel1}, ${secondLevel2}, ${secondLevel3}</p><p class="break-sm">3rd level (3 slots): ${thirdLevel1}, ${thirdLevel2}</p><p class="break-sm">4th level (3 slots): ${fourthLevel1}</p><p class="break-sm">5th level (2 slots): ${fifthLevel1}</p><p class="break-sm">6th level (1 slot): ${sixthLevel}</p><p class="break-sm">7th level (1 slot): ${seventhLevel}</p><p>8th level (1 slot): ${eigthLevel}</p>`;
        } else if (level == 17) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}, ${cantrip4}, ${cantrip5}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}, ${firstLevel2}, ${firstLevel3}, ${firstLevel4}</p><p class="break-sm">2nd level (3 slots): ${secondLevel1}, ${secondLevel2}, ${secondLevel3}</p><p class="break-sm">3rd level (3 slots): ${thirdLevel1}, ${thirdLevel2}</p><p class="break-sm">4th level (3 slots): ${fourthLevel1}, ${fourthLevel2}</p><p class="break-sm">5th level (2 slots): ${fifthLevel1}</p><p class="break-sm">6th level (1 slot): ${sixthLevel}</p><p class="break-sm">7th level (1 slot): ${seventhLevel}</p><p class="break-sm">8th level (1 slot): ${eigthLevel}</p><p>9th level (1 slot): ${ninthLevel}</p>`;
        } else if (level == 18) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}, ${cantrip4}, ${cantrip5}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}, ${firstLevel2}, ${firstLevel3}, ${firstLevel4}</p><p class="break-sm">2nd level (3 slots): ${secondLevel1}, ${secondLevel2}, ${secondLevel3}</p><p class="break-sm">3rd level (3 slots): ${thirdLevel1}, ${thirdLevel2}, ${thirdLevel3}</p><p class="break-sm">4th level (3 slots): ${fourthLevel1}, ${fourthLevel2}</p><p class="break-sm">5th level (3 slots): ${fifthLevel1}</p><p class="break-sm">6th level (1 slot): ${sixthLevel}</p><p class="break-sm">7th level (1 slot): ${seventhLevel}</p><p class="break-sm">8th level (1 slot): ${eigthLevel}</p><p>9th level (1 slot): ${ninthLevel}</p>`;
        } else if (level == 19) {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}, ${cantrip4}, ${cantrip5}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}, ${firstLevel2}, ${firstLevel3}, ${firstLevel4}</p><p class="break-sm">2nd level (3 slots): ${secondLevel1}, ${secondLevel2}, ${secondLevel3}</p><p class="break-sm">3rd level (3 slots): ${thirdLevel1}, ${thirdLevel2}, ${thirdLevel3}</p><p class="break-sm">4th level (3 slots): ${fourthLevel1}, ${fourthLevel2}, ${fourthLevel3}</p><p class="break-sm">5th level (3 slots): ${fifthLevel1}</p><p class="break-sm">6th level (2 slots): ${sixthLevel}</p><p class="break-sm">7th level (1 slot): ${seventhLevel}</p><p class="break-sm">8th level (1 slot): ${eigthLevel}</p><p>9th level (1 slot): ${ninthLevel}</p>`;
        } else {
            spells = `<p class="break-sm">Cantrips (at will): ${cantrip1}, ${cantrip2}, ${cantrip3}, ${cantrip4}, ${cantrip5}</p><p class="break-sm">1st level (4 slots): ${firstLevel1}, ${firstLevel2}, ${firstLevel3}, ${firstLevel4}</p><p class="break-sm">2nd level (3 slots): ${secondLevel1}, ${secondLevel2}, ${secondLevel3}</p><p class="break-sm">3rd level (3 slots): ${thirdLevel1}, ${thirdLevel2}, ${thirdLevel3}</p><p class="break-sm">4th level (3 slots): ${fourthLevel1}, ${fourthLevel2}, ${fourthLevel3}</p><p class="break-sm">5th level (3 slots): ${fifthLevel1}, ${fifthLevel2}</p><p class="break-sm">6th level (2 slots): ${sixthLevel}</p><p class="break-sm">7th level (2 slots): ${seventhLevel}</p><p class="break-sm">8th level (1 slot): ${eigthLevel}</p><p>9th level (1 slot): ${ninthLevel}</p>`;
        };

        const getMagicResistance = () => {
            if (+conMod > 0) {
                hasMagicResistance = true
            } else {
                hasMagicResistance = false;
            };
        };

        const getMagicFeat = () => {
            if (skill1 == 'Arcana' || skill2 == 'Arcana') {
                if(Math.round(Math.random()) == 1) {
                    hasFeat = true;
                    feat = `<strong>Divine Eminence.</strong> As a bonus action, the ${race} can expend a spell slot to cause its melee weapon attacks to magically deal an extra 3d6 radiant damage to a target on a hit. This benefit lasts until the end of the turn. If the ${race} expends a spell slot of 2nd level or higher, the extra damage increases by 1d6 for each level above 1st.`;
                } else {
                    hasFeat = true;
                    feat = `<strong>Dark Devotion.</strong> The ${race} has advantage on saving throws against being charmed or frightened.`;
                };
            } else {
                hasFeat = false;
            };
        };

        if (+intMod > 0) {
            getMagicResistance();
            getMagicFeat();
        };
    };

    // Get weapon proficiency and to hit bonus
    const getweaponProficiency = () => {
        if (+strMod >= +dexMod) {
            weaponProficiency = 'martial';
            toHit = +strMod + proficiencyBonus;
        } else {
            weaponProficiency = 'simple';
            toHit = +dexMod + proficiencyBonus;
        };
    };

    getweaponProficiency();

    // Get melee and ranged weapons
    const getMeleeWeapon = (array) => {
        roll = Math.floor(Math.random() * array.length);

        meleeWeapon = array[roll][0];
        reach = array[roll][1];
        meleeDamageDice = array[roll][2];
        meleeDamageType = array[roll][3];
        isThrowable = array[roll][4];
        thrownRange = array[roll][5];
        isVersatile = array[roll][6];
        versatileDamageDice = array[roll][7];
        isTwoHanded = array[roll][8];

        if (isVersatile && !isThrowable) {
            meleeAction = `<strong>${meleeWeapon}.</strong> <em>Melee Weapon Attack:</em> +${toHit} to hit, reach ${reach}, one target. <em>Hit:</em> ${meleeDamageDice} + ${proficiencyBonus} ${meleeDamageType} damage, or ${versatileDamageDice} + ${proficiencyBonus} ${meleeDamageType} damage if used with two hands.`
        } else if (isVersatile && isThrowable) {
            meleeAction = `<strong>${meleeWeapon}.</strong> <em>Melee or Ranged Weapon Attack:</em> +${toHit} to hit, reach ${reach} or range ${thrownRange}, one target. <em>Hit:</em> ${meleeDamageDice} + ${proficiencyBonus} ${meleeDamageType} damage, or ${versatileDamageDice} + ${proficiencyBonus} ${meleeDamageType} damage if used with two hands to make a melee attack.`
        } else if (!isVersatile && isThrowable) {
            meleeAction = `<strong>${meleeWeapon}.</strong> <em>Melee or Ranged Weapon Attack:</em> +${toHit} to hit, reach ${reach} or range ${thrownRange}, one target. <em>Hit:</em> ${meleeDamageDice} + ${proficiencyBonus} ${meleeDamageType} damage.`
        } else {
            meleeAction = `<strong>${meleeWeapon}.</strong> <em>Melee Weapon Attack:</em> +${toHit} to hit, reach ${reach}, one target. <em>Hit:</em> ${meleeDamageDice} + ${proficiencyBonus} ${meleeDamageType} damage.`
        }
    };

    const getRangedWeapon = (array) => {
        roll = Math.floor(Math.random() * array.length);

        rangedWeapon = array[roll][0];
        range = array[roll][1];
        rangedDamageDice = array[roll][2];
        rangedDamageType = array[roll][3];

        if (!isTwoHanded) {
            isTwoHanded = array[roll][4];
        };

        rangedAction = `<strong>${rangedWeapon}.</strong> <em>Ranged Weapon Attack:</em> +${toHit} to hit, range ${range}, one target. <em>Hit:</em> ${rangedDamageDice} + ${proficiencyBonus} ${rangedDamageType} damage.`;
    };

    if (weaponProficiency == 'martial') {
        getMeleeWeapon(martialMeleeWeapons);
        getRangedWeapon(martialRangedWeapons);
    } else {
        getMeleeWeapon(simpleMeleeWeapons);
        getRangedWeapon(simpleRangedWeapons);
    };

    // Get dragonborn status and replace ranged weapon with breath weapon
    const getDragonbornStats = () => {
        if (level < 6) {
            rangedDamageDice = '2d6';
        } else if ( level < 11) {
            rangedDamageDice = '3d6';
        } else if (level < 16) {
            rangedDamageDice = '4d6';
        } else {
            rangedDamageDice = '5d6';
        };

        const getBreathArray = (index) => {
            rangedDamageType = breathWeapons[index][0];
            range = breathWeapons[index][1];
            savingThrow = breathWeapons[index][2];

            if (savingThrow == 'Dexterity') {
                difficultyClass = 8 + proficiencyBonus + +dexMod;
            } else {
                difficultyClass = 8 + proficiencyBonus + +conMod;
            };

            resistances = rangedDamageType;
        };

        const breathWeapon = (rangedDamageType, range, difficultyClass, savingThrow, rangedDamageDice) => {
            rangedAction = `<strong>${rangedDamageType} Breath <em>(Recharge 5-6)</em>.</strong> The ${race} exhales <span class="lowercase">${rangedDamageType}</span> in a ${range}. Each creature in that area must make a DC ${difficultyClass} ${savingThrow} saving throw, taking ${rangedDamageDice} <span class="lowercase">${rangedDamageType}</span> damage on a failed save, or half as much damage on a successful one.`;
        };

        const getDraconicAncestry = () => {
            if (subrace.includes('Black') || subrace.includes('Copper')) {
                getBreathArray(0);
                breathWeapon(rangedDamageType, range, difficultyClass, savingThrow, rangedDamageDice);
            } else if (subrace.includes('Blue') || subrace.includes('Bronze')) {
                getBreathArray(1);
                breathWeapon(rangedDamageType, range, difficultyClass, savingThrow, rangedDamageDice);
            } else if (subrace.includes('Brass')) {
                getBreathArray(2);
                breathWeapon(rangedDamageType, range, difficultyClass, savingThrow, rangedDamageDice);
            } else if (subrace.includes('Gold') || subrace.includes('Red')) {
                getBreathArray(3);
                breathWeapon(rangedDamageType, range, difficultyClass, savingThrow, rangedDamageDice);
            } else if (subrace.includes('Green')) {
                getBreathArray(4);
                breathWeapon(rangedDamageType, range, difficultyClass, savingThrow, rangedDamageDice);
            } else {
                getBreathArray(5);
                breathWeapon(rangedDamageType, range, difficultyClass, savingThrow, rangedDamageDice);
            };
        };
        
        getDraconicAncestry();
    };

    if (race == 'Dragonborn') {
        getDragonbornStats();
    };

    // Get shield status and update armor class
    const addShield = () => {
        return armorClass = baseAC + 2;
    };

    if (!isTwoHanded) {
        if (Math.round(Math.random()) == 1) {
            hasShield = true;
            addShield();
        } else {
            hasShield = false;
        };
    };

    // Get feats and reactions
    const getReaction = () => {
        if (+strMod >= +dexMod) {
            reaction = `<strong>Parry.</strong> The ${race} adds 2 to its AC against one melee attack that would hit it. To do so, the ${race} must see the attacker and be wielding a melee weapon.`;
        } else {
            reaction = `<strong>Evasion.</strong> If the ${race} is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, the ${race} instead takes no damage if it succeeds on the saving throw, and only half damage if it fails.`;
        };
    };

    const getFeat = () => {
        const check2ndProficiency = () => {
            switch (proficiency2) {
                case 'Strength': getStrengthFeat();
                break;
                case 'Dexterity': getDexterityFeat();
                break;
                case 'Constitution': getConstitutionFeat();
                break;
                case 'Wisdom': getWisdomFeat();
                break;
                case 'Charisma': getCharismaFeat();
            };
        };

        const getStrengthFeat = () => {
            const checkSTR = () => {
                if (+strMod > 0 && +intMod <= 0) {
                    feat = `<strong>Brute.</strong> A melee weapon deals one extra die of its damage when the ${race} hits with it (included in the attack).`;
                };
            };

            if (proficiency1 == 'Strength') {
                checkSTR();

                if (!feat) {
                    check2ndProficiency();
                };
            } else if (proficiency2 == 'Strength') {
                checkSTR();

                if (!feat) {
                    feat = `<strong>Brave.</strong> The ${race} has advantage on saving throws against being frightened.`;
                };
            };
        };

        const getDexterityFeat = () => {
            if (level <= 2) {
                sneakAttackDamageDice = '1d6';
            } else if (level <= 4) {
                sneakAttackDamageDice = '2d6';
            } else if (level <= 6) {
                sneakAttackDamageDice = '3d6';
            } else if (level <= 8) {
                sneakAttackDamageDice = '4d6';
            } else if (level <= 10) {
                sneakAttackDamageDice = '5d6';
            } else if (level <= 12) {
                sneakAttackDamageDice = '6d6';
            } else if (level <= 14) {
                sneakAttackDamageDice = '7d6';
            } else if (level <= 16) {
                sneakAttackDamageDice = '8d6';
            } else if (level <= 18) {
                sneakAttackDamageDice = '9d6';
            } else {
                sneakAttackDamageDice = '10d6';
            };
    
            if (Math.round(Math.random()) == 1) {
                hasInitiative = true;
            } else {
                hasInitiative = false;
            };

            const checkDEX = () => {
                if (+dexMod > 0 && (skill1 == 'Acrobatics' || skill2 == 'Acrobatics')) {
                    feat = `<strong>Cunning Action.</strong> On each of its turns, the ${race} can use a bonus action to take the Dash, Disengage, or Hide action.`;
                } else if (+dexMod > 0 && (skill1 == 'Stealth' || skill2 == 'Stealth')) {
                    feat = `<strong>Sneak Attack (1/Turn).</strong> The ${race} deals an extra ${sneakAttackDamageDice} damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 feet of an ally of the ${race} that isn't incapacitated and the ${race} doesn't have disadvantage on the attack roll.`;
                } else if (+dexMod > 0 && hasInitiative) {
                    feat = `<strong>Assassinate.</strong> During its first turn, the ${race} has advantage on attack rolls against any creature that hasn't taken a turn. Any hit the ${race} scores against a surprised creature is a critical hit.`;
                };
            };

            if (proficiency1 == 'Dexterity') {
                checkDEX();

                if (!feat) {
                    check2ndProficiency();
                };
            } else if (proficiency2 == 'Dexterity') {
                checkDEX();

                if (!feat) {
                    feat = `<strong>Brave.</strong> The ${race} has advantage on saving throws against being frightened.`;
                };
            };
        };

        const getConstitutionFeat = () => {
            const checkCON = () => {
                if (+conMod > 0 && (hitPoints > ((level * 8) + conBonus) / 2)) {
                    feat = `<strong>Reckless.</strong> At the start of its turn, the ${race} can gain advantage on all melee weapon attack rolls during that turn, but attack rolls against it have advantage until the start of its next turn.`;
                };
            };

            if (proficiency1 == 'Constitution') {
                checkCON();

                if (!feat) {
                    check2ndProficiency();
                };
            } else if (proficiency2 == 'Constitution') {
                checkCON();

                if (!feat) {
                    feat = `<strong>Brave.</strong> The ${race} has advantage on saving throws against being frightened.`;
                };
            };
        };

        const getWisdomFeat = () => {
            const checkWIS = () => {
                if (+wisMod > 0 && (skill1 == 'Perception' || skill2 == 'Perception')) {
                    feat = `<strong>Keen Hearing and Sight.</strong> The ${race} has advantage on Wisdom (Perception) checks that rely on hearing or sight.`;
                };
            };

            if (proficiency1 == 'Wisdom') {
                checkWIS();

                if (!feat) {
                    check2ndProficiency();
                };
            } else if (proficiency2 == 'Wisdom') {
                checkWIS();

                if (!feat) {
                    feat = `<strong>Brave.</strong> The ${race} has advantage on saving throws against being frightened.`;
                };
            };
        };

        const getCharismaFeat = () => {
            if (Math.round(Math.random()) == 1) {
                isCooperative = true;
            } else {
                isCooperative = false;
            };

            const checkCHA = () => {
                if (+chaMod > 0 && (skill1 == 'Persuasion' || skill2 == 'Persuasion')) {
                    feat = `<strong>Leadership (Recharges after a Short or Long Rest).</strong> For 1 minute, the ${race} can utter a special command or warning whenever a nonhostile creature that it can see within 30 feet of it makes an attack roll or a saving throw. The creature can add a d4 to its roll provided it can hear and understand the ${race}. A creature can benefit from only one Leadership die at a time. This effect ends if the ${race} is incapacitated.`;
                } else if (+chaMod > 0 && isCooperative) {
                    feat = `<strong>Pack Tactics.</strong> The ${race} has advantage on an attack roll against a creature if at least one of the ${race}'s allies is within 5 feet of the creature and the ally isn't incapacitated.`;
                };
            };

            if (proficiency1 == 'Charisma') {
                checkCHA();

                if (!feat) {
                    check2ndProficiency();
                };
            } else if (proficiency2 == 'Charisma') {
                checkCHA();

                if (!feat) {
                    feat = `<strong>Brave.</strong> The ${race} has advantage on saving throws against being frightened.`;
                };
            };
        };

        switch (proficiency1) {
            case 'Strength': getStrengthFeat();
            break;
            case 'Dexterity': getDexterityFeat();
            break;
            case 'Constitution': getConstitutionFeat();
            break;
            case 'Wisdom': getWisdomFeat();
            break;
            case 'Charisma': getCharismaFeat();
            break;
            default: check2ndProficiency();
        };

        if (feat == racialFeat) {
            hasFeat = false;
        };
    };

    const getBonusActions = () => {
        if (+dexMod > 0) {
            hasMultiattack = true;

            if (Math.round(Math.random()) == 1) {
                hasReaction = true;
                getReaction();
            } else {
                hasReaction = false;
            };
        };

        if (+intMod > 0 || +wisMod > 0) {
            if (Math.round(Math.random()) == 1) {
                hasFeat = true;
                getFeat();
            } else {
                hasFeat = false;
            };
        };
    };

    if (!isSpellcaster) {
        getBonusActions();
    };

    return
};

const generateStatblock = () => {
    npcName.innerHTML = `<input type="text" class="border-none w-full font-serif font-md bold" placeholder="Name Your NPC" value="${characterName}"></input>`;
    description.innerHTML = `<p class="font-serif italic">${subrace} (${size} Humanoid), Any Alignment</p>`;

    if (hasShield) {
        ac.innerHTML = `<p><span class="bold">Armor Class</span> ${baseAC} (${armorType}, ${armorClass} with Shield)</p>`;
    } else {
        ac.innerHTML = `<p><span class="bold">Armor Class</span> ${armorClass} (${armorType})</p>`;
    };

    hp.innerHTML = `<p><span class="bold">Hit Points</span> ${hitPoints}</p>`;
    movement.innerHTML = `<p><span class="bold">Speed</span> ${speed} ft.</p>`;
    strStats.innerHTML = `<p>${str} (${strMod})</p>`;
    dexStats.innerHTML = `<p>${dex} (${dexMod})</p>`;
    conStats.innerHTML = `<p>${con} (${conMod})</p>`;
    intStats.innerHTML = `<p>${int} (${intMod})</p>`;
    wisStats.innerHTML = `<p>${wis} (${wisMod})</p>`;
    chaStats.innerHTML = `<p>${cha} (${chaMod})</p>`;
    savingThrows.innerHTML = `<p><span class="bold">Saving Throws</span> ${save1}, ${save2}</p>`;

    if ((proficiency1 == 'Strength' && proficiency2 == 'Constitution') || (proficiency1 == 'Constitution' && proficiency2 == 'Strength')) {
        skills.innerHTML = `<p><span class="bold">Skills</span> ${skill1} +${skill1Mod}</p>`;
    } else {
        skills.innerHTML = `<p><span class="bold">Skills</span> ${skill1} +${skill1Mod}, ${skill2} +${skill2Mod}</p>`;
    };

    if (resistances) {
        dmgResistance.innerHTML = `<p><span class="bold">Damage Resistances</span> ${resistances}</p>`;
    };

    if (hasDarkvision) {
        senses.innerHTML = `<p><span class="bold">Senses</span> Darkvision 60 ft., Passive Perception ${passivePerception}</p>`;
    } else {
        senses.innerHTML = `<p><span class="bold">Senses</span> Passive Perception ${passivePerception}</p>`;
    };

    lang.innerHTML = `<p><span class="bold">Languages</span> ${languages}</p>`;
    profBonus.innerHTML = `<p><span class="bold">Proficiency Bonus</span> +${proficiencyBonus}</p>`;

    if (stealthDis || racialFeat || feat || hasMagicResistance || isSpellcaster) {
        featSection.classList.remove('hidden');
    };

    if (racialFeat) {
        racialFeature.innerHTML = `<p class="break-sm">${racialFeat}</p>`;
    };

    if (stealthDis) {
        stealthDisadvantage.innerHTML = `<p class="break-sm"><strong>Stealth Disadvantage.</strong> The ${race} has disadvantage on Stealth checks.</p>`;
    };

    if (isOverencumbered) {
        overEncumbered.innerHTML = `<p class="break-sm"><strong>Over Encumbered.</strong> The ${race} has disadvantage on Dexterity saving throws.</p>`;
    };

    if (hasFeat) {
        bonusFeature.innerHTML = `<p class="break-sm">${feat}</p>`;
    };

    if (hasMagicResistance) {
        magicResistance.innerHTML = `<p class="break-sm"><strong>Magic Resistance.</strong> The ${race} has advantage on saving throws against spells and other magical effects.</p>`;
    };

    if (isSpellcaster) {
        spellcastingFeature.innerHTML = `<p class="break-sm">${spellcasting}</p>`;
        spellList.innerHTML = `<p class="break-sm">${spells}</p>`;
    };

    if (hasMultiattack) {
        multiattack.innerHTML = `<p class="break-sm"><strong>Multiattack.</strong> The ${race} makes two <span class="lowercase">${meleeWeapon}</span> attacks.</p>`;
    }

    meleeAttack.innerHTML = `<p class="break-sm">${meleeAction}</p>`;
    rangedAttack.innerHTML = `<p class="break-sm">${rangedAction}</p>`;

    if (hasReaction) {
        reactionSection.classList.remove('hidden');
        moveReaction.innerHTML = `<p>${reaction}</p>`;
    };
};

const resetStatblock = () => {
    hasShield = false;
    resistances = '';
    hasDarkvision = false;
    racialFeat = '';
    stealthDis = false;
    isOverencumbered = false;
    hasInitiative = false;
    isCooperative = false;
    hasFeat = false;
    feat = '';
    hasMagicResistance = false;
    isSpellcaster = false;
    spellcasting = '';
    spells = '';
    hasMultiattack = false;
    hasReaction = false;
    reaction = '';

    featSection.classList.add('hidden');
    reactionSection.classList.add('hidden');

    npcName.innerHTML = '';
    description.innerHTML = '';
    ac.innerHTML = '';
    hp.innerHTML = '';
    movement.innerHTML = '';
    strStats.innerHTML = '';
    dexStats.innerHTML = '';
    conStats.innerHTML = '';
    intStats.innerHTML = '';
    wisStats.innerHTML = '';
    chaStats.innerHTML = '';
    savingThrows.innerHTML = ''
    skills.innerHTML = '';
    dmgResistance.innerHTML = '';
    senses.innerHTML = '';
    lang.innerHTML = '';
    profBonus.innerHTML = '';
    racialFeature.innerHTML = '';
    stealthDisadvantage.innerHTML = '';
    overEncumbered.innerHTML = '';
    bonusFeature.innerHTML = '';
    magicResistance.innerHTML = '';
    spellcastingFeature.innerHTML = '';
    spellList.innerHTML = '';
    multiattack.innerHTML = '';
    meleeAttack.innerHTML = '';
    rangedAttack.innerHTML = '';
    moveReaction.innerHTML = '';
};

rollButton.addEventListener('click', () => {
    if (!statblockActive) {
        rollNPC();
        generateStatblock();

        prompt.classList.add('hidden');
        statblock.classList.remove('hidden');

        statblockActive = true;
    };

    if (statblockActive) {
        resetStatblock();
        rollNPC();
        generateStatblock();
    };
});