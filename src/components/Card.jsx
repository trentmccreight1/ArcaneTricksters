import React from 'react';

const Card = ({ card, onClick, scale = 1, isSelected = false, canAttack = false, isValidTarget = false, isDying = false }) => {
  const { id, name, type, mana, attack, health, description, currentHealth } = card;
  
  const handleClick = () => {
    if (onClick) {
      onClick(card);
    }
  };

  // Calculate dimensions based on scale
  const cardWidth = Math.round(192 * scale); // w-48 = 192px
  const cardHeight = Math.round(256 * scale); // h-64 = 256px
  
  return (
    <div 
      className={`
        relative bg-gradient-to-b from-amber-100 to-amber-200 
        border-4 rounded-lg shadow-card 
        hover:shadow-card-hover transform transition-all duration-300
        cursor-pointer select-none overflow-hidden
        ${isSelected ? 'border-green-400 ring-4 ring-green-400/50 scale-110' : 'border-card-border'}
        ${canAttack ? 'hover:ring-2 hover:ring-green-400 border-green-300' : ''}
        ${isValidTarget ? 'border-red-400 ring-4 ring-red-400/50' : ''}
        ${isDying ? 'opacity-50 scale-90' : 'hover:scale-105'}
        ${onClick ? 'hover:ring-2 hover:ring-yellow-400' : ''}
      `}
      style={{ 
        width: `${cardWidth}px`, 
        height: `${cardHeight}px` 
      }}
      onClick={handleClick}
    >
      {/* Card Frame */}
      <div className="absolute inset-1 bg-gradient-to-b from-amber-50 to-amber-100 rounded border border-amber-300">
        
        {/* Mana Cost */}
        <div 
          className="absolute bg-mana-blue rounded-full border-2 border-white shadow-lg flex items-center justify-center"
          style={{
            width: `${32 * scale}px`, 
            height: `${32 * scale}px`,
            top: `${-8 * scale}px`,
            left: `${-8 * scale}px`,
            fontSize: `${14 * scale}px`
          }}
        >
          <span className="text-white font-bold">{mana}</span>
        </div>

        {/* Card Name */}
        <div className="px-2 text-center" style={{ marginTop: `${16 * scale}px` }}>
          <h3 
            className="font-fantasy font-semibold text-gray-800 truncate"
            style={{ fontSize: `${14 * scale}px` }}
          >
            {name}
          </h3>
        </div>

        {/* Card Art Placeholder */}
        <div 
          className="mx-2 bg-gradient-to-br from-slate-300 to-slate-400 rounded border border-slate-500 flex items-center justify-center"
          style={{ 
            marginTop: `${8 * scale}px`,
            height: `${80 * scale}px` 
          }}
        >
          <div className="text-slate-600 text-center">
            <div 
              className="bg-slate-500 rounded-full mx-auto mb-1"
              style={{
                width: `${32 * scale}px`,
                height: `${32 * scale}px`
              }}
            ></div>
            <span style={{ fontSize: `${12 * scale}px` }}>Card Art</span>
          </div>
        </div>

        {/* Card Type */}
        <div className="px-2" style={{ marginTop: `${8 * scale}px` }}>
          <div className="text-center bg-amber-300 rounded py-1 border border-amber-400">
            <span 
              className="font-medium text-gray-700"
              style={{ fontSize: `${12 * scale}px` }}
            >
              {type}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="px-2 flex-1" style={{ marginTop: `${8 * scale}px` }}>
          <div 
            className="bg-white/50 rounded p-2 border border-amber-300 overflow-hidden"
            style={{ height: `${64 * scale}px` }}
          >
            <p 
              className="text-gray-700 leading-tight"
              style={{ fontSize: `${12 * scale}px` }}
            >
              {description}
            </p>
          </div>
        </div>

        {/* Attack and Health (for Minions) */}
        {type === 'Minion' && (
          <>
            {/* Attack */}
            <div 
              className="absolute bg-attack-orange rounded-full border-2 border-white shadow-lg flex items-center justify-center"
              style={{
                width: `${32 * scale}px`, 
                height: `${32 * scale}px`,
                bottom: `${-8 * scale}px`,
                left: `${-8 * scale}px`,
                fontSize: `${14 * scale}px`
              }}
            >
              <span className="text-white font-bold">{attack}</span>
            </div>
            
            {/* Health */}
            <div 
              className={`absolute rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                currentHealth !== undefined && currentHealth < health ? 'bg-orange-600' : 'bg-health-red'
              }`}
              style={{
                width: `${32 * scale}px`, 
                height: `${32 * scale}px`,
                bottom: `${-8 * scale}px`,
                right: `${-8 * scale}px`,
                fontSize: `${14 * scale}px`
              }}
            >
              <span className="text-white font-bold">
                {currentHealth !== undefined ? currentHealth : health}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Attack Ready Indicator */}
      {canAttack && type === 'Minion' && (
        <div className="absolute top-0 right-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center transform translate-x-2 -translate-y-2 z-10">
          <span className="text-white text-xs font-bold">⚔️</span>
        </div>
      )}

      {/* Summoning Sickness Overlay */}
      {card.summoningSickness && type === 'Minion' && (
        <div className="absolute inset-0 bg-gray-500/40 rounded-lg flex items-center justify-center">
          <div className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-bold">
            💤 Summoning Sickness
          </div>
        </div>
      )}

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 rounded-lg ${
        isValidTarget ? 'bg-red-200/40 opacity-100' : 'bg-yellow-200/20 opacity-0 hover:opacity-100'
      }`}></div>
    </div>
  );
};

export default Card; 