// ================================================
// Top5Battle — Main Application
// ================================================

// Firebase Configuration
// Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXXXXXXXX",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// App State
const state = {
  user: null,
  currentPage: 'home',
  battles: [],
  top5List: [],
  loading: true
};

// Demo Data
const demoBattles = [
  {
    id: 'battle-1',
    topic: 'PS5 vs Xbox Series X',
    sideA: {
      name: 'PlayStation 5',
      description: 'Sony\'s next-gen console with exclusive titles like Spider-Man 2 and God of War Ragnarök',
      imageUrls: [
        'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
        'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=400',
        'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400',
        'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=400'
      ],
      voteCount: 1247
    },
    sideB: {
      name: 'Xbox Series X',
      description: 'Microsoft\'s most powerful console with Game Pass and day-one releases',
      imageUrls: [
        'https://images.unsplash.com/photo-1612417944684-7a3b10e3d8e5?w=400',
        'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400',
        'https://images.unsplash.com/photo-1591489574818-72d9c08e7a61?w=400',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400'
      ],
      voteCount: 982
    },
    createdAt: Date.now() - 86400000 * 2,
    endsAt: Date.now() + 86400000 * 5,
    status: 'active',
    views: 5420
  },
  {
    id: 'battle-2',
    topic: 'iPhone vs Samsung Galaxy',
    sideA: {
      name: 'iPhone 15 Pro',
      description: 'Apple\'s flagship with A17 Pro chip and titanium design',
      imageUrls: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400',
        'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400'
      ],
      voteCount: 2103
    },
    sideB: {
      name: 'Samsung S24 Ultra',
      description: 'Samsung\'s AI-powered flagship with S Pen and 200MP camera',
      imageUrls: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
        'https://images.unsplash.com/photo-1670518899121-4a22be7940c8?w=400',
        'https://images.unsplash.com/photo-1676299081847-824916de030a?w=400',
        'https://images.unsplash.com/photo-1666059204472-bbf34c0da3b9?w=400'
      ],
      voteCount: 1876
    },
    createdAt: Date.now() - 86400000 * 4,
    endsAt: Date.now() + 86400000 * 3,
    status: 'active',
    views: 8932
  },
  {
    id: 'battle-3',
    topic: 'Coke vs Pepsi',
    sideA: {
      name: 'Coca-Cola',
      description: 'The classic cola that\'s been refreshing since 1886',
      imageUrls: [
        'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400',
        'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'
      ],
      voteCount: 3241
    },
    sideB: {
      name: 'Pepsi',
      description: 'The bold choice for those who prefer a sweeter cola taste',
      imageUrls: [
        'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400',
        'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
        'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=400',
        'https://images.unsplash.com/photo-1625937329935-287441889d5d?w=400'
      ],
      voteCount: 2897
    },
    createdAt: Date.now() - 86400000 * 6,
    endsAt: Date.now() - 86400000 * 1,
    status: 'closed',
    views: 12450
  }
];

const demoTop5 = [
  {
    id: 'top5-1',
    topic: 'Best Sci-Fi Movies of All Time',
    hook: 'From interstellar adventures to dystopian futures',
    items: [
      { rank: 1, name: 'Interstellar', description: 'Christopher Nolan\'s masterpiece about time and love', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400' },
      { rank: 2, name: 'Blade Runner 2049', description: 'A visually stunning neo-noir sci-fi', imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400' },
      { rank: 3, name: 'The Matrix', description: 'The film that changed action movies forever', imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400' },
      { rank: 4, name: 'Inception', description: 'A dream within a dream within a...', imageUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400' },
      { rank: 5, name: 'Arrival', description: 'Science meets linguistics in this mind-bender', imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400' }
    ],
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'top5-2',
    topic: 'Top 5 Programming Languages 2026',
    hook: 'The most in-demand languages for developers',
    items: [
      { rank: 1, name: 'Python', description: 'AI/ML and data science powerhouse', imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400' },
      { rank: 2, name: 'TypeScript', description: 'JavaScript\'s safer, more scalable cousin', imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400' },
      { rank: 3, name: 'Rust', description: 'Memory safety meets performance', imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400' },
      { rank: 4, name: 'Go', description: 'Google\'s language for scalable backends', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400' },
      { rank: 5, name: 'Swift', description: 'iOS development and beyond', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400' }
    ],
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'top5-3',
    topic: 'Best Productivity Apps',
    hook: 'Tools to supercharge your workflow',
    items: [
      { rank: 1, name: 'Notion', description: 'All-in-one workspace for notes and projects', imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400' },
      { rank: 2, name: 'Linear', description: 'Issue tracking for software teams', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400' },
      { rank: 3, name: 'Obsidian', description: 'Markdown-based knowledge management', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
      { rank: 4, name: 'Raycast', description: 'Spotlight replacement for power users', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400' },
      { rank: 5, name: 'Arc Browser', description: 'The modern web browser reimagined', imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400' }
    ],
    createdAt: Date.now() - 86400000 * 7
  }
];

const demoComments = {
  'battle-1': [
    { id: 'c1', author: 'GamerMike', avatar: '', text: 'PS5 exclusives are just too good to pass up!', time: Date.now() - 3600000 },
    { id: 'c2', author: 'XboxFan2026', avatar: '', text: 'Game Pass value is unmatched. Can\'t beat $15/month for hundreds of games.', time: Date.now() - 7200000 },
    { id: 'c3', author: 'NeutralGamer', avatar: '', text: 'Both are great, depends on which exclusives you prefer honestly.', time: Date.now() - 10800000 }
  ],
  'battle-2': [
    { id: 'c4', author: 'AppleFan', avatar: '', text: 'iOS ecosystem is just too addictive at this point', time: Date.now() - 1800000 },
    { id: 'c5', author: 'AndroidUser', avatar: '', text: 'Samsung\'s camera zoom is insane, 100x space zoom!', time: Date.now() - 5400000 }
  ]
};

// Demo user votes (would normally come from Firebase)
const demoUserVotes = {};

// ================================================
// Router
// ================================================
function router() {
  const hash = window.location.hash || '#/';
  const path = hash.slice(1); // Remove #

  // Parse route
  if (path === '/' || path === '') {
    renderHome();
  } else if (path === '/battles') {
    renderBattles();
  } else if (path.startsWith('/battle/')) {
    const id = path.split('/battle/')[1];
    renderBattle(id);
  } else if (path.startsWith('/results/')) {
    const id = path.split('/results/')[1];
    renderResults(id);
  } else if (path === '/top5') {
    renderTop5List();
  } else if (path.startsWith('/top5/')) {
    const id = path.split('/top5/')[1];
    renderTop5(id);
  } else if (path === '/leaderboard') {
    renderLeaderboard();
  } else if (path === '/profile') {
    renderProfile();
  } else {
    renderHome();
  }

  // Scroll to top
  window.scrollTo(0, 0);

  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', hash.startsWith(link.getAttribute('href')));
  });
}

// ================================================
// Render Functions
// ================================================
function renderHome() {
  const main = document.getElementById('main-content');
  const activeBattles = demoBattles.filter(b => b.status === 'active');
  const recentTop5 = demoTop5.slice(0, 3);

  main.innerHTML = `
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">1v1 <span>Battle Arena</span></h1>
        <p class="hero-subtitle">Vote. Comment. Decide. The ultimate platform for head-to-head battles and curated top-5 lists.</p>
        <div class="hero-buttons">
          <a href="#/battles" class="btn btn-primary">Join a Battle</a>
          <a href="#/top5" class="btn btn-secondary">Explore Top 5</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">🔥 Active Battles</h2>
          <a href="#/battles" class="section-link">View All →</a>
        </div>
        <div class="cards-grid">
          ${activeBattles.map(battle => renderBattleCard(battle)).join('')}
        </div>
      </div>
    </section>

    <section class="section" style="background: var(--bg-secondary);">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">📋 Recent Top 5</h2>
          <a href="#/top5" class="section-link">View All →</a>
        </div>
        <div class="cards-grid">
          ${recentTop5.map(item => renderTop5Card(item)).join('')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container" style="text-align: center;">
        <h2 class="section-title" style="margin-bottom: 16px;">⚔️ Ready to Battle?</h2>
        <p style="color: var(--text-secondary); margin-bottom: 32px; max-width: 500px; margin-left: auto; margin-right: auto;">
          Create your own battle, invite friends, and let the community decide the winner.
        </p>
        <button class="btn btn-primary" onclick="showToast('Coming soon!', 'info')">Create a Battle</button>
      </div>
    </section>
  `;
}

function renderBattleCard(battle) {
  const daysLeft = Math.ceil((battle.endsAt - Date.now()) / 86400000);
  const totalVotes = battle.sideA.voteCount + battle.sideB.voteCount;

  return `
    <a href="#/battle/${battle.id}" class="card">
      <div class="card-image" style="background-image: url('${battle.sideA.imageUrls[0]}'); background-size: cover; background-position: center;"></div>
      <div class="card-body">
        <span class="card-badge ${battle.status}">${battle.status === 'active' ? `${daysLeft}d left` : 'Ended'}</span>
        <h3 class="card-title">${battle.topic}</h3>
        <div class="card-meta">
          <span>🗳️ ${totalVotes} votes</span>
          <span>👁️ ${battle.views.toLocaleString()} views</span>
        </div>
      </div>
    </a>
  `;
}

function renderTop5Card(item) {
  return `
    <a href="#/top5/${item.id}" class="card">
      <div class="card-image" style="background-image: url('${item.items[0].imageUrl}'); background-size: cover; background-position: center;"></div>
      <div class="card-body">
        <span class="card-badge">Top 5</span>
        <h3 class="card-title">${item.topic}</h3>
        <div class="card-meta">
          <span>📝 ${item.items.length} items</span>
        </div>
      </div>
    </a>
  `;
}

function renderBattles() {
  const main = document.getElementById('main-content');
  const allBattles = [...demoBattles].sort((a, b) => b.views - a.views);

  main.innerHTML = `
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h1 class="section-title">⚔️ All Battles</h1>
        </div>
        <div class="search-container">
          <div class="search-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" class="search-input" placeholder="Search battles..." id="battle-search">
          </div>
        </div>
        <div class="cards-grid" id="battles-grid">
          ${allBattles.map(battle => renderBattleCard(battle)).join('')}
        </div>
      </div>
    </section>
  `;

  // Search functionality
  document.getElementById('battle-search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = allBattles.filter(b =>
      b.topic.toLowerCase().includes(query) ||
      b.sideA.name.toLowerCase().includes(query) ||
      b.sideB.name.toLowerCase().includes(query)
    );
    document.getElementById('battles-grid').innerHTML = filtered.map(b => renderBattleCard(b)).join('');
  });
}

function renderBattle(id) {
  const battle = demoBattles.find(b => b.id === id);
  if (!battle) {
    render404('Battle not found');
    return;
  }

  const main = document.getElementById('main-content');
  const comments = demoComments[id] || [];
  const daysLeft = Math.ceil((battle.endsAt - Date.now()) / 86400000);
  const totalVotes = battle.sideA.voteCount + battle.sideB.voteCount;
  const userVote = demoUserVotes[id];
  const isActive = battle.status === 'active';
  const hasVoted = !!userVote;

  main.innerHTML = `
    <section class="battle-container">
      <div class="battle-header">
        <h1 class="battle-topic">${battle.topic}</h1>
        <div class="battle-countdown">
          ⏰ ${isActive ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left to vote` : 'Voting ended'}
        </div>
      </div>

      <div class="battle-sides">
        <div class="side-card ${userVote === 'A' ? 'winner' : ''}">
          <div class="side-header">
            <h2 class="side-name">${battle.sideA.name}</h2>
            <p class="side-desc">${battle.sideA.description}</p>
          </div>
          <div class="side-images">
            ${battle.sideA.imageUrls.map((url, i) => `
              <img src="${url}" alt="${battle.sideA.name}" class="side-image" loading="lazy">
            `).join('')}
          </div>
          <div class="side-votes">
            <div class="vote-count">${battle.sideA.voteCount.toLocaleString()}</div>
            <div class="vote-label">votes ${hasVoted ? `(${Math.round(battle.sideA.voteCount / totalVotes * 100)}%)` : ''}</div>
            ${isActive ? `
              <button class="btn btn-primary vote-btn ${hasVoted && userVote === 'A' ? 'voted' : ''}"
                      onclick="vote('${id}', 'A')"
                      ${hasVoted ? 'disabled' : ''}>
                ${hasVoted && userVote === 'A' ? '✓ Voted' : 'Vote for A'}
              </button>
            ` : ''}
          </div>
        </div>

        <div class="battle-vs">VS</div>

        <div class="side-card ${userVote === 'B' ? 'winner' : ''}">
          <div class="side-header">
            <h2 class="side-name">${battle.sideB.name}</h2>
            <p class="side-desc">${battle.sideB.description}</p>
          </div>
          <div class="side-images">
            ${battle.sideB.imageUrls.map((url, i) => `
              <img src="${url}" alt="${battle.sideB.name}" class="side-image" loading="lazy">
            `).join('')}
          </div>
          <div class="side-votes">
            <div class="vote-count">${battle.sideB.voteCount.toLocaleString()}</div>
            <div class="vote-label">votes ${hasVoted ? `(${Math.round(battle.sideB.voteCount / totalVotes * 100)}%)` : ''}</div>
            ${isActive ? `
              <button class="btn btn-primary vote-btn ${hasVoted && userVote === 'B' ? 'voted' : ''}"
                      onclick="vote('${id}', 'B')"
                      ${hasVoted ? 'disabled' : ''}>
                ${hasVoted && userVote === 'B' ? '✓ Voted' : 'Vote for B'}
              </button>
            ` : ''}
          </div>
        </div>
      </div>

      <div class="share-section">
        <button class="share-btn" onclick="shareBattle('${id}', '${battle.topic}')">
          🔗 Copy Link
        </button>
        <button class="share-btn" onclick="shareTwitter('${battle.topic}')">
          🐦 Share on X
        </button>
      </div>

      <div class="comments-section">
        <div class="comments-header">
          <h3 class="comments-title">💬 Comments (${comments.length})</h3>
        </div>
        <div class="comment-form">
          <textarea placeholder="${state.user ? 'Share your thoughts...' : 'Login to comment'}" ${!state.user ? 'disabled' : ''}></textarea>
          <button class="btn btn-primary" onclick="postComment('${id}')" ${!state.user ? 'disabled' : ''}>
            ${state.user ? 'Post Comment' : 'Login to Comment'}
          </button>
        </div>
        <div class="comments-list">
          ${comments.map(c => `
            <div class="comment">
              <div class="comment-avatar" style="display: flex; align-items: center; justify-content: center; font-weight: bold;">
                ${c.author.charAt(0).toUpperCase()}
              </div>
              <div class="comment-body">
                <div class="comment-author">${c.author}</div>
                <div class="comment-text">${c.text}</div>
                <div class="comment-time">${formatTimeAgo(c.time)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // Track page view
  gtag('event', 'page_view', { page_title: `Battle: ${battle.topic}` });
}

function renderResults(id) {
  const battle = demoBattles.find(b => b.id === id);
  if (!battle) {
    render404('Results not found');
    return;
  }

  const main = document.getElementById('main-content');
  const totalVotes = battle.sideA.voteCount + battle.sideB.voteCount;
  const aPercent = Math.round(battle.sideA.voteCount / totalVotes * 100);
  const bPercent = Math.round(battle.sideB.voteCount / totalVotes * 100);
  const winner = battle.sideA.voteCount > battle.sideB.voteCount ? battle.sideA : battle.sideB;
  const winnerSide = battle.sideA.voteCount > battle.sideB.voteCount ? 'A' : 'B';

  main.innerHTML = `
    <section class="results-container">
      <div class="results-header">
        <h1 class="section-title">🏆 Results</h1>
        <p style="color: var(--text-secondary); margin-top: 8px;">${battle.topic}</p>
      </div>

      <div class="results-winner">
        <div class="winner-badge">🏆 Winner</div>
        <h2 class="winner-name">${winner.name}</h2>
        <div class="winner-votes">${winner.voteCount.toLocaleString()} votes (${winnerSide === 'A' ? aPercent : bPercent}%)</div>
      </div>

      <div class="results-breakdown">
        <div class="breakdown-card">
          <h3 class="breakdown-name">${battle.sideA.name}</h3>
          <div class="breakdown-count">${battle.sideA.voteCount.toLocaleString()}</div>
          <div class="breakdown-bar">
            <div class="breakdown-fill" style="width: ${aPercent}%"></div>
          </div>
          <div style="margin-top: 8px; color: var(--text-muted);">${aPercent}%</div>
        </div>
        <div class="breakdown-card">
          <h3 class="breakdown-name">${battle.sideB.name}</h3>
          <div class="breakdown-count">${battle.sideB.voteCount.toLocaleString()}</div>
          <div class="breakdown-bar">
            <div class="breakdown-fill" style="width: ${bPercent}%"></div>
          </div>
          <div style="margin-top: 8px; color: var(--text-muted);">${bPercent}%</div>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="#/battles" class="btn btn-secondary">← Back to All Battles</a>
      </div>
    </section>
  `;
}

function renderTop5List() {
  const main = document.getElementById('main-content');

  main.innerHTML = `
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h1 class="section-title">📋 All Top 5 Lists</h1>
        </div>
        <div class="search-container">
          <div class="search-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" class="search-input" placeholder="Search top 5 lists..." id="top5-search">
          </div>
        </div>
        <div class="cards-grid" id="top5-grid">
          ${demoTop5.map(item => renderTop5Card(item)).join('')}
        </div>
      </div>
    </section>
  `;

  document.getElementById('top5-search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = demoTop5.filter(item =>
      item.topic.toLowerCase().includes(query) ||
      item.items.some(i => i.name.toLowerCase().includes(query))
    );
    document.getElementById('top5-grid').innerHTML = filtered.map(item => renderTop5Card(item)).join('');
  });
}

function renderTop5(id) {
  const item = demoTop5.find(t => t.id === id);
  if (!item) {
    render404('Top 5 not found');
    return;
  }

  const main = document.getElementById('main-content');

  main.innerHTML = `
    <section class="top5-container">
      <div class="top5-header">
        <h1 class="top5-topic">${item.topic}</h1>
        <p class="top5-hook">${item.hook}</p>
      </div>

      <div class="top5-list">
        ${item.items.map(i => `
          <div class="top5-item" onclick="toggleTop5Item(this)">
            <div class="top5-item-header">
              <div class="top5-rank">#${i.rank}</div>
              <img src="${i.imageUrl}" alt="${i.name}" class="top5-item-image" loading="lazy">
              <div class="top5-item-info">
                <div class="top5-item-name">${i.name}</div>
                <div class="top5-item-desc">${i.description}</div>
              </div>
              <div class="top5-item-expand">▼</div>
            </div>
            <div class="top5-item-content">
              <p class="top5-full-desc">${i.description} — Ranked #${i.rank} in our definitive list of ${item.topic.toLowerCase()}.</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="text-align: center; margin-top: 48px;">
        <a href="#/top5" class="btn btn-secondary">← Back to All Lists</a>
      </div>
    </section>
  `;

  gtag('event', 'page_view', { page_title: `Top 5: ${item.topic}` });
}

function renderLeaderboard() {
  const main = document.getElementById('main-content');
  const sortedBattles = [...demoBattles].sort((a, b) => b.views - a.views);

  main.innerHTML = `
    <section class="leaderboard-container">
      <div class="section-header">
        <h1 class="section-title">🏅 Leaderboard</h1>
      </div>

      <div class="leaderboard-table">
        ${sortedBattles.map((battle, i) => {
          const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
          const totalVotes = battle.sideA.voteCount + battle.sideB.voteCount;
          return `
            <a href="#/battle/${battle.id}" class="leaderboard-row">
              <div class="leaderboard-rank ${rankClass}">#${i + 1}</div>
              <div class="leaderboard-topic">${battle.topic}</div>
              <div class="leaderboard-views">👁️ ${battle.views.toLocaleString()}</div>
              <div class="leaderboard-votes">🗳️ ${totalVotes.toLocaleString()}</div>
            </a>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderProfile() {
  const main = document.getElementById('main-content');

  if (!state.user) {
    main.innerHTML = `
      <section class="profile-container">
        <div class="empty-state">
          <div class="empty-state-icon">👤</div>
          <h3>Sign in to view your profile</h3>
          <p style="color: var(--text-secondary); margin: 16px 0;">Track your votes, comments, and activity</p>
          <button class="btn btn-primary" onclick="openLoginModal()">Login</button>
        </div>
      </section>
    `;
    return;
  }

  const userVotes = Object.keys(demoUserVotes).length;
  const userComments = 5; // Demo value

  main.innerHTML = `
    <section class="profile-container">
      <div class="profile-header">
        <img src="${state.user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(state.user.displayName || 'U')}&background=ff6b35&color=fff`}" alt="Profile" class="profile-avatar">
        <div class="profile-info">
          <h2>${state.user.displayName || 'Anonymous'}</h2>
          <p>${state.user.email}</p>
        </div>
      </div>

      <div class="profile-stats">
        <div class="profile-stat">
          <div class="profile-stat-value">${userVotes}</div>
          <div class="profile-stat-label">Votes Cast</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-value">${userComments}</div>
          <div class="profile-stat-label">Comments</div>
        </div>
        <div class="profile-stat">
          <div class="profile-stat-value">12</div>
          <div class="profile-stat-label">Battles Viewed</div>
        </div>
      </div>

      <div class="profile-tabs">
        <button class="profile-tab active" onclick="showProfileTab('votes')">Recent Votes</button>
        <button class="profile-tab" onclick="showProfileTab('comments')">Comments</button>
      </div>

      <div class="profile-activity" id="profile-activity">
        ${renderActivityItems()}
      </div>
    </section>
  `;
}

function renderActivityItems() {
  const items = [
    { icon: '🗳️', text: 'Voted for PlayStation 5 in "PS5 vs Xbox Series X"', time: '2 hours ago' },
    { icon: '💬', text: 'Commented on "iPhone vs Samsung Galaxy"', time: '1 day ago' },
    { icon: '👁️', text: 'Viewed results of "Coke vs Pepsi"', time: '3 days ago' },
    { icon: '🗳️', text: 'Voted for Coca-Cola in "Coke vs Pepsi"', time: '5 days ago' }
  ];

  return items.map(item => `
    <div class="activity-item">
      <div class="activity-icon">${item.icon}</div>
      <div class="activity-details">
        <div class="activity-text">${item.text}</div>
        <div class="activity-time">${item.time}</div>
      </div>
    </div>
  `).join('');
}

function showProfileTab(tab) {
  document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  // In a real app, this would switch between tabs
}

function render404(message) {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <section class="empty-state" style="padding: 120px 20px;">
      <div class="empty-state-icon">🔍</div>
      <h3>${message}</h3>
      <p style="color: var(--text-secondary); margin: 16px 0;">The page you're looking for doesn't exist</p>
      <a href="#/" class="btn btn-primary">Go Home</a>
    </section>
  `;
}

// ================================================
// Interactions
// ================================================
function vote(battleId, side) {
  if (!state.user) {
    openLoginModal();
    showToast('Please login to vote', 'error');
    return;
  }

  if (demoUserVotes[battleId]) {
    showToast('You\'ve already voted!', 'error');
    return;
  }

  demoUserVotes[battleId] = side;
  showToast('Vote recorded! 🎉', 'success');
  triggerConfetti();

  // Re-render battle page to show updated state
  setTimeout(() => renderBattle(battleId), 500);

  // Track event
  gtag('event', 'vote', {
    battle_id: battleId,
    voted_side: side
  });
}

function postComment(battleId) {
  if (!state.user) {
    openLoginModal();
    return;
  }

  const textarea = document.querySelector('.comment-form textarea');
  const text = textarea.value.trim();

  if (!text) return;

  // In a real app, this would save to Firebase
  showToast('Comment posted!', 'success');
  textarea.value = '';

  gtag('event', 'comment', { battle_id: battleId });
}

function toggleTop5Item(element) {
  element.classList.toggle('expanded');
}

function shareBattle(id, topic) {
  const url = `${window.location.origin}${window.location.pathname}#/battle/${id}`;
  navigator.clipboard.writeText(url).then(() => {
    showToast('Link copied to clipboard!', 'success');
  });

  gtag('event', 'share', { battle_id: id, method: 'copy_link' });
}

function shareTwitter(topic) {
  const text = encodeURIComponent(`Check out this battle: ${topic} ⚔️`);
  const url = encodeURIComponent(window.location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  gtag('event', 'share', { topic, method: 'twitter' });
}

// ================================================
// Auth
// ================================================
function openLoginModal() {
  document.getElementById('login-modal').classList.remove('hidden');
}

function closeLoginModal() {
  document.getElementById('login-modal').classList.add('hidden');
}

function updateAuthUI(user) {
  state.user = user;

  const loading = document.getElementById('auth-loading');
  const loggedOut = document.getElementById('auth-logged-out');
  const loggedIn = document.getElementById('auth-logged-in');
  const userAvatar = document.getElementById('user-avatar');
  const mobileAuth = document.getElementById('mobile-auth');

  loading.classList.add('hidden');

  if (user) {
    loggedOut.classList.add('hidden');
    loggedIn.classList.remove('hidden');
    userAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=ff6b35&color=fff`;
    mobileAuth.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; padding: 12px;">
        <img src="${user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=ff6b35&color=fff`}" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%;">
        <span>${user.displayName || 'User'}</span>
      </div>
    `;

    gtag('event', 'login', { method: user.providerData[0]?.providerId || 'unknown' });
  } else {
    loggedOut.classList.remove('hidden');
    loggedIn.classList.add('hidden');
    mobileAuth.innerHTML = '<button class="btn btn-primary" onclick="openLoginModal()">Login</button>';
  }
}

async function signInWithGoogle() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
    closeLoginModal();
    showToast('Welcome! 🎉', 'success');
  } catch (error) {
    showToast('Login failed: ' + error.message, 'error');
  }
}

async function signInWithGitHub() {
  try {
    const provider = new firebase.auth.GithubAuthProvider();
    await auth.signInWithPopup(provider);
    closeLoginModal();
    showToast('Welcome! 🎉', 'success');
  } catch (error) {
    showToast('Login failed: ' + error.message, 'error');
  }
}

async function signInWithEmail() {
  const email = document.getElementById('email-input').value;
  const password = document.getElementById('password-input').value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
    closeLoginModal();
    showToast('Welcome back! 👋', 'success');
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      // Auto-create account
      try {
        const result = await auth.createUserWithEmailAndPassword(email, password);
        showToast('Account created! 🎉', 'success');
        closeLoginModal();
      } catch (createError) {
        showToast('Sign up failed: ' + createError.message, 'error');
      }
    } else {
      showToast('Login failed: ' + error.message, 'error');
    }
  }
}

async function signOut() {
  try {
    await auth.signOut();
    showToast('Logged out', 'success');
    router();
  } catch (error) {
    showToast('Logout failed', 'error');
  }
}

// ================================================
// UI Helpers
// ================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
    <span class="toast-message">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function triggerConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  const colors = ['#ff6b35', '#ff9f5a', '#ffd700', '#00c853', '#4285F4'];

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.width = (Math.random() * 10 + 5) + 'px';
    confetti.style.height = confetti.style.width;
    container.appendChild(confetti);
  }

  setTimeout(() => container.remove(), 3500);
}

function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
});

// ================================================
// Event Listeners
// ================================================
window.addEventListener('hashchange', router);

window.addEventListener('DOMContentLoaded', () => {
  // Listen for auth state changes
  auth.onAuthStateChanged(updateAuthUI);

  // Initial route
  router();
});

// Button event listeners (delegated)
document.addEventListener('click', (e) => {
  if (e.target.id === 'login-btn' || e.target.closest('#login-btn')) {
    openLoginModal();
  }
  if (e.target.id === 'login-modal-close' || e.target.closest('#login-modal-close')) {
    closeLoginModal();
  }
  if (e.target.id === 'google-login' || e.target.closest('#google-login')) {
    signInWithGoogle();
  }
  if (e.target.id === 'github-login' || e.target.closest('#github-login')) {
    signInWithGitHub();
  }
  if (e.target.id === 'logout-btn' || e.target.closest('#logout-btn')) {
    signOut();
  }
});

document.getElementById('email-login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  signInWithEmail();
});

// Close modal on overlay click
document.getElementById('login-modal').addEventListener('click', (e) => {
  if (e.target.id === 'login-modal') {
    closeLoginModal();
  }
});

// Global functions for onclick handlers
window.vote = vote;
window.postComment = postComment;
window.toggleTop5Item = toggleTop5Item;
window.shareBattle = shareBattle;
window.shareTwitter = shareTwitter;
window.openLoginModal = openLoginModal;
window.showToast = showToast;
