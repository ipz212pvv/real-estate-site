import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <p>Ой, сталася непередбачувана помилка</p>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };