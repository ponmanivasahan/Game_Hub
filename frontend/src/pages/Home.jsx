import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Calendar, Sparkles, ArrowRight, Compass, MessageSquare } from 'lucide-react';
import GameHero from '../components/games/GameHero';
import GameCard from '../components/games/GameCard';
import ThreadCard from '../components/forum/ThreadCard';
import DeveloperHomeView from '../components/home/DeveloperHomeView';
import AdminHomeView from '../components/home/AdminHomeView';
import GamerWelcomeBar from '../components/home/GamerWelcomeBar';
import { gameService } from '../services/gameService';
import { forumService } from '../services/forumService';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [previewStorefront, setPreviewStorefront] = useState(false);

  const [featuredGames, setFeaturedGames] = useState([]);
  const [trendingGames, setTrendingGames] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [recentThreads, setRecentThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [featured, trending, upcoming, allGames, threads] = await Promise.all([
          gameService.getFeatured(6),
          gameService.getTrending(4),
          gameService.getUpcoming(4),
          gameService.getGames({ limit: 4, sort: 'newest' }),
          forumService.getRecentThreads(4)
        ]);

        setFeaturedGames(featured || []);
        setTrendingGames(trending || []);
        setUpcomingGames(upcoming || []);
        setRecentGames(allGames?.games || []);
        setRecentThreads(threads || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  if (isAuthenticated && user?.role === 'developer' && !previewStorefront) {
    return (
      <DeveloperHomeView
        user={user}
        onSwitchToStorefront={() => setPreviewStorefront(true)}
      />
    );
  }

  if (isAuthenticated && user?.role === 'admin' && !previewStorefront) {
    return (
      <AdminHomeView
        user={user}
        onSwitchToStorefront={() => setPreviewStorefront(true)}
      />
    );
  }

  const heroGame = featuredGames.length > 0 ? featuredGames[0] : null;

  return (
    <div>
      <GamerWelcomeBar
        user={user}
        isStorefrontPreview={previewStorefront}
        onReturnToRoleHome={() => setPreviewStorefront(false)}
      />

      {heroGame && <GameHero game={heroGame} />}

      <div className="container" style={{ paddingTop: '3.5rem' }}>
        {featuredGames.length > 1 && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <div className="section-tag">Curated Selection</div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Featured Indie Titles</h2>
              </div>
              <Link to="/discover" className="btn btn-outline btn-sm">
                <span>View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid-games">
              {featuredGames.slice(1, 4).map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        )}

        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <div className="section-tag" style={{ color: '#f97316' }}>
                <Flame size={13} style={{ display: 'inline', verticalAlign: '-1px' }} /> Hot Right Now
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Trending This Week</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Games with the highest community engagement and reviews over the past 7 days.
              </p>
            </div>
            <Link to="/trending" className="btn btn-outline btn-sm">
              <span>View Leaderboard</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-games">
            {trendingGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <div className="section-tag" style={{ color: 'var(--accent-cyan)' }}>
                <Calendar size={13} style={{ display: 'inline', verticalAlign: '-1px' }} /> Future Horizons
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Upcoming Anticipated Games</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Mark your calendars for these highly anticipated indie launches.
              </p>
            </div>
            <Link to="/upcoming" className="btn btn-outline btn-sm">
              <span>All Upcoming</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-games">
            {upcomingGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <div className="section-tag">Fresh In The Catalog</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Recently Added</h2>
            </div>
            <Link to="/discover?sort=newest" className="btn btn-outline btn-sm">
              <span>Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-games">
            {recentGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <div className="section-tag" style={{ color: 'var(--accent-purple)' }}>
                <MessageSquare size={13} style={{ display: 'inline', verticalAlign: '-1px' }} /> Gamer Forums
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Community Discussions</h2>
            </div>
            <Link to="/community" className="btn btn-outline btn-sm">
              <span>Visit Boards</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div>
            {recentThreads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
