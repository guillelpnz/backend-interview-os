import Editor from '@monaco-editor/react'

type CodeEditorProps = {
  value: string
  onChange: (value: string) => void
  darkMode: boolean
}

export function CodeEditor({ value, onChange, darkMode }: CodeEditorProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      <Editor
        height="420px"
        defaultLanguage="python"
        language="python"
        theme={darkMode ? 'vs-dark' : 'light'}
        value={value}
        onChange={(nextValue) => onChange(nextValue ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          wordWrap: 'on',
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  )
}
