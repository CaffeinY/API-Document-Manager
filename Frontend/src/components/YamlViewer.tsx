import React from 'react';

interface YamlViewerProps {
  content: string;
  onChange: (newContent: string) => void;
}

const YamlViewer: React.FC<YamlViewerProps> = ({ content, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="yaml-viewer">
      <div className="yaml-header">
        <h3>YAML 内容</h3>
        <p className="yaml-hint">可以直接编辑内容，右侧会实时更新</p>
      </div>
      <textarea
        className="yaml-content"
        value={content}
        onChange={handleChange}
        spellCheck={false}
      />
    </div>
  );
};

export default YamlViewer; 