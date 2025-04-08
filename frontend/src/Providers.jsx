import { App as AntdApp, ConfigProvider, notification } from "antd";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { theme } from "@/config/theme.js";
import { store } from "@/store/store.js";
import { useEffect } from "react";
import ukUA from 'antd/locale/uk_UA';

export function Providers({ children }) {

  useEffect(() => {
    notification.config({
      placement: 'bottomRight',
    });
  }, [])

  return (
    <ConfigProvider locale={ukUA} theme={theme}>
      <AntdApp>
        <BrowserRouter>
          <Provider store={store}>
            {children}
          </Provider>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  )
}