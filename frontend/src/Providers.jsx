import { App as AntdApp, ConfigProvider } from "antd";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { theme } from "@/config/theme.js";
import { store } from "@/store/store.js";

export function Providers({ children }) {
  return (
    <ConfigProvider theme={theme}>
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