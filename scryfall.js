export async function markdownScryfallLlink(cardname){
    function sanitizeString(str) {
        return str
            .trim()
            .replace(/\s+/g, "+")          // replace spaces with +
            .replace(/[^a-zA-Z0-9+]/g, ""); // remove non-alphanumeric (keep +)
        }
    const apiUrl = `https://api.scryfall.com/cards/named?exact=${sanitizeString(cardname)}`
    let scryfalUrl = ''
    await fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            scryfalUrl = data.scryfall_uri
        })
        .catch(err => {
            console.error(err);
        });
    return `[${cardname}](${scryfalUrl})`
}

export async function findSetReleasedOn(targetDate){
    const apiUrl = `https://api.scryfall.com/sets`
    const blacklist = [
        'alchemy',
        'masterpiece',
        'arsenal',
        'duel_deck',
        'treasure_chest',
        'funny',
        'box',
        'minigame',
        'token',     
        'memorabilia',
        'promo'
    ]
    const sets = await fetch(apiUrl).then(response => response.json()).data

    const filteredSets = sets.filter(set =>
        set.released_at === targetDate &&
        !blacklist.includes(set.set_type)
    );
    return filteredSets
}
