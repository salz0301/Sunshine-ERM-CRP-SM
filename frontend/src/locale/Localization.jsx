import { useState, useEffect } from 'react';

import { ConfigProvider, theme } from 'antd';

import { useSelector } from 'react-redux';

import { selectLangState } from '@/redux/translate/selectors';

import antdLocale from './antdLocale';

export default function Localization({ children }) {
  const { langCode, langDirection } = useSelector(selectLangState);

  const [locale, setLocal] = useState();
  const [direction, setDirection] = useState();

  useEffect(() => {
    const lang = antdLocale[langCode];
    setDirection(langDirection);
    setLocal(lang);
  }, [langCode]);

  return (
    <ConfigProvider
      direction={direction}
      locale={locale}
      theme={{
        // algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#2FBFAE', // turquesa de marca
          colorLink: '#1E8478',
          colorLinkHover: '#2FBFAE',
          colorSuccess: '#16A34A',
          colorWarning: '#D4801A',
          colorError: '#DC2626',
          colorInfo: '#2563EB',
          colorTextBase: '#111827',
          colorBgLayout: '#E8E8E8',
          fontFamily: "'Figtree', ui-sans-serif, system-ui, sans-serif",
          borderRadius: 8,
          borderRadiusLG: 12,
        },
        components: {
          // Botones principales en vino (como los CTA de Sunshine)
          Button: { colorPrimary: '#6B4343', algorithm: true },
          // Ítem activo del menú en arena
          Menu: {
            itemSelectedBg: '#E9BF80',
            itemSelectedColor: '#111827',
            itemHoverBg: 'rgba(0, 0, 0, 0.05)',
            itemBorderRadius: 0,
            itemMarginInline: 0,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
