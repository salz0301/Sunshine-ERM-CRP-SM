import { Layout, Typography } from 'antd';
import logo from '@/style/images/logo-sunshine.png';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  return (
    <Content
      style={{
        padding: '120px 30px 30px',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        textAlign: 'center',
      }}
      className="sideContent"
    >
      <Text style={{ fontSize: 16 }}>Es bueno volverte a ver</Text>
      <Title level={2} style={{ margin: '4px 0 30px', fontWeight: 500 }}>
        Bienvenido(a)
      </Title>

      {/* Logo dentro de un círculo blanco */}
      <div
        style={{
          width: 240,
          height: 240,
          margin: '0 auto 24px',
          borderRadius: '50%',
          background: '#fff',
          display: 'grid',
          placeItems: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <img
          src={logo}
          alt="Sunshine Handmade"
          style={{ width: 200, height: 200, borderRadius: '50%', objectFit: 'cover' }}
        />
      </div>

      <Title level={3} style={{ margin: 0 }}>
        Sunshine Handmade
      </Title>
      <Text style={{ fontSize: 12, letterSpacing: '0.3em' }}>NICARAGUA</Text>
    </Content>
  );
}
