import React, { useState } from 'react';
import { exhibit01Pic } from '../exhibitsConfig';

export default function Exhibit01Manager() {
  // State for image source (defaults to your uploaded trophy photo)
  const [exhibitImage, setExhibitImage] = useState<string>(exhibit01Pic);
  
  // State for controlling the outside card crop focus (Vertical percentage 0% to 100%)
  const [focalY, setFocalY] = useState<number>(20); 
  
  // Toggle to show/hide the custom upload & crop controls
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Handle custom photo upload from your device
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setExhibitImage(imageUrl);
    }
  };

  return (
    <div className="exhibit-manager-wrapper">
      
      {/* ================= OUTSIDE CARD PREVIEW ================= */}
      <div className="museum-card" data-exhibit="01">
        <div className="card-hero-image-wrapper" style={{ position: 'relative' }}>
          
          <img 
            src={exhibitImage} 
            alt="Mr. Champions League" 
            className="card-preview-img"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              objectPosition: `center ${focalY}%`, // Dynamically shifts the outside viewable portion!
              display: 'block'
            }}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = exhibit01Pic;
            }}
          />

          {/* Quick trigger button on the card to adjust upload/cropping */}
          <button 
            type="button"
            className="config-photo-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(!isEditing);
            }}
            title="Upload or Adjust Outside Crop"
          >
            ⚙️ Edit Image
          </button>
        </div>

        <div className="card-content">
          <h3>Mr. Champions League</h3>
          <p className="card-subtitle">Official UEFA Archive • 140 Goals</p>
        </div>
      </div>


      {/* ================= UPLOAD & CROP CONTROL MODAL/PANEL ================= */}
      {isEditing && (
        <div 
          className="photo-config-overlay"
          onClick={() => setIsEditing(false)}
        >
          <div 
            className="photo-config-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-1">Exhibit 01 Photo & Display Customizer</h3>
            <p className="text-sm text-slate-300">Upload your photo and drag the slider to choose exactly what appears on the outside card thumbnail.</p>

            {/* File Uploader */}
            <div className="upload-box">
              <label htmlFor="custom-exhibit-upload" className="upload-label">
                📁 Choose New Photo from Device
              </label>
              <input 
                id="custom-exhibit-upload"
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                style={{ display: 'none' }}
              />
            </div>

            {/* Live Cropping Slider Control */}
            <div className="crop-slider-group">
              <label className="text-sm text-slate-200">
                Outside Thumbnail Focal Point (Vertical Position: <strong className="text-blue-400">{focalY}%</strong>)
              </label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={focalY} 
                onChange={(e) => setFocalY(Number(e.target.value))} 
                className="focal-range-slider"
              />
              <span className="slider-hint">0% = Top of photo | 50% = Center | 100% = Bottom</span>
            </div>

            {/* Live Preview Comparison */}
            <div className="config-preview-row">
              <div className="mini-preview flex flex-col gap-1.5">
                <span className="text-xs text-slate-300 font-semibold">Outside Thumbnail Preview:</span>
                <div className="mini-card-thumb border border-blue-500/40 bg-[#050a14]" style={{ height: '120px', overflow: 'hidden', borderRadius: '8px' }}>
                  <img 
                    src={exhibitImage} 
                    alt="Thumbnail preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center ${focalY}%` }}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src.includes('input_file_0.png')) {
                        target.src = '/image.png';
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <button 
              type="button"
              className="close-config-btn" 
              onClick={() => setIsEditing(false)}
            >
              Save & Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
