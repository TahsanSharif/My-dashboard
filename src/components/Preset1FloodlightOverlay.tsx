import React from 'react';

export const Preset1FloodlightOverlay: React.FC = () => {
  return (
    <div
      id="preset1-floodlight-overlay"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none"
      style={{ zIndex: 0 }}
    >
      {/* Ambient stadium atmosphere wash */}
      <div className="floodlight-atmosphere-wash" />

      {/* Top gantry stadium lighting glow */}
      <div className="floodlight-gantry-glow" />

      {/* Left stadium floodlight tower sweeping cone */}
      <div className="floodlight-beam-left" />

      {/* Right stadium floodlight tower sweeping cone */}
      <div className="floodlight-beam-right" />
    </div>
  );
};
