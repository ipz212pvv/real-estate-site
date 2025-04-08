import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

import styles from "./Loading.module.css";

export function Loading(props) {
  return <Spin
    wrapperClassName={styles["nested-spinner"]}
    style={{ width: "100%", margin: "0 auto" }}
    indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
    {...props}
  />;
}