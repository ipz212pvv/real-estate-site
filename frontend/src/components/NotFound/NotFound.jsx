import { Button, Result } from 'antd';
import { Link } from "react-router";

export function NotFound() {
  return (
    <Result
      status="404"
      title="Cторінку не знайдено"
      extra={
        <Link to="/">
          <Button type="primary" size="large">
            На головну
          </Button>
        </Link>
      }
    />
  );

}