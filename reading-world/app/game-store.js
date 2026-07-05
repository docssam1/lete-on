// GameStore — normalized game state (avatar + town) kept per userId.
// The heavy lifting of persistence is done by window.Store (localStorage +
// best-effort Supabase, keyed by studentId/userId); GameStore only defines the
// shape and gives typed accessors + migration, so nothing is hardcoded to
// localStorage and the model can move to a dedicated backend later.
//
// AvatarState = {
//   baseBody, hair, face, top, bottom, accessory, bag,   // slot ids (see mapping)
//   equippedItems: { [slot]: itemId },                   // canonical equipped map
//   unlockedItems: string[]                              // "category:id" keys owned
// }
// Slot ↔ closet-category mapping (phase 1 art):
//   baseBody=skin · hair=hair(style) · face=(reserved) · top=clothes ·
//   bottom=(reserved) · accessory=glasses · bag=pet · (hat, haircolor also in equippedItems)
//
// TownState = {
//   townLayout,                    // id of the fixed map ("reading-town-v1")
//   placedDecorations: { [slotId]: decorationId },
//   unlockedDecorations: string[],
//   coins,                         // === learning points (coins are earned by learning)
//   completedLessons: string[]     // lessonIds finished (all three modes done)
// }
window.GameStore = (function () {
  const TOWN_LAYOUT = 'reading-town-v1';
  // decoration slots on the fixed map (filled in phase 2.2)
  const DECOR_SLOTS = ['gate', 'pond', 'garden', 'lamp', 'bench', 'sign'];

  function defaultTown() {
    return { townLayout: TOWN_LAYOUT, placedDecorations: {}, unlockedDecorations: [], coins: 0, completedLessons: [] };
  }

  // Bring any legacy profile up to the normalized shape (idempotent).
  function migrate(profile) {
    if (!profile) return profile;
    // avatar: `equipped`/`owned` stay canonical (the rest of the app writes them);
    // `equippedItems`/`unlockedItems` mirror the SAME references (the spec names).
    profile.avatar = profile.avatar || {};
    profile.avatar.equipped = profile.avatar.equipped || profile.avatar.equippedItems || {};
    profile.avatar.owned = Array.isArray(profile.avatar.owned) ? profile.avatar.owned : (Array.isArray(profile.avatar.unlockedItems) ? profile.avatar.unlockedItems : []);
    profile.avatar.equippedItems = profile.avatar.equipped;
    profile.avatar.unlockedItems = profile.avatar.owned;
    // town
    profile.town = Object.assign(defaultTown(), profile.town || {});
    // coins are the same currency as learning points
    profile.town.coins = profile.points || profile.town.coins || 0;
    return profile;
  }

  const coins = (p) => (p ? (p.points || 0) : 0);
  function addCoins(p, n) { if (!p || n <= 0) return; p.points = (p.points || 0) + n; if (p.town) p.town.coins = p.points; }
  function spendCoins(p, n) { if (!p || n <= 0) return false; if ((p.points || 0) < n) return false; p.points -= n; if (p.town) p.town.coins = p.points; return true; }

  function markLessonComplete(p, lessonId) {
    if (!p) return; migrate(p);
    if (lessonId && !p.town.completedLessons.includes(lessonId)) p.town.completedLessons.push(lessonId);
  }
  const completedLessons = (p) => (p && p.town ? p.town.completedLessons : []) || [];

  // decoration API (used by phase 2.2)
  function unlockDecoration(p, id) { migrate(p); if (!p.town.unlockedDecorations.includes(id)) p.town.unlockedDecorations.push(id); }
  function placeDecoration(p, slot, id) { migrate(p); if (DECOR_SLOTS.includes(slot)) p.town.placedDecorations[slot] = id; }

  return { TOWN_LAYOUT, DECOR_SLOTS, defaultTown, migrate, coins, addCoins, spendCoins, markLessonComplete, completedLessons, unlockDecoration, placeDecoration };
})();
