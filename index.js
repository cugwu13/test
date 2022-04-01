// Player class to hold stats
class Player {
    constructor(first, last, stats) {
        this.first = first;
        this.last = last;
        this.stats = stats
    }

    get fullName() {
        return `${this.first} ${this.last}`;
    }

    isPlayer(player) {
        return player.firstName.toLowerCase() === this.first.toLowerCase()
                && player.lastName.toLowerCase() === this.last.toLowerCase();
    }

    async getPlayerId() {
        const response = await fetch('http://data.nba.net/data/10s/prod/v1/2021/players.json',
            {mode: 'cors'}
        );
        const data = await response.json();
        const players = data.league.standard;
        const id = players.filter(this.isPlayer.bind(this))[0].personId;

        return id;
    }

    async getPlayerPic() {
        const id = await this.getPlayerId();
        const pic = await fetch(`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${id}.png`);
    
        return pic.url;
    }
}

// Factory fucntion used to manipulate DOM
const DOMInterface = (() => {
    const stats1 = {
        pts: 30.1,
        reb: 7.3,
        ast: 4.1,
        fg_pct: .50,
        fg3_pct: .30,
        ft_pct: .70,
    }

    const stats2 = {
        pts: 26.4,
        reb: 8.0,
        ast: 3.2,
        fg_pct: .48,
        fg3_pct: .42,
        ft_pct: .88,
    }

    const player1 = new Player('LeBron', 'James', stats1);
    const player2 = new Player('Kevin', 'Durant', stats2);
    player1.getPlayerPic();
    player2.getPlayerPic();

    // Top-level content container
    const contentContainer = document.querySelector('.content-container');

    // Function to be run on page load
    const loadDOM = () => {
        const compareStats = document.querySelector('#compare-stats');
        compareStats.addEventListener('click', async function() {
            await compareBtnEL();
        });
    }

    // General fade in animation for elements
    function fadeIn(el) {
        el.style.opacity = 0;
        (function fade() {
            let val = parseFloat(el.style.opacity);
            if (!((val += .1) > 1)) {
                el.style.opacity = val;
                requestAnimationFrame(fade)
            }
        })();
    };

    // General fade out animation for elements
    function fadeOut(el) {
        el.style.opacity = 1;
        (function fade() {
            if ((el.style.opacity -= .1) < 0) {
                el.style.display = 'none';
            } else {
                requestAnimationFrame(fade);
            }
        })();
    };

    function clearContent() {
        const content = document.querySelector('.content');
        fadeOut(content);
    }

    function compareBtnEL() {
        clearContent();
        setTimeout(async function() {
            createCardContainer();
            await populateCardContainer([player1, player2]);
        }, 500);
    }

    function createCardContainer() {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');
        contentContainer.appendChild(cardContainer);
    }

    function populateCardContainer(playerList) {
        const cardContainer = document.querySelector('.card-container');
        playerList.forEach(async function(player) {
            const card = await createPlayerCard(player);
            cardContainer.appendChild(card);
        });
        fadeIn(cardContainer);
    }

    async function createPlayerCard(player) {
        const outerDiv = document.createElement('div');
        const innerDiv = document.createElement('div');
        const name = document.createElement('h3');
        const img = new Image();
        img.src = await player.getPlayerPic();

        name.textContent = player.fullName;
        innerDiv.append(
            img,
            name,
            createStatItem(player, 'PPG', 'pts'),
            createStatItem(player, 'REB', 'reb'),
            createStatItem(player, 'APG', 'ast'),
            createStatItem(player, 'FG%', 'fg_pct'),
            createStatItem(player, '3PT%', 'fg3_pct'),
            createStatItem(player, 'FT%', 'ft_pct'),
        );
        innerDiv.classList.add('stat-card');
        outerDiv.appendChild(innerDiv);
        outerDiv.classList.add('stat-card-border');

        return outerDiv;
    }

    function createStatItem(player, statName, statKey) {
        const div = document.createElement('div');
        const key = document.createElement('p');
        const val = document.createElement('p');

        div.append(key, val);
        div.classList.add('stat-item');
        key.textContent = statName;
        key.style.fontWeight = 'bold';
        val.textContent = player.stats[statKey];

        return div;
    }

    return { loadDOM };
})();

DOMInterface.loadDOM();

async function test() {
    function isPlayer(player) {
        return player.firstName.toLowerCase() === 'lebron'
            && player.lastName.toLowerCase() === 'james';
    }

    const response = await fetch('http://data.nba.net/data/10s/prod/v1/2021/players.json',
        {mode: 'cors'}
    );
    const data = await response.json();
    const players = data.league.standard;
    const lebron = players.filter(isPlayer);
    console.log(lebron);
}
