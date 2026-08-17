import { syncEvolution, getEvolution, applyCharacterGlow, stageName, levelLabel, releaseColorLock } from "../shared/evolution.js?v=paper-fold-20260815a";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const elements = {
  intro: $("#intro"),
  introVideo: $("#introVideo"),
  introSound: $("#introSound"),
  skipIntro: $("#skipIntro"),
  worldGate: $("#worldGate"),
  castle: $("#cubeCastle"),
  origami: $("#origamiStudio"),
  mirrorManor: $("#mirrorManor"),
  geoboardYard: $("#geoboardYard"),
  crystalPlaza: $("#crystalPlaza"),
  walkers: $("#walkers"),
  mapStage: $(".map-stage"),
  guide: $("#mapGuide"),
  guideName: $("#guideName"),
  sound: $("#soundToggle"),
  profileButton: $("#profileButton"),
  profileAvatar: $("#profileAvatar"),
  toolbarName: $("#toolbarName"),
  characterModal: $("#characterModal"),
  closeCharacter: $("#closeCharacter"),
  selectedSprite: $("#selectedSprite"),
  selectedName: $("#selectedName"),
  selectedRole: $("#selectedRole"),
  equippedItems: $("#equippedItems"),
  playerName: $("#playerName"),
  nameHint: $("#nameHint"),
  saveProfile: $("#saveProfile"),
  characterGrid: $("#characterGrid"),
  colorPalette: $("#colorPalette"),
  itemCategories: $("#itemCategories"),
  itemGrid: $("#itemGrid")
};

const characters = [
  { id: "cubi", name: "\u{d050}\u{be44}", sprite: 0, role: "Cube Town Guide" },
  { id: "orbi", name: "\u{c624}\u{b974}\u{be44}", sprite: 1, role: "Sphere Garden Explorer" },
  { id: "pyra", name: "\u{d30c}\u{c774}\u{b77c}", sprite: 2, role: "Pyramid Peak Keeper" },
  { id: "cylo", name: "\u{c0ac}\u{c77c}\u{b85c}", sprite: 3, role: "Cylinder Harbor Captain" },
  { id: "recto", name: "\u{b809}\u{d1a0}", sprite: 4, role: "Solid Block Builder" },
  { id: "arco", name: "\u{c544}\u{b974}\u{cf54}", sprite: 5, role: "Angle Lab Scholar" },
  { id: "coni", name: "\u{cf54}\u{b2c8}", sprite: 6, role: "Cone Valley Ranger" },
  { id: "pris", name: "\u{d504}\u{b9ac}\u{c988}", sprite: 7, role: "Prism Light Runner" },
  { id: "nova", name: "\u{b178}\u{bc14}", sprite: 8, role: "Compass Trail Finder" },
  { id: "foldy", name: "\u{d3f4}\u{b514}", sprite: 9, role: "Origami Studio Guide" }
];

const colors = [
  { id: "original", swatch: "swatch-original" },
  { id: "ocean", swatch: "swatch-ocean" },
  { id: "berry", swatch: "swatch-berry" },
  { id: "sunset", swatch: "swatch-sunset" },
  { id: "mono", swatch: "swatch-mono" }
];

const itemCategories = [
  { id: "hat", iconId: "cat-crown", label: { ko: "\u{baa8}\u{c790}", zh: "\u{5e3d}\u{5b50}", ja: "\u{307c}\u{3046}\u{3057}", en: "Hats" } },
  { id: "face", iconId: "cat-glasses", label: { ko: "\u{c5bc}\u{ad74}", zh: "\u{8138}\u{90e8}", ja: "\u{304b}\u{304a}", en: "Face" } },
  { id: "badge", iconId: "cat-star", label: { ko: "\u{bc30}\u{c9c0}", zh: "\u{5fbd}\u{7ae0}", ja: "\u{30d0}\u{30c3}\u{30b8}", en: "Badges" } },
  { id: "hand", iconId: "cat-wand", label: { ko: "\u{c18c}\u{d488}", zh: "\u{9053}\u{5177}", ja: "\u{3053}\u{3082}\u{306e}", en: "Props" } },
  { id: "aura", iconId: "cat-sparkles", label: { ko: "\u{d6a8}\u{acfc}", zh: "\u{7279}\u{6548}", ja: "\u{30a8}\u{30d5}\u{30a7}\u{30af}\u{30c8}", en: "Effects" } }
];

const items = [
  { id: "cap", category: "hat", iconId: "cat-hat", cost: 100, name: { ko: "\u{d0d0}\u{d5d8} \u{baa8}\u{c790}", zh: "\u{63a2}\u{9669}\u{5e3d}", ja: "\u{305f}\u{3093}\u{3051}\u{3093}\u{5e3d}", en: "Explorer Cap" } },
  { id: "crown", category: "hat", iconId: "cat-crown", cost: 400, name: { ko: "\u{d669}\u{ae08} \u{c655}\u{ad00}", zh: "\u{91d1}\u{8272}\u{738b}\u{51a0}", ja: "\u{91d1}\u{306e}\u{738b}\u{51a0}", en: "Golden Crown" } },
  { id: "helmet", category: "hat", iconId: "cat-helmet", cost: 220, name: { ko: "\u{c548}\u{c804} \u{d5ec}\u{ба67}", zh: "\u{5b89}\u{5168}\u{5e3d}", ja: "\u{30d8}\u{30eb}\u{30e1}\u{30c3}\u{30c8}", en: "Builder Helmet" } },
  { id: "wizard-hat", category: "hat", iconId: "cat-wizard", cost: 320, name: { ko: "\u{b9c8}\u{bc95}\u{c0ac} \u{baa8}\u{c790}", zh: "\u{9b54}\u{6cd5}\u{5e3d}", ja: "\u{9b54}\u{6cd5}\u{306e}\u{5e3d}\u{5b50}", en: "Wizard Hat" } },
  { id: "flower-crown", category: "hat", iconId: "cat-flower", cost: 280, name: { ko: "\u{af43} \u{c655}\u{ad00}", zh: "\u{82b1}\u{51a0}", ja: "\u{82b1}\u{304b}\u{3093}\u{3080}\u{308a}", en: "Flower Crown" } },

  { id: "glasses", category: "face", iconId: "cat-glasses", cost: 180, name: { ko: "\u{b465}\u{adfc} \u{c548}\u{acbd}", zh: "\u{5706}\u{773c}\u{955c}", ja: "\u{4e38}\u{3081}\u{304c}\u{306d}", en: "Round Glasses" } },
  { id: "star-glasses", category: "face", iconId: "cat-stars", cost: 240, name: { ko: "\u{bcc4} \u{c548}\u{acbd}", zh: "\u{661f}\u{661f}\u{773c}\u{955c}", ja: "\u{30b9}\u{30bf}\u{30fc}\u{3081}\u{304c}\u{306d}", en: "Star Glasses" } },
  { id: "monocle", category: "face", iconId: "cat-monocle", cost: 220, name: { ko: "\u{d0d0}\u{c815} \u{b80c}\u{c988}", zh: "\u{4fa6}\u{63a2}\u{955c}", ja: "\u{63a2}\u{5075}\u{30ec}\u{30f3}\u{30ba}", en: "Detective Lens" } },
  { id: "mask", category: "face", iconId: "cat-mask", cost: 300, name: { ko: "\u{bcc0}\u{c2e0} \u{ac00}\u{ba74}", zh: "\u{53d8}\u{8eab}\u{9762}\u{5177}", ja: "\u{5909}\u{8eab}\u{30de}\u{30b9}\u{30af}", en: "Funny Mask" } },
  { id: "goggles", category: "face", iconId: "cat-goggles", cost: 260, name: { ko: "\u{c5f0}\u{ad6c} \u{ace0}\u{ae00}", zh: "\u{7814}\u{7a76}\u{62a4}\u{76ee}\u{955c}", ja: "\u{7814}\u{7a76}\u{30b4}\u{30fc}\u{30b0}\u{30eb}", en: "Lab Goggles" } },

  { id: "star", category: "badge", iconId: "cat-star", cost: 0, name: { ko: "\u{bcc4} \u{bc30}\u{c9c0}", zh: "\u{661f}\u{661f}\u{5fbd}\u{7ae0}", ja: "\u{661f}\u{30d0}\u{30c3}\u{30b8}", en: "Star Badge" } },
  { id: "heart", category: "badge", iconId: "cat-heart", cost: 60, name: { ko: "\u{b9c8}\u{c74c} \u{bc30}\u{c9c0}", zh: "\u{7231}\u{5fc3}\u{5fbd}\u{7ae0}", ja: "\u{30cf}\u{30fc}\u{30c8}\u{30d0}\u{30c3}\u{30b8}", en: "Heart Badge" } },
  { id: "medal", category: "badge", iconId: "cat-medal", cost: 140, name: { ko: "\u{b3c4}\u{c804} \u{ba54}\u{b2ec}", zh: "\u{6311}\u{6218}\u{5956}\u{724c}", ja: "\u{30c1}\u{30e3}\u{30ec}\u{30f3}\u{30b8}\u{30e1}\u{30c0}\u{30eb}", en: "Challenge Medal" } },
  { id: "gem", category: "badge", iconId: "cat-gem", cost: 220, name: { ko: "\u{bcf4}\u{c11d} \u{bc30}\u{c9c0}", zh: "\u{5b9d}\u{77f3}\u{5fbd}\u{7ae0}", ja: "\u{5b9d}\u{77f3}\u{30d0}\u{30c3}\u{30b8}", en: "Gem Badge" } },
  { id: "compass", category: "badge", iconId: "cat-compass", cost: 260, name: { ko: "\u{b098}\u{ce68}\u{bc18} \u{bc30}\u{c9c0}", zh: "\u{6307}\u{5357}\u{9488}\u{5fbd}\u{7ae0}", ja: "\u{30b3}\u{30f3}\u{30d1}\u{30b9}\u{30d0}\u{30c3}\u{30b8}", en: "Compass Badge" } },

  { id: "wand", category: "hand", iconId: "cat-wand", cost: 260, name: { ko: "\u{b9c8}\u{bc95}\u{bd09}", zh: "\u{9b54}\u{6cd5}\u{68d2}", ja: "\u{9b54}\u{6cd5}\u{306e}\u{6756}", en: "Magic Wand" } },
  { id: "flag", category: "hand", iconId: "cat-flag", cost: 140, name: { ko: "\u{d0d0}\u{d5d8} \u{ae43}\u{bc1c}", zh: "\u{63a2}\u{9669}\u{65d7}", ja: "\u{63a2}\u{691c}\u{30d5}\u{30e9}\u{30c3}\u{30b0}", en: "Explorer Flag" } },
  { id: "telescope", category: "hand", iconId: "cat-telescope", cost: 240, name: { ko: "\u{ad00}\u{cc30} \u{b9dd}\u{c6d0}\u{acbd}", zh: "\u{89c2}\u{5bdf}\u{671b}\u{8fdc}\u{955c}", ja: "\u{89b3}\u{5bdf}\u{671b}\u{9060}\u{93e1}", en: "Telescope" } },
  { id: "camera", category: "hand", iconId: "cat-camera", cost: 300, name: { ko: "\u{c791}\u{d488} \u{cd4c}\u{cba4}\u{b77c}", zh: "\u{4f5c}\u{54c1}\u{76f8}\u{673a}", ja: "\u{4f5c}\u{54c1}\u{30ab}\u{30e1}\u{30e9}", en: "Studio Camera" } },
  { id: "blueprint", category: "hand", iconId: "cat-blueprint", cost: 180, name: { ko: "\u{c124}\u{acc4} \u{b3c4}\u{ad6c}", zh: "\u{8bbe}\u{8ba1}\u{5de5}\u{5177}", ja: "\u{8a2d}\u{8a08}\u{30c4}\u{30fc}\u{30eb}", en: "Design Tool" } },

  { id: "sparkles", category: "aura", iconId: "cat-sparkles", cost: 180, name: { ko: "\u{bc18}\u{c9dd} \u{d6a8}\u{acfc}", zh: "\u{95ea}\u{4eae}\u{7279}\u{6548}", ja: "\u{304d}\u{3089}\u{304d}\u{3089}", en: "Sparkles" } },
  { id: "rainbow", category: "aura", iconId: "cat-rainbow", cost: 320, name: { ko: "\u{bb34}\u{c9c0}\u{ac1c} \u{d6a8}\u{acfc}", zh: "\u{5f69}\u{8679}\u{7279}\u{6548}", ja: "\u{8679}\u{30a8}\u{30d5}\u{30a7}\u{30af}\u{30c8}", en: "Rainbow" } },
  { id: "flame", category: "aura", iconId: "cat-flame", cost: 280, name: { ko: "\u{c5f4}\u{c815} \u{bd88}\u{af43}", zh: "\u{70ed}\u{60c5}\u{706b}\u{7130}", ja: "\u{60c5}\u{71b1}\u{306e}\u{708e}", en: "Power Flame" } },
  { id: "snow", category: "aura", iconId: "cat-snow", cost: 250, name: { ko: "\u{b208}\u{af43} \u{d6a8}\u{acfc}", zh: "\u{96ea}\u{82b1}\u{7279}\u{6548}", ja: "\u{96ea}\u{30a8}\u{30d5}\u{30a7}\u{30af}\u{30c8}", en: "Snow Glow" } },
  { id: "galaxy", category: "aura", iconId: "cat-galaxy", cost: 450, name: { ko: "\u{c740}\u{d558} \u{d6a8}\u{acfc}", zh: "\u{94f6}\u{6cb3}\u{7279}\u{6548}", ja: "\u{9280}\u{6cb3}\u{30a8}\u{30d5}\u{30a7}\u{30af}\u{30c8}", en: "Galaxy Aura" } }
];

const messages = {
  ko: {
    skipIntro: "\u{ac74}\u{b108}\u{b6f0}\u{ae30} \u{203a}", gatewayTitle: "\u{c9c0}\u{c624}\u{ba54}\u{d2b8}\u{b9ac} \u{c6d4}\u{b4dc}\u{b85c} \u{c774}\u{b3d9} \u{c911}\u{2026}", gatewayHint: "\u{b3c4}\u{d615} \u{cce}\u{c5ac}\u{ad6c}\u{b4e4}\u{c774} \u{ae30}\u{b2e4}\u{b9ac}\u{ace0} \u{c788}\u{c5b4}\u{c694}", crystalPlaza: "\u{d06c}\u{b9ac}\u{c2a4}\u{d138} \u{ad11}\u{c7a5} \u{b7}\u{c9c0}\u{c624}\u{ba54}\u{d2b8}\u{b9ac} \u{b7a9}", mapGuide: "{name}, \u{c313}\u{ae30}\u{b098}\u{bb34} \u{c131}\u{c5d0} \u{c0c8}\u{b85c}\u{c6b4} \u{ac8c}\u{c784}\u{c774} \u{c788}\u{c5b4}!", origamiGuide: "{name}, \u{c0c9}\u{c885}\u{c774} \u{acf5}\u{bc29}\u{c5d0}\u{c11c} \u{d55c} \u{b2e8}\u{acc4}\u{c529} \u{c811}\u{c5b4} \u{bcfc}\u{ae4c}?", myPartner: "\u{b098}\u{c758} \u{b3c4}\u{d615} \u{d30c}\u{d2b8}\u{b108}", chooseCharacter: "\u{cce}\u{ad81}\u{d130} \u{c120}\u{d0dd}", setupCharacter: "\u{b0b4} \u{b3c4}\u{d615} \u{cce}\u{c5ac}\u{ad6c} \u{b9cc}\u{b4e4}\u{ae30}", friends: "\u{b3c4}\u{d615} \u{cce}\u{c5ac}\u{ad6c}\u{b4e4}", color: "\u{c0c9}\u{c0c1}", items: "\u{d3ec}\u{c778}\u{d2b8} \u{bab0}", itemHint: "\u{d3ec}\u{c778}\u{d2b8}\u{b85c} \u{d574}\u{ae08}\u{d558}\u{ace0} \u{c5ec}\u{b7ec} \u{c7a5}\u{c2dd}\u{c744} \u{d568}\u{aed8} \u{cc29}\u{c6a9}\u{d574}\u{c694}", playerName: "\u{b0b4} \u{c774}\u{b984}", namePlaceholder: "\u{c774}\u{b984}\u{c774}\u{b098} \u{bcc4}\u{ba85}", nameHint: "\u{c774} \u{c774}\u{b984}\u{c73c}\u{b85c} \u{d559}\u{c2b5} \u{ae30}\u{b85d}\u{c774} \u{c800}\u{c7a5}\u{b3fc}\u{c694}.", saveProfile: "\u{c774} \u{c774}\u{b984}\u{c73c}\u{b85c} \u{c2dc}\u{c791}\u{d558}\u{ae30}", updateProfile: "\u{bcc0}\u{acbd} \u{b0b4}\u{c6a9} \u{c800}\u{c7a5}", nameRequired: "\u{c774}\u{b984}\u{c774}\u{b098} \u{bcc4}\u{ba85}\u{c744} \u{ba3c}\u{c800} \u{c801}\u{c5b4} \u{c8fc}\u{c138}\u{c694}.", removeItem: "\u{c7a5}\u{cc29} \u{d574}\u{c81c}",
    needPoints: "\u{d3ec}\u{c778}\u{d2b8}\u{ac00} \u{c870}\u{ae08} \u{b354} \u{d544}\u{c694}\u{d574}!", unlocked: "\u{c0c8} \u{c544}\u{c774}\u{d15c}\u{c744} \u{c5bb}\u{c5c8}\u{c5b4}!"
  },
  zh: {
    skipIntro: "\u{8df3}\u{8fc7} \u{203a}", gatewayTitle: "\u{6b63}\u{5728}\u{8fdb}\u{5165}\u{51e0}\u{4f55}\u{4e16}\u{754c}\u{2026}", gatewayHint: "\u{51e0}\u{4f55}\u{4f19}\u{4f34}\u{4eec}\u{6b63}\u{5728}\u{7b49}\u{4f60}", crystalPlaza: "\u{6c34}\u{6676}\u{5e7f}\u{573a} \u{b7}\u{51e0}\u{4f55}\u{5b9e}\u{9a8c}\u{5ba4}", mapGuide: "{name}，\u{79ef}\u{6728}\u{57ce}\u{5821}\u{91cc}\u{6709}\u{65b0}\u{6e38}\u{620f}！", origamiGuide: "{name}，\u{4e00}\u{8d77}\u{5728}\u{6298}\u{7eb8}\u{5de5}\u{574a}\u{4e00}\u{6b65}\u{4e00}\u{6b65}\u{6298}\u{5427}！", myPartner: "\u{6211}\u{7684}\u{51e0}\u{4f55}\u{4f19}\u{4f34}", chooseCharacter: "\u{9009}\u{62e9}\u{89d2}\u{8272}", setupCharacter: "\u{521b}\u{5efa}\u{6211}\u{7684}\u{51e0}\u{4f55}\u{4f19}\u{4f34}", friends: "\u{51e0}\u{4f55}\u{670b}\u{53cb}", color: "\u{989c}\u{8272}", items: "\u{79ef}\u{5206}\u{5546}\u{57ce}", itemHint: "\u{7528}\u{79ef}\u{5206}\u{89e3}\u{9501}\u{5e76}\u{540c}\u{65f6}\u{4f69}\u{6234}\u{591a}\u{4ef6}\u{88c5}\u{9970}", playerName: "\u{6211}\u{7684}\u{540d}\u{5b57}", namePlaceholder: "\u{540d}\u{5b57}\u{6216}\u{6635}\u{79f0}", nameHint: "\u{5b66}\u{4e60}\u{8bb0}\u{5f55}\u{4f1a}\u{4fdd}\u{5b58}\u{5728}\u{8fd9}\u{4e2a}\u{540d}\u{5b57}\u{4e0b}\u{3002}", saveProfile: "\u{7528}\u{8fd9}\u{4e2a}\u{540d}\u{5b57}\u{5f00}\u{59cb}", updateProfile: "\u{4fdd}\u{5b58}\u{66f4}\u{6539}", nameRequired: "\u{8bf7}\u{5148}\u{586b}\u{5199}\u{540d}\u{5b57}\u{6216}\u{6635}\u{79f0}\u{3002}", removeItem: "\u{5378}\u{4e0b}",
    needPoints: "\u{8fd8}\u{9700}\u{8981}\u{66f4}\u{591a}\u{79ef}\u{5206}！", unlocked: "\u{83b7}\u{5f97}\u{4e86}\u{65b0}\u{9053}\u{5177}！"
  },
  ja: {
    skipIntro: "\u{30b9}\u{30ad}\u{30c3}\u{30d7} \u{203a}", gatewayTitle: "\u{30b8}\u{30aa}\u{30e1}\u{30c8}\u{30ea}\u{30fc}\u{30ef}\u{30fc}\u{30eb}\u{30c9}\u{3078}\u{79fb}\u{52d5}\u{4e2d}\u{2026}", gatewayHint: "\u{56f3}\u{5f62}\u{306e}\u{306a}\u{304b}\u{307e}\u{305f}\u{3061}\u{304c}\u{5f85}\u{3063}\u{3066}\u{3044}\u{308b}\u{3088}", crystalPlaza: "\u{30af}\u{30ea}\u{30b9}\u{30bf}\u{30eb}\u{5e83}\u{5834}\u{30fb}\u{30b8}\u{30aa}\u{30e1}\u{30c8}\u{30ea}\u{30fc}\u{30e9}\u{30dc}", mapGuide: "{name}\u{3001}\u{3064}\u{307f}\u{304d}\u{57ce}\u{306b}\u{65b0}\u{3057}\u{3044}\u{30b2}\u{30fc}\u{30e0}\u{304c}\u{3042}\u{308b}\u{3088}！", origamiGuide: "{name}\u{3001}\u{304a}\u{308a}\u{304c}\u{307f}\u{5de5}\u{623f}\u{3067}\u{4e00}\u{3064}\u{305a}\u{3064}\u{6298}\u{3063}\u{3066}\u{307f}\u{3088}\u{3046}！", myPartner: "\u{308f}\u{305f}\u{3057}\u{306e}\u{56f3}\u{5f62}\u{30d1}\u{30fc}\u{30c8}\u{30ca}\u{30fc}", chooseCharacter: "\u{30ad}\u{30e3}\u{30e9}\u{30af}\u{30bf}\u{30fc}\u{9078}\u{629e}", setupCharacter: "\u{56f3}\u{5f62}\u{30d1}\u{30fc}\u{30c8}\u{30ca}\u{30fc}\u{3092}\u{3064}\u{304f}\u{308b}", friends: "\u{56f3}\u{5f62}\u{306e}\u{306a}\u{304b}\u{307e}", color: "\u{30ab}\u{30e9}\u{30fc}", items: "\u{30dd}\u{30a4}\u{30f3}\u{30c8}\u{30e2}\u{30fc}\u{30eb}", itemHint: "\u{30dd}\u{30a4}\u{30f3}\u{30c8}\u{3067}\u{89e3}\u{653e}\u{3057}\u{3066}\u{8907}\u{6570}\u{306e}\u{30a2}\u{30a4}\u{30c6}\u{30e0}\u{3092}\u{88c5}\u{5099}", playerName: "\u{306a}\u{307e}\u{3048}", namePlaceholder: "\u{306a}\u{307e}\u{3048}\u{30fb}\u{30cb}\u{30c3}\u{30af}\u{30cd}\u{30fc}\u{30e0}", nameHint: "\u{3053}\u{306e}\u{540d}\u{524d}\u{3067}\u{5b66}\u{7fd2}\u{8a18}\u{9332}\u{3092}\u{4fdd}\u{5b58}\u{3057}\u{307e}\u{3059}\u{3002}", saveProfile: "\u{3053}\u{306e}\u{540d}\u{524d}\u{3067}\u{306f}\u{3058}\u{3081}\u{308b}", updateProfile: "\u{5909}\u{66f4}\u{3092}\u{4fdd}\u{5b58}", nameRequired: "\u{540d}\u{524d}\u{304b}\u{30cb}\u{30c3}\u{30af}\u{30cd}\u{30fc}\u{30e0}\u{3092}\u{5165}\u{529b}\u{3057}\u{3066}\u{304f}\u{3060}\u{3055}\u{3044}\u{3002}", removeItem: "\u{306f}\u{305a}\u{3059}",
    needPoints: "\u{30dd}\u{30a4}\u{30f3}\u{30c8}\u{304c}\u{3082}\u{3046}\u{5c11}\u{3057}\u{5fc5}\u{8981}！", unlocked: "\u{65b0}\u{3057}\u{3044}\u{30a2}\u{30a4}\u{30c6}\u{30e0}\u{3092}\u{30b2}\u{30c3}\u{30c8}！"
  },
  en: {
    skipIntro: "Skip \u{203a}", gatewayTitle: "Entering Geometry World\u{2026}", gatewayHint: "Your geometry friends are waiting", crystalPlaza: "Crystal Plaza \u{b7} Geometry Lab", mapGuide: "{name}, there is a new game in the cube castle!", origamiGuide: "{name}, let us fold one easy step at a time in Origami Studio!", myPartner: "My Geometry Partner", chooseCharacter: "Choose a Character", setupCharacter: "Create My Geometry Partner", friends: "Geometry Friends", color: "Color", items: "Point Mall", itemHint: "Unlock items with points and wear several together", playerName: "My name", namePlaceholder: "Name or nickname", nameHint: "Your learning progress is saved under this name.", saveProfile: "Start with this name", updateProfile: "Save changes", nameRequired: "Enter a name or nickname first.", removeItem: "Remove",
    needPoints: "You need a few more points!", unlocked: "New item unlocked!"
  }
};

function readStoredProfile() {
  try { return JSON.parse(localStorage.getItem("gfield-profile") || "{}"); }
  catch { return {}; }
}

// Bring earned level/stage/gifts up to date (migrates returning players
// silently) BEFORE we snapshot the profile, so `stored` already reflects any
// newly-applied gifts and the new `evolution` field.
syncEvolution();
const stored = readStoredProfile();
const legacyItem = items.find((item) => item.id === stored.item);
const profile = {
  version: 2,
  name: typeof stored.name === "string" ? stored.name : "",
  setupComplete: Boolean(stored.setupComplete && stored.name),
  character: stored.character || "cubi",
  color: stored.color || "original",
  equipped: stored.equipped && typeof stored.equipped === "object"
    ? { ...stored.equipped }
    : legacyItem ? { [legacyItem.category]: legacyItem.id } : { badge: "star" },
  unlocked: Array.isArray(stored.unlocked) ? [...new Set([...stored.unlocked, "star"])] : ["star"],
  progress: stored.progress && typeof stored.progress === "object" ? stored.progress : {},
  evolution: (stored.evolution && typeof stored.evolution === "object") ? { ...stored.evolution } : undefined,
  createdAt: stored.createdAt || Date.now(),
  lastPlayedAt: Date.now()
};
let language = localStorage.getItem("gfield-language") || "ko";
const storedPoints = localStorage.getItem("gfield-points");
let points = storedPoints === null ? 120 : Number(storedPoints);
if (!Number.isFinite(points)) points = 120;
let audioEnabled = localStorage.getItem("gfield-audio-muted") !== "true";
let activeItemCategory = "hat";
let onboarding = !profile.setupComplete;

function message(key) {
  return messages[language]?.[key] || messages.ko[key] || key;
}

function saveProfile() {
  profile.version = 2;
  profile.lastPlayedAt = Date.now();
  localStorage.setItem("gfield-profile", JSON.stringify(profile));
  localStorage.setItem("gfield-points", String(points));
}

function selectedCharacter() {
  return characters.find((character) => character.id === profile.character) || characters[0];
}

function spriteClasses(character = selectedCharacter()) {
  return `character-sprite sprite-${character.sprite} color-${profile.color}`;
}

function applyLanguage() {
  document.documentElement.lang = language;
  $$("[data-i18n]").forEach((node) => { node.textContent = message(node.dataset.i18n); });
  $$("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = message(node.dataset.i18nPlaceholder);
  });
  $$("[data-lang]").forEach((button) => button.classList.toggle("active", button.dataset.lang === language));
  elements.characterModal.classList.toggle("onboarding", onboarding);
  $("#characterTitle").textContent = message(onboarding ? "setupCharacter" : "chooseCharacter");
  elements.saveProfile.textContent = message(onboarding ? "saveProfile" : "updateProfile");
  elements.sound.textContent = audioEnabled ? "\u{266b}" : "\u{266a}";
  elements.sound.setAttribute("aria-pressed", String(audioEnabled));
  setGuide("mapGuide");
  renderCharacterRoom();
}

function updatePoints() {
  $$(".point-value").forEach((node) => { node.textContent = String(points); });
}

function setGuide(textKey) {
  elements.guideName.textContent = selectedCharacter().name;
  const key = textKey === "mapGuide" && selectedCharacter().id === "foldy" ? "origamiGuide" : textKey;
  elements.guide.querySelector("p").textContent = message(key).replace("{name}", profile.name || selectedCharacter().name);
}

function itemName(item) {
  return item.name?.[language] || item.name?.ko || item.id;
}

function iconMarkup(iconId, className = "mall-icon") {
  if (!iconId) return "";
  return `<svg class="${className}" aria-hidden="true" focusable="false"><use href="./assets/point-mall-icons.svg#${iconId}"></use></svg>`;
}

function equippedItemList() {
  return Object.values(profile.equipped)
    .map((itemId) => items.find((item) => item.id === itemId))
    .filter(Boolean);
}

function primaryEquippedIcon() {
  return equippedItemList()[0]?.iconId || "";
}

function renderEquippedItems() {
  elements.equippedItems.replaceChildren();
  equippedItemList().forEach((item) => {
    const icon = document.createElement("span");
    icon.className = `equipped-slot equipped-${item.category}`;
    icon.innerHTML = iconMarkup(item.iconId, "mall-icon equipped-icon");
    elements.equippedItems.append(icon);
  });
}

function updateProfileVisuals() {
  const character = selectedCharacter();
  elements.profileAvatar.className = spriteClasses(character);
  elements.selectedSprite.className = spriteClasses(character);
  elements.selectedName.textContent = character.name;
  elements.selectedRole.textContent = character.role;
  elements.toolbarName.textContent = profile.name || "";
  if (elements.characterModal.hidden) elements.playerName.value = profile.name;
  renderEquippedItems();
  elements.guideName.textContent = character.name;
  elements.profileButton.setAttribute("aria-label", profile.name ? `${profile.name} profile` : message("chooseCharacter"));
  updatePoints();
  renderWalkers();
  updateEvolutionDisplay();
}

function updateEvolutionDisplay() {
  const evo = getEvolution();
  const sname = stageName(evo.stage, language);
  applyCharacterGlow(elements.selectedSprite, evo.stage);

  let chip = document.querySelector("#evoLevelChip");
  if (!chip) {
    chip = document.createElement("button");
    chip.type = "button";
    chip.id = "evoLevelChip";
    chip.className = "evo-level-chip";
    chip.addEventListener("click", () => openCharacterRoom(false));
    elements.profileButton.insertAdjacentElement("afterend", chip);
  }
  const chipLabel = levelLabel(evo.level, language);
  chip.textContent = chipLabel;
  chip.setAttribute("aria-label", sname ? `${sname} \u{b7} ${chipLabel}` : chipLabel);
  chip.title = sname || chipLabel;
  chip.classList.toggle("evo-max", evo.stage >= evo.maxStage);

  let line = document.querySelector("#evoStageLine");
  if (!line && elements.selectedRole) {
    line = document.createElement("p");
    line.id = "evoStageLine";
    line.className = "evo-stage-line";
    elements.selectedRole.insertAdjacentElement("afterend", line);
  }
  if (line) line.textContent = (evo.stage > 0 && sname) ? `${levelLabel(evo.level, language)} \u{b7} ${sname}` : levelLabel(evo.level, language);
}

function renderCharacterRoom() {
  elements.characterGrid.replaceChildren();
  characters.forEach((character) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "character-choice";
    button.classList.toggle("active", character.id === profile.character);
    button.innerHTML = `<span class="character-sprite sprite-${character.sprite} color-${profile.color}"></span><strong>${character.name}</strong>`;
    button.addEventListener("click", () => {
      profile.character = character.id;
      saveProfile();
      updateProfileVisuals();
      renderCharacterRoom();
    });
    elements.characterGrid.append(button);
  });

  elements.colorPalette.replaceChildren();
  colors.forEach((color) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `color-swatch ${color.swatch}`;
    button.classList.toggle("active", color.id === profile.color);
    button.setAttribute("aria-label", color.id);
    button.addEventListener("click", () => {
      profile.color = color.id;
      releaseColorLock(profile);
      saveProfile();
      updateProfileVisuals();
      renderCharacterRoom();
    });
    elements.colorPalette.append(button);
  });

  elements.itemCategories.replaceChildren();
  itemCategories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "item-category";
    button.classList.toggle("active", category.id === activeItemCategory);
    button.innerHTML = `${iconMarkup(category.iconId, "mall-icon category-icon")}<strong>${category.label[language] || category.label.ko}</strong>`;
    button.addEventListener("click", () => {
      activeItemCategory = category.id;
      renderCharacterRoom();
    });
    elements.itemCategories.append(button);
  });

  elements.itemGrid.replaceChildren();
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "item-choice remove-item";
  remove.classList.toggle("active", !profile.equipped[activeItemCategory]);
  remove.innerHTML = `<span class="item-icon remove-glyph">\u{d7}</span><strong>${message("removeItem")}</strong><small>\u{2713}</small>`;
  remove.addEventListener("click", () => {
    delete profile.equipped[activeItemCategory];
    if (profile.evolution?.gifts) delete profile.evolution.gifts[activeItemCategory];
    saveProfile();
    updateProfileVisuals();
    renderCharacterRoom();
  });
  elements.itemGrid.append(remove);

  items.filter((item) => item.category === activeItemCategory).forEach((item) => {
    const unlocked = profile.unlocked.includes(item.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "item-choice";
    button.classList.toggle("active", item.id === profile.equipped[item.category]);
    button.classList.toggle("locked", !unlocked);
    const itemStatus = unlocked
      ? "\u{2713}"
      : `${iconMarkup("cat-gem", "mall-icon cost-icon")}<span>${item.cost}</span>`;
    button.innerHTML = `${iconMarkup(item.iconId, "mall-icon item-art")}<strong>${itemName(item)}</strong><small>${itemStatus}</small>`;
    button.addEventListener("click", () => {
      if (!unlocked) {
        if (points < item.cost) {
          setGuide("needPoints");
          speak(message("needPoints"));
          return;
        }
        points -= item.cost;
        profile.unlocked.push(item.id);
        setGuide("unlocked");
      }
      profile.equipped[item.category] = item.id;
      if (profile.evolution?.gifts) delete profile.evolution.gifts[item.category];
      saveProfile();
      updateProfileVisuals();
      renderCharacterRoom();
    });
    elements.itemGrid.append(button);
  });
  updateProfileVisuals();
}

function sampleWalkers() {
  const selected = selectedCharacter();
  const others = characters.filter((character) => character.id !== selected.id).sort(() => Math.random() - .5);
  return [selected, ...others.slice(0, 2)];
}

function renderWalkers() {
  const evo = getEvolution();
  elements.walkers.replaceChildren();
  sampleWalkers().forEach((character, index) => {
    const walker = document.createElement("div");
    const selected = character.id === profile.character;
    walker.className = `walker route-${["a", "b", "c"][index]}${selected ? " selected" : ""}`;
    const color = selected ? profile.color : "original";
    walker.innerHTML = `<span class="character-sprite sprite-${character.sprite} color-${color}"></span>${selected && primaryEquippedIcon() ? `<span class="walker-item">${iconMarkup(primaryEquippedIcon(), "mall-icon walker-icon")}</span>` : ""}`;
    if (selected) applyCharacterGlow(walker.querySelector(".character-sprite"), evo.stage);
    elements.walkers.append(walker);
  });
}

function moveSelectedWalkerTo(clientX, clientY) {
  const walker = elements.walkers.querySelector(".walker.selected");
  const stage = elements.mapStage;
  if (!walker || !stage) return;
  const rect = stage.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const targetX = Math.min(92, Math.max(6, ((clientX - rect.left) / rect.width) * 100));
  const targetY = Math.min(88, Math.max(14, ((clientY - rect.top) / rect.height) * 100));
  const fromX = parseFloat(walker.dataset.x || "35");
  const fromY = parseFloat(walker.dataset.y || "39");
  const dx = targetX - fromX;
  if (Math.abs(dx) > 1) walker.classList.toggle("facing-left", dx < 0);
  const distance = Math.hypot(targetX - fromX, targetY - fromY);
  const duration = Math.min(5600, Math.max(1000, distance * 62)); // calm stroll, not a dash
  walker.style.setProperty("--walk-duration", `${duration}ms`);
  walker.classList.add("moving");
  walker.style.left = `${targetX}%`;
  walker.style.top = `${targetY}%`;
  walker.dataset.x = String(targetX);
  walker.dataset.y = String(targetY);
  window.clearTimeout(walker._moveTimer);
  walker._moveTimer = window.setTimeout(() => {
    walker.classList.remove("moving");
  }, duration + 80);
}

function handleMapStageClick(event) {
  if (!elements.characterModal.hidden) return;
  if (event.target.closest(".place-hotspot, .map-toolbar, .map-guide, button")) return;
  moveSelectedWalkerTo(event.clientX, event.clientY);
}

function preferredVoice() {
  const locale = { ko: "ko", zh: "zh", ja: "ja", en: "en" }[language];
  const voices = speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith(locale));
  const male = /injoon|hyunsu|bongjin|yunxi|keita|ichiro|david|guy|mark|male/i;
  const female = /sunhi|xiaoxiao|nanami|zira|jenny|aria|susan|samantha|female/i;
  return voices.find((voice) => male.test(voice.name)) || voices.find((voice) => !female.test(voice.name)) || voices[0];
}

function speak(text) {
  if (!audioEnabled || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = preferredVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = { ko: "ko-KR", zh: "zh-CN", ja: "ja-JP", en: "en-US" }[language];
  utterance.pitch = .9;
  utterance.rate = .9;
  speechSynthesis.speak(utterance);
}

let introFinishing = false;

function enterWorldMap() {
  if (onboarding) {
    openCharacterRoom(true);
  } else {
    const focusOrigami = new URLSearchParams(location.search).get("focus") === "origami";
    const target = focusOrigami ? elements.origami : elements.castle;
    target?.classList.add("attention");
    setTimeout(() => target?.classList.remove("attention"), 3700);
  }
}

function finishIntro({ skipGateway = false } = {}) {
  if (introFinishing || !document.body.contains(elements.intro)) return;
  introFinishing = true;
  elements.introVideo.pause();
  elements.intro.classList.add("hide");
  setTimeout(() => elements.intro.remove(), 700);

  if (skipGateway) {
    elements.worldGate?.remove();
    setTimeout(enterWorldMap, 80);
    return;
  }

  elements.worldGate.setAttribute("aria-hidden", "false");
  elements.worldGate.classList.add("show");
  setTimeout(() => elements.worldGate.classList.add("leaving"), 2050);
  setTimeout(() => {
    elements.worldGate.remove();
    enterWorldMap();
  }, 2650);
}

function openCharacterRoom(forceOnboarding = false) {
  onboarding = forceOnboarding || !profile.setupComplete;
  elements.characterModal.classList.toggle("onboarding", onboarding);
  $("#characterTitle").textContent = message(onboarding ? "setupCharacter" : "chooseCharacter");
  elements.saveProfile.textContent = message(onboarding ? "saveProfile" : "updateProfile");
  elements.playerName.value = profile.name;
  elements.characterModal.hidden = false;
  setTimeout(() => elements.playerName.focus({ preventScroll: true }), 80);
}

function closeCharacterRoom() {
  if (onboarding) return;
  elements.characterModal.hidden = true;
}

function completeProfile() {
  const name = elements.playerName.value.trim().replace(/\s+/g, " ").slice(0, 16);
  if (!name) {
    elements.nameHint.textContent = message("nameRequired");
    elements.nameHint.classList.add("error");
    elements.playerName.focus();
    return;
  }
  profile.name = name;
  profile.setupComplete = true;
  onboarding = false;
  elements.nameHint.textContent = message("nameHint");
  elements.nameHint.classList.remove("error");
  saveProfile();
  updateProfileVisuals();
  setGuide("mapGuide");
  elements.characterModal.hidden = true;
  elements.characterModal.classList.remove("onboarding");
  const firstTarget = profile.character === "foldy" ? elements.origami : elements.castle;
  firstTarget?.classList.add("attention");
  setTimeout(() => firstTarget?.classList.remove("attention"), 2900);
}

if (new URLSearchParams(location.search).get("enter") === "1") finishIntro({ skipGateway: true });
elements.skipIntro.addEventListener("click", finishIntro);
elements.introVideo.addEventListener("ended", finishIntro);
elements.introVideo.addEventListener("error", finishIntro);
setTimeout(() => { if (document.body.contains(elements.intro)) finishIntro(); }, 12000);
elements.introSound.addEventListener("click", () => {
  elements.introVideo.muted = !elements.introVideo.muted;
  elements.introSound.textContent = elements.introVideo.muted ? "\u{266a}" : "\u{266b}";
  if (!elements.introVideo.muted) elements.introVideo.play().catch(() => {});
});

elements.castle.addEventListener("click", () => { location.href = "../cube-town/"; });
elements.origami?.addEventListener("click", () => { location.href = "../origami-studio/"; });
// Mirror Manor is a single game rather than a hub, so this hotspot goes straight to
// the game folder, matching the pattern of the two hub hotspots above.
elements.mirrorManor?.addEventListener("click", () => { location.href = "../games/mirror-manor/"; });
// Geoboard Home Yard is a single game rather than a hub, so this hotspot goes
// straight to the game folder, matching the Mirror Manor line above.
elements.geoboardYard?.addEventListener("click", () => { location.href = "../games/geoboard/"; });
// Crystal Plaza is the only hotspot that opens something other than a game:
// the printable worksheet hub. It points at the landing page file explicitly
// (not the folder) so the link works on static hosts without directory
// indexes, which the game folders above get away with because they ship an
// index the host already resolves.
elements.crystalPlaza?.addEventListener("click", () => { location.href = "../lab/index.html"; });
elements.mapStage?.addEventListener("click", handleMapStageClick);
elements.profileButton.addEventListener("click", () => openCharacterRoom(false));
elements.closeCharacter.addEventListener("click", closeCharacterRoom);
elements.characterModal.addEventListener("click", (event) => {
  if (event.target === elements.characterModal) closeCharacterRoom();
});
elements.saveProfile.addEventListener("click", completeProfile);
elements.playerName.addEventListener("input", () => {
  elements.nameHint.textContent = message("nameHint");
  elements.nameHint.classList.remove("error");
});
elements.playerName.addEventListener("keydown", (event) => {
  if (event.key === "Enter") completeProfile();
});
elements.sound.addEventListener("click", () => {
  audioEnabled = !audioEnabled;
  localStorage.setItem("gfield-audio-muted", String(!audioEnabled));
  elements.sound.textContent = audioEnabled ? "\u{266b}" : "\u{266a}";
  elements.sound.setAttribute("aria-pressed", String(audioEnabled));
  if (audioEnabled) speak(message(selectedCharacter().id === "foldy" ? "origamiGuide" : "mapGuide").replace("{name}", profile.name || selectedCharacter().name));
  else speechSynthesis?.cancel();
});
$$("[data-lang]").forEach((button) => button.addEventListener("click", () => {
  language = button.dataset.lang;
  localStorage.setItem("gfield-language", language);
  applyLanguage();
}));
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCharacterRoom();
});

if (matchMedia("(max-aspect-ratio: 4 / 5)").matches) {
  document.querySelector(".world").scrollLeft = Math.round(innerHeight * .035);
}
saveProfile();
updateProfileVisuals();
applyLanguage();
setGuide("mapGuide");
