// src/components/KeywordAnalyzer.jsx

import React, { useState } from 'react';
import { Card, Form, Button, Spinner, Badge, Alert } from 'react-bootstrap';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';

// API function to call our new endpoint
const analyzeResumeKeywords = async (url, { arg }) => {
  const { jobDescription } = arg;
  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
  });
  const { data } = await apiClient.post(url, { jobDescription });
  return data.data;
};

function KeywordAnalyzer({ resumeId }) {
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const { trigger, isMutating, error } = useSWRMutation(
    `/api/resumes/${resumeId}/analyze`,
    analyzeResumeKeywords,
    {
      onSuccess: (data) => {
        setAnalysisResult(data);
      },
      onError: (error) => {
        alert(
          `Analysis failed: ${error.response?.data?.message || error.message}`
        );
      },
    }
  );

  const handleAnalyze = () => {
    trigger({ jobDescription });
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">ATS Keyword Analyzer</Card.Header>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Label>Paste Job Description Here</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            placeholder="Paste the full job description to find missing keywords..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </Form.Group>
        <Button
          onClick={handleAnalyze}
          disabled={isMutating || !jobDescription}
        >
          {isMutating ? <Spinner as="span" size="sm" /> : 'Analyze Keywords'}
        </Button>

        {analysisResult && (
          <div className="mt-4">
            <hr />
            <h5>Analysis Results</h5>
            <div className="mb-3">
              <strong>Missing Keywords:</strong>
              <div className="mt-2">
                {analysisResult.missingKeywords.length > 0 ? (
                  analysisResult.missingKeywords.map((kw) => (
                    <Badge key={kw} pill bg="danger" className="me-1 mb-1">
                      {kw}
                    </Badge>
                  ))
                ) : (
                  <Alert variant="success" className="py-2 mt-1">
                    Excellent! All keywords found.
                  </Alert>
                )}
              </div>
            </div>
            <div>
              <strong>Keywords Found:</strong>
              <div className="mt-2">
                {analysisResult.presentKeywords.map((kw) => (
                  <Badge key={kw} pill bg="success" className="me-1 mb-1">
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default KeywordAnalyzer;
