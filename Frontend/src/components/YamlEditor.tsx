import React from 'react';

interface YamlEditorProps {
  content: string;
  onChange: (newContent: string) => void;
}

const YamlEditor: React.FC<YamlEditorProps> = ({ content, onChange }) => {
  return (
    <div className="yaml-editor">
      <div className="yaml-header">
        <h3>YAML 编辑器</h3>
        <p className="yaml-hint">编辑内容后右侧会自动更新</p>
      </div>
      <textarea
        className="yaml-content"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        placeholder="在此编辑 YAML 内容..."
      />
    </div>
  );
};

export default YamlEditor; 