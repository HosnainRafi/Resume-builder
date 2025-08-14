import React from 'react';
import { Button, Alert } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to show the fallback UI on next render.
    console.log(error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to a reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    // Reset the error state
    this.setState({ hasError: false });
    // Trigger the remount function passed from the parent
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Render the fallback UI when a crash is caught
      return (
        <Alert variant="danger" className="h-100 d-flex flex-column">
          <Alert.Heading>PDF Preview Crashed</Alert.Heading>
          <p className="flex-grow-1">
            An error occurred while updating the PDF. This is a known issue with
            the library. Please reload the preview to continue.
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={this.handleReset} variant="danger">
              Reload Preview
            </Button>
          </div>
        </Alert>
      );
    }

    // If there's no error, render the children as normal
    return this.props.children;
  }
}

export default ErrorBoundary;
