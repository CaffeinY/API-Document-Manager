import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface SwaggerViewerProps {
  spec: any;
}

const SwaggerViewer: React.FC<SwaggerViewerProps> = ({ spec }) => {
  return (
    <div className="swagger-viewer">
      <SwaggerUI spec={spec} />
    </div>
  );
};

export default SwaggerViewer; 