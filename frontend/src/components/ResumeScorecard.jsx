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
import axios from 'axios';

// API function to call our new scoring endpoint
const fetchResumeScore = async (url) => {
  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
  });
  const { data } = await apiClient.get(url);
  return data.data;
};

function ResumeScorecard({ resumeId }) {
  const {
    data,
    error,
    isLoading,
    mutate: refetch,
  } = useSWR(
    // We use null as the key initially to prevent automatic fetching
    null,
    fetchResumeScore
  );

  // Manual trigger function for fetching score
  const handleAnalyzeResume = async () => {
    try {
      // Manually trigger the SWR request with the proper URL
      await refetch(`/api/resumes/${resumeId}/score`);
    } catch (error) {
      console.error('Failed to analyze resume:', error);
    }
  };

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
            disabled={isLoading}
            className="mb-3 w-100"
          >
            {isLoading ? (
              <Spinner as="span" size="sm" />
            ) : (
              'Analyze & Score My Resume'
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="danger">
            Could not calculate score at this time.
          </Alert>
        )}

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
              {data.feedback.length > 0 ? (
                data.feedback.map((item, index) => (
                  <ListGroup.Item key={index} className="px-0 py-2">
                    - {item}
                  </ListGroup.Item>
                ))
              ) : (
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
