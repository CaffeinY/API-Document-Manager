import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

interface Document {
  id: string;
  title: string;
  originalFilename: string;
  createdAt: string;
  fileSize: number;
}

const HomePage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch documents list from backend
  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/docs`);
      setDocuments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch documents');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Format file size in a human readable form
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format ISO date string to local date time string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Handler for viewing a document: fetch content and navigate to viewer page
  const handleViewClick = async (doc: Document) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/docs/${doc.id}`);
      navigate('/doc/' + doc.id, { 
        state: { 
          spec: response.data.content,
          docId: doc.id,
        } 
      });
    } catch (error) {
      console.error('Error fetching document content:', error);
      setError('Failed to load document');
    }
  };

  // Handler for editing a document: fetch content and navigate to editor page
  const handleEditClick = async (doc: Document) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/docs/${doc.id}`);
      navigate('/editor', { 
        state: { 
          yamlContent: response.data.content,
          docId: doc.id,
        } 
      });
    } catch (error) {
      console.error('Error fetching document content:', error);
      setError('Failed to load document');
    }
  };

  // Handler for deleting a document
  const handleDeleteClick = async (doc: Document) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await axios.delete(`${API_BASE_URL}/docs/${doc.id}`);
        setDocuments(documents.filter(d => d.id !== doc.id));
      } catch (error) {
        console.error('Error deleting document:', error);
        setError('Failed to delete document');
      }
    }
  };

  // Handler for renaming/updating document title
  const handleRenameClick = async (doc: Document) => {
    const newTitle = window.prompt('Please enter a new title:', doc.title);
    if (newTitle && newTitle !== doc.title) {
      try {
        await axios.put(`${API_BASE_URL}/docs/${doc.id}`, { title: newTitle });
        // Update the local document list state
        setDocuments(prevDocs =>
          prevDocs.map(d => d.id === doc.id ? { ...d, title: newTitle } : d)
        );
        alert('Title updated successfully');
      } catch (error) {
        console.error('Failed to update title:', error);
        setError('Failed to update title');
      }
    }
  };

  // Handler for file upload using a file input
  const handleUploadClick = async () => {
    try {
      const file: File = await new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.yaml,.yml';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) {
            reject(new Error('No file selected'));
            return;
          }
          resolve(file);
        };
        input.click();
      });

      // Prompt user for title
      const title = window.prompt("Please enter the title:", "");
      if (!title) {
        throw new Error("Title is required");
      }

      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("title", title);

      const response = await axios.post(`${API_BASE_URL}/docs/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Upload successful!");
      fetchDocuments();
    } catch (error) {
      console.error("Error uploading document:", error);
      setError("Failed to upload document");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading documents...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1>OpenAPI Documents</h1>
        <button
          onClick={() => handleUploadClick()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Upload New Document
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div style={{ 
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        backgroundColor: 'white',
      }}>
        {/* Header row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '3fr 2fr 1fr 2fr 100px',
          padding: '12px 20px',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #e0e0e0',
          fontWeight: 'bold',
        }}>
          <div>Title</div>
          <div>Filename</div>
          <div>Size</div>
          <div>Upload Date</div>
          <div>Action</div>
        </div>

        {/* Document list */}
        {documents.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#666' 
          }}>
            <p>No documents uploaded yet.</p>
            <button
              onClick={() => handleUploadClick()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Upload Your First Document
            </button>
          </div>
        ) : (
          documents.map((doc, index) => (
            <div
              key={doc.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '3fr 2fr 1fr 2fr 100px',
                padding: '12px 20px',
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: index % 2 === 0 ? 'white' : '#fafafa',
                alignItems: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#fafafa'}
            >
              {/* Title cell with the Rename button next to it */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#2c3e50', fontWeight: '500', marginRight: '8px' }}>
                  {doc.title}
                </span>
                <button
                  onClick={() => handleRenameClick(doc)}
                  style={{
                    padding: '4px 6px',
                    backgroundColor: '#FF9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🖊
                </button>
              </div>

              <div style={{ color: '#666' }}>{doc.originalFilename}</div>
              <div style={{ color: '#666' }}>{formatFileSize(doc.fileSize)}</div>
              <div style={{ color: '#666' }}>{formatDate(doc.createdAt)}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => handleViewClick(doc)}
                  style={{
                    padding: '4px 6px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    marginRight: '3px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  View
                </button>
                <button
                  onClick={() => handleEditClick(doc)}
                  style={{
                    padding: '4px 6px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    marginRight: '3px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(doc)}
                  style={{
                    padding: '4px 6px',
                    backgroundColor: '#e53935',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
