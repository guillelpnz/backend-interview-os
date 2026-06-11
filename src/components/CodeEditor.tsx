import Editor from '@monaco-editor/react'

type CodeEditorProps = {
  value: string
  onChange: (value: string) => void
  darkMode: boolean
  height?: string
}

export function CodeEditor({ value, onChange, darkMode, height = 'clamp(520px, 58vh, 720px)' }: CodeEditorProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      <Editor
        height={height}
        defaultLanguage="python"
        language="python"
        theme={darkMode ? 'vs-dark' : 'light'}
        value={value}
        onChange={(nextValue) => onChange(nextValue ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize: 15,
          lineHeight: 23,
          lineNumbers: 'on',
          lineNumbersMinChars: 3,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          wordWrap: 'on',
          wrappingIndent: 'same',
          glyphMargin: false,
          folding: false,
          overviewRulerLanes: 0,
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  )
}
