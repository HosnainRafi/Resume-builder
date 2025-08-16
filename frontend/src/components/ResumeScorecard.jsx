// src/components/ResumeScorecard.jsx

import React from 'react';
import {
  Card,
  Button,
  Spinner,
  ListGroup,
  ProgressBar,
  Alert,
} from 'react-bootstrap';
import useSWR from 'swr';
// import axios from 'axios';
import apiClient from '../api/apiClient';

// API function to call our scoring endpoint
const fetchResumeScore = async (url) => {
  // const apiClient = axios.create({
  //   baseURL: import.meta.env.VITE_API_BASE_URL,
  //   withCredentials: true,
  // });
  const { data } = await apiClient.get(url);
  return data.data; // This data object should contain { score, feedback }
};

function ResumeScorecard({ resumeId }) {
  // Use useSWR to automatically fetch data when resumeId is available.
  // The key (first argument) can be null initially to prevent fetching
  // until resumeId is provided. Once resumeId exists, it will fetch.
  const {
    data, // The fetched data ({ score, feedback })
    error, // Any error during fetching
    isLoading, // True while fetching
    mutate: refetch, // SWR's revalidation function
  } = useSWR(
    resumeId ? `/api/resumes/${resumeId}/score` : null, // SWR key: fetches only if resumeId exists
    fetchResumeScore, // The fetcher function
    {
      revalidateOnFocus: false, // Optional: prevent re-fetching on window focus for this component
      revalidateOnMount: true, // Optional: re-fetch when component mounts (after resumeId is set)
      shouldRetryOnError: false, // Optional: do not retry if an error occurs
    }
  );

  // Manual trigger function for fetching score (used by the button)
  const handleAnalyzeResume = async () => {
    try {
      // Calling refetch() without arguments tells SWR to revalidate the current key.
      // This will trigger a new fetch to `/api/resumes/${resumeId}/score`.
      await refetch();
    } catch (error) {
      console.error('Failed to analyze resume:', error);
      // You might want to display a user-friendly error message here in the UI
    }
  };

  // Helper function to determine ProgressBar variant based on score
  const getScoreVariant = (score) => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Resume Analysis</Card.Header>
      <Card.Body>
        <div className="text-center">
          <Button
            onClick={handleAnalyzeResume}
            // Disable button while loading or if no resumeId is available
            disabled={isLoading || !resumeId}
            className="mb-3 w-100"
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Analyzing...
              </>
            ) : (
              'Analyze & Score My Resume'
            )}
          </Button>
        </div>

        {/* Display error message if fetching fails */}
        {error && (
          <Alert variant="danger">
            Could not calculate score at this time. Please try again.
          </Alert>
        )}

        {/* Display score and feedback only if data is available */}
        {data && (
          <div>
            <h4 className="text-center mb-0">Score: {data.score} / 100</h4>
            <ProgressBar
              animated
              now={data.score}
              variant={getScoreVariant(data.score)}
              className="mb-3"
              style={{ height: '10px' }}
            />
            <h6>Actionable Feedback:</h6>
            <ListGroup variant="flush">
              {/* Check if feedback array has items */}
              {data.feedback && data.feedback.length > 0 ? (
                data.feedback.map((item, index) => (
                  <ListGroup.Item key={index} className="px-0 py-2">
                    - {item}
                  </ListGroup.Item>
                ))
              ) : (
                // Message when there's no specific feedback (i.e., resume is solid)
                <ListGroup.Item className="text-success px-0 py-2">
                  Excellent! Your resume looks solid.
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default ResumeScorecard;
