"use client"
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const App = () => {
  const router = useRouter();
  const [selectedTool, setSelectedTool] = React.useState("");

  const toolData = {
    "bag-of-tricks": {
      type: "tools",
      description: "Whether they walk, swim or fly, generate a random Beast to pull out of your Bag of Tricks. Or for your Druid to Polymorph into."
    },
    "critical-modifiers": {
      type: "tools",
      description: "Add an extra dimension to critical rolls with hit/miss modifiers. From status conditions and bonus actions to extra damage dice, make your players feel like total badasses... or like the biggest fools this side of Eberron."
    },
    "deck-of-many-things": {
      type: "tools",
      description: "Inject a little chaos into your campaign by giving your party a Deck of Many Things. Simply draw a card, sit back, and watch as the Nine Hells break loose."
    },
    "gp-lottery": {
      type: "tools",
      description: "Whether looted from a fallen enemy or pickpocketed by your light-fingered Rogue, generate a level-appropriate amount of gold for your players. Or reward the entire party with a full-on Dragon hoard."
    },
    "initiative-tracker": {
      type: "tools",
      description: "We've all done it: lost track of who's up next and accidentally skipped someone's go. Never again! Simply input everyone's initiative roll and swipe your way through the encounter, marking players as dead and moving towards that inevitable Total Party Wipe."
    },
    "loot-randomiser": {
      type: "tools",
      description: "Instead of gold, reward your players with a random item drop. With resources ranging from simple trinkets, to Health Potions and consumables, all the way up to Legendary magic items, looting has never been more chaotic."
    },
    "name-generator": {
      type: "tools",
      description: "Players shown an interest in a random NPC? Quickly generate a name for them. Now they've invited that NPC along on a quest? Transfer their name to the NPC Generator and roll them up a statblock."
    },
    "random-encounter": {
      type: "tools",
      description: "Session running short? Generate a random, level-appropriate encounter for your party. Or give them a scare by scaling up the difficulty a bit."
    },
    "spellbook": {
      type: "tools",
      description: "Generate spells based on their level, from simple Cantrips to powerful 9th-Level incantations. Or embrace chaos and flip to a random page of your spellbook."
    },
    "statblock-generator": {
      type: "tools",
      description: "Bring your NPCs to life with custom statblocks, including unique traits, attacks and spells. Never again will you be caught off-guard by your party abducting the local stableboy and thrusting greatness upon them."
    },
    "wild-magic-surge": {
      type: "tools",
      description: "Rather than flipping through the Player's Handbook everytime your Sorcerer triggers Wild Magic Surge, simply click a button to reveal what random nonsense has befallen them this time."
    },
    "power-word": {
      type: "games",
      description: "Party taking too long to solve your puzzle? Wizard not prepared their spells (again)? Got a bit of time to kill? Play what is essentially D&D Hangman. You're behind a screen, they'll never know."
    }
  };

  const handleGo = () => {
    if (!selectedTool) return;
    const { type } = toolData[selectedTool];
    router.push(`/${type}/${selectedTool}`);
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 space-y-6 min-h-screen">
      <div>
        <Image
          src="/images/ampersand.png"
          width={240}
          height={240}
          alt="D&D" />
        <h1 className="font-roboto text-3xl font-bold text-center text-gray-400">DM TOOLS</h1>
      </div>

      <div className="flex flex-col items-center px-4 py-8 space-y-4 w-full max-w-md border-2 border-red">
        <h2 id="title" className="font-tiamat text-3xl">What Is It That You Require?</h2>
        {selectedTool && (
          <p className="font-roboto">
            {toolData[selectedTool].description}
          </p>
        )}
        <select
          name="tools"
          id="tool-select"
          className="px-2 py-1 bg-gray-100 text-black"
          defaultValue=""
          onChange={(e) => setSelectedTool(e.target.value)}
        >
          <option value="" disabled>Select a Tool</option>
          <option value="bag-of-tricks">Bag of Tricks</option>
          <option value="critical-modifiers">Critical Hit/Miss Modifiers</option>
          <option value="deck-of-many-things">Deck of Many Things</option>
          <option value="gp-lottery">GP Lottery</option>
          <option value="initiative-tracker">Initiative Tracker</option>
          <option value="loot-randomiser">Loot Randomiser</option>
          <option value="name-generator">Name Generator</option>
          <option value="random-encounter">Random Encounter</option>
          <option value="spellbook">Spellbook</option>
          <option value="statblock-generator">Statblock Generator</option>
          <option value="wild-magic-surge">Wild Magic Surge</option>
          <option value="power-word">Power Word (Game)</option>
        </select>
      </div>

      { selectedTool && (
      <button
        className="p-2 w-24 font-tiamat text-xl bg-red active:bg-activered cursor-pointer"
        onClick={handleGo}
      >
        Go!
      </button>
      )}
      <p className="absolute bottom-0 px-4 pb-1 text-sm text-center text-gray-400">Dungeons & Dragons, D&D, and the dragon ampersand are © and trademark Wizards of the Coast.</p>
    </div>
  );
};

export default App;
