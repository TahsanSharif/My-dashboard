import React from 'react';
import { exhibit01Pic } from '../exhibitsConfig';

interface EuropeanNightsPavilionProps {
  onActivatePreset?: () => void;
  isActive?: boolean;
  hideHeader?: boolean;
  hideSummarySections?: boolean;
  customImage?: string;
}

export const EuropeanNightsPavilion: React.FC<EuropeanNightsPavilionProps> = ({
  onActivatePreset,
  isActive = false,
  hideHeader = false,
  hideSummarySections = false,
  customImage,
}) => {
  const displayImage =
    customImage ||
    (typeof window !== 'undefined'
      ? (() => {
          const saved = localStorage.getItem('cr7_exhibit_01_custom_image');
          if (saved && !saved.startsWith('/input_file_0.png') && !saved.startsWith('blob:')) {
            return saved;
          }
          return exhibit01Pic;
        })()
      : exhibit01Pic);
  return (
    <div className="museum-exhibit-pavilion" data-theme="european-nights">
      {/* Pavilion Header Banner */}
      {!hideHeader && (
        <div className="pavilion-header">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="exhibit-tag">OFFICIAL UEFA ARCHIVE</span>
            {onActivatePreset && (
              <button
                type="button"
                onClick={onActivatePreset}
                className="pavilion-activate-chip"
                title="Activate European Nights Theme"
              >
                <span>{isActive ? '✓ ACTIVE: MR. CHAMPIONS LEAGUE' : 'ACTIVATE THEME'}</span>
              </button>
            )}
          </div>
          <h2>Mr. Champions League</h2>
          <p>The definitive statistical legacy of Cristiano Ronaldo</p>
        </div>
      )}

      {/* Hero Image */}
      {!hideHeader && (
        <div className="exhibit-image-wrapper my-3 rounded-xl overflow-hidden border border-blue-500/30 flex items-center justify-center bg-[#050a14]">
          <img
            src={displayImage}
            alt="Cristiano Ronaldo Champions League 5 Titles"
            className="exhibit-hero-img w-full object-contain"
            style={{
              width: '100%',
              height: '100%',
              maxHeight: '380px',
              objectFit: 'contain',
              objectPosition: 'center',
              display: 'block',
            }}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = exhibit01Pic;
            }}
          />
        </div>
      )}

      {/* Core Career Statistics Grid & Club Breakdown */}
      {!hideSummarySections && (
        <>
          <div className="pavilion-section">
            <h3 className="section-title">🏆 Career Glance Metrics</h3>
            <div className="stats-card-grid">
              <div className="stat-badge-box">
                <span className="stat-number">183</span>
                <span className="stat-label">Appearances (All-Time Record)</span>
              </div>
              <div className="stat-badge-box">
                <span className="stat-number">140</span>
                <span className="stat-label">Goals Scored (All-Time #1)</span>
              </div>
              <div className="stat-badge-box">
                <span className="stat-number">5</span>
                <span className="stat-label">Titles Won (Modern Era Record)</span>
              </div>
              <div className="stat-badge-box">
                <span className="stat-number">7</span>
                <span className="stat-label">Top-Scorer Seasons (Record)</span>
              </div>
            </div>
          </div>

          <div className="pavilion-section">
            <h3 className="section-title">📊 Club & Phase Breakdown</h3>
            <ul className="pavilion-list">
              <li><strong>Real Madrid UCL Goals:</strong> 105 goals.</li>
              <li><strong>Manchester United UCL Goals:</strong> 21 goals.</li>
              <li><strong>Juventus UCL Goals:</strong> 14 goals.</li>
              <li><strong>Knockout-Stage Mastery:</strong> 67 goals (all-time record).</li>
              <li><strong>Hat-Trick Prowess:</strong> 8 hat-tricks (joint all-time record with Lionel Messi).</li>
              <li><strong>Single-Season Peak:</strong> 17 goals in the 2013/14 campaign (all-time record).</li>
              <li><strong>Scoring Streak:</strong> 11 consecutive scoring appearances (all-time record).</li>
              <li><strong>Finals Record:</strong> 6 final appearances (2008, 2009, 2014, 2016, 2017, 2018) with 4 goals scored across 3 different finals.</li>
              <li><strong>Milestone Record:</strong> First player to reach 100 Champions League goals (achieved in April 2017).</li>
              <li><strong>Group Stage Mastery:</strong> Scored in all 6 group-stage matches in a single campaign (one of only two players to ever achieve this).</li>
              <li><strong>Shared Glory:</strong> Shared the 2014–15 top-scorer award with Lionel Messi and Neymar (10 goals).</li>
              <li><strong>Modern Era Milestone:</strong> First player to win the Champions League five times in the modern era (completed in 2018).</li>
            </ul>
          </div>
        </>
      )}

      {/* The 5 Champions League Trophies Timeline */}
      <div className="pavilion-section">
        <h3 className="section-title">👑 The 5 Champions League Crowns</h3>
        <div className="timeline-container">
          <div className="timeline-item">
            <span className="timeline-year">2007–08</span>
            <p><strong>Manchester United:</strong> Defeated Chelsea in the final, 6–5 on penalties after a 1–1 draw.</p>
          </div>
          <div className="timeline-item">
            <span className="timeline-year">2013–14</span>
            <p><strong>Real Madrid:</strong> Defeated Atlético Madrid 4–1 after extra time to secure La Décima.</p>
          </div>
          <div className="timeline-item">
            <span className="timeline-year">2015–16</span>
            <p><strong>Real Madrid:</strong> Defeated Atlético Madrid on penalties after a 1–1 draw.</p>
          </div>
          <div className="timeline-item">
            <span className="timeline-year">2016–17</span>
            <p><strong>Real Madrid:</strong> Defeated Juventus 4–1.</p>
          </div>
          <div className="timeline-item">
            <span className="timeline-year">2017–18</span>
            <p><strong>Real Madrid:</strong> Defeated Liverpool 3–1 to complete the three-peat.</p>
          </div>
        </div>
      </div>

      {/* Top-Scorer Awards Table */}
      <div className="pavilion-section">
        <h3 className="section-title">🥇 Top-Scorer Golden Boot Seasons</h3>
        <div className="pavilion-table-wrapper">
          <table className="pavilion-table">
            <thead>
              <tr>
                <th>Season</th>
                <th>Goals</th>
                <th>Club</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>2007–08</td><td>8</td><td>Manchester United</td></tr>
              <tr><td>2012–13</td><td>12</td><td>Real Madrid</td></tr>
              <tr className="record-season-row"><td>2013–14</td><td>17</td><td>Real Madrid (Record)</td></tr>
              <tr><td>2014–15</td><td>10</td><td>Real Madrid (Shared)</td></tr>
              <tr><td>2015–16</td><td>16</td><td>Real Madrid</td></tr>
              <tr><td>2016–17</td><td>12</td><td>Real Madrid</td></tr>
              <tr><td>2017–18</td><td>15</td><td>Real Madrid</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Major Individual UEFA Honors */}
      <div className="pavilion-section">
        <h3 className="section-title">⭐ Major Individual UEFA Awards</h3>
        <ul className="pavilion-list">
          <li><strong>2007–08:</strong> UEFA Club Footballer of the Year & Club Forward of the Year.</li>
          <li><strong>2013–14 & 2015–16:</strong> UEFA Best Player in Europe.</li>
          <li><strong>2016–17:</strong> UEFA Men's Player of the Year & Champions League Forward of the Season.</li>
          <li><strong>2017–18:</strong> UEFA Champions League Forward of the Season.</li>
          <li><strong>2024:</strong> UEFA Champions League All-Time Top Scorer Special Award.</li>
          <li><strong>Team of the Year:</strong> 15 appearances in UEFA.com's Team of the Year (record).</li>
        </ul>
      </div>

      {/* Historical Scope Footnote */}
      <div className="pavilion-footer-note">
        <p><em>*These are historical figures from UEFA's career statistics; career totals exclude qualifying rounds.</em></p>
      </div>
    </div>
  );
};
