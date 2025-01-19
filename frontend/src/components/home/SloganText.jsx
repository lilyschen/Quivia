import React from 'react';

const SloganText = ({ isAuthenticated, user, loginWithRedirect, handleNavigate }) => {
  return (
    <div className="text-box" style={{
      background: 'transparent',
      position: 'relative',
      minHeight: '400px',
      padding: '40px',
      backdropFilter: 'blur(4px)'
    }}>
      {/* Galaxy background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0a192f',
        overflow: 'hidden',
        zIndex: 0
      }}>
        {/* Stars layer */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(1px 1px at 10px 10px, white, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 50px 50px, white, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 100px 100px, white, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 150px 150px, white, rgba(0,0,0,0))
          `,
          backgroundSize: '200px 200px',
          animation: 'twinkle 4s ease-in-out infinite'
        }} />
        
        {/* Galaxy nebula effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 30% 50%, rgba(147, 51, 234, 0.3), transparent 40%),
            radial-gradient(circle at 70% 50%, rgba(59, 130, 246, 0.3), transparent 40%)
          `,
          opacity: 0.7
        }} />
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        <h1 className="slogan-text" style={{
          color: '#ffffff',
          textShadow: '0 0 10px rgba(255,255,255,0.5)',
          marginBottom: '30px'
        }}>
          Turn Notes into Fun: Create and Learn Together!
        </h1>

        {!isAuthenticated ? (
          <button 
            className="get-started-btn"
            onClick={loginWithRedirect}
            style={{
              background: 'linear-gradient(45deg, #FF69B4, #FFB6C1)',
              color: 'white',
              border: 'none',
              transform: 'scale(1.1)'
            }}
          >
            Get Started
          </button>
        ) : (
          <>
            <p style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: '20px' }}>
              Glad you could join us {user?.name}!
            </p>
            <button 
              className="upload-btn"
              onClick={handleNavigate}
              style={{
                background: 'linear-gradient(45deg, #FF69B4, #FFB6C1)',
                color: 'white',
                border: 'none'
              }}
            >
              Begin Studying
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SloganText;