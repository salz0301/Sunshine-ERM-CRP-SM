import React from 'react';
import { Layout, Row, Col } from 'antd';
export default function AuthLayout({ sideContent, children }) {
  return (
    <Layout>
      <Row>
        <Col
          xs={{ span: 0, order: 2 }}
          sm={{ span: 0, order: 2 }}
          md={{ span: 11, order: 1 }}
          lg={{ span: 12, order: 1 }}
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #2FBFAE 0%, #1E8478 100%)',
          }}
        >
          {sideContent}
        </Col>
        <Col
          xs={{ span: 24, order: 1 }}
          sm={{ span: 24, order: 1 }}
          md={{ span: 13, order: 2 }}
          lg={{ span: 12, order: 2 }}
          style={{ background: '#FFF', minHeight: '100vh' }}
        >
          {children}
        </Col>
      </Row>
    </Layout>
  );
}
