import { useEffect } from 'react';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { MuiContentEditable, placeHolderSx } from '../styles';
import { Box } from '@mui/material';
import { ToolBar } from '../toolbar/ToolBar';
import lexicalEditorTheme from '../../theme/lexicalEditorTheme';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';

// Lexical React plugins are React components, which makes them highly composable. Furthermore, you can lazy load plugins if desired, so you don't pay the cost for plugins until you  actually use them.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  editor.update(() => {
    console.log(editor.getRootElement());
    // const editor = $getEditor();
    const htmlString = $generateHtmlFromNodes(editor);
    console.clear();
    console.log(htmlString);
  });

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

// Catch any errors that occur during Lexical updates and log them or throw them as needed. If you don't throw them, Lexical will try to recover gracefully without losing user data.
function onError(error: any) {
  console.error(error);
}

export function EditorWrapper() {
  // const [content, setContent] = useState<string | null>('');
  const initialConfig = {
    namespace: 'MyEditor',
    theme: lexicalEditorTheme,
    onError,
  };

  function onChange(editorState: EditorState) {
    editorState.read(() => {
      // const root = $getRoot();
      // setContent(root.__cachedText);
    });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolBar />
        <Box sx={{ position: 'relative', background: 'white', mt: 1 }}>
          <RichTextPlugin
            contentEditable={<MuiContentEditable />}
            placeholder={<Box sx={placeHolderSx}>Ingresa...</Box>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          <MyCustomAutoFocusPlugin />
        </Box>
      </LexicalComposer>
      <button type='submit'>Enviar</button>
    </form>
  );
}
