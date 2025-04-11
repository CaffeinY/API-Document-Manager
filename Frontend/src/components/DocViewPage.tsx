import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import yaml from 'js-yaml';
import SwaggerViewer from './SwaggerViewer';

import { API_BASE_URL } from '../config';


interface Document {
    id: string;
    title: string;
    content: string; // Assuming the content is a string (YAML or JSON)
    originalFilename: string;
    createdAt: string;
    fileSize: number;
}

const DocViewPage: React.FC = () => {
  const { id } = useParams(); // Extract document id from the URL path (e.g., /doc/:id)
  const navigate = useNavigate();
    const [document, setDocument] = useState<Document>();
  const [spec, setSpec] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch and parse document content when the page loads
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/docs/${id}`);
        setDocument(response.data);

        // Try to parse the content (assume it's YAML by default, fallback to JSON if it fails)
        let parsedSpec: any;

        try {
          parsedSpec = await yaml.load(response.data.content);
          
        } catch (yamlErr) {
          // If YAML parsing fails, try to use JSON.parse instead
          try {
            parsedSpec = JSON.parse(document?.content || '');
          } catch (jsonErr) {
            setError('Failed to parse document content. Please check the document format.');
            return;
          }
        }

        setSpec(parsedSpec);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to load document content');
      }
    };

    fetchDocument();
  }, [id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top navigation bar */}
      <div style={{
        padding: '10px 20px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '8px 15px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back
        </button>
        <h2 style={{ margin: 0 }}>{document?.title}</h2>
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : spec ? (
          <SwaggerViewer spec={spec} />
        ) : (
          'Loading...'
        )}
      </div>
    </div>
  );
};

export default DocViewPage;
