import sweetsImage from '../assets/sweets.jpg'
import '../index.css'

const AuthSidebar = () => {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      background: '#fff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${sweetsImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.9
      }}></div>
      
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        color: '#fff',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '40px',
        borderRadius: '12px',
        backdropFilter: 'blur(4px)'
      }}>
        <h1 style={{
          fontSize: '56px',
          fontWeight: 900,
          marginBottom: '16px',
          letterSpacing: '-1px',
          textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
          fontFamily: 'Arial, sans-serif'
        }}>
          Sweet Shop
        </h1>
        <p style={{
          fontSize: '22px',
          fontStyle: 'italic',
          marginTop: '24px',
          opacity: 0.95,
          fontWeight: 500,
          textShadow: '1px 1px 4px rgba(0,0,0,0.3)'
        }}>
          "Life is short, make it sweet"
        </p>
      </div>
    </div>
  )
}

export default AuthSidebar
