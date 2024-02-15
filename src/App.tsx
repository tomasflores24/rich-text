import { ThemeProvider } from '@emotion/react';
import { EditorWrapper } from './components/richText/RichText';
import theme from './theme';
import { CssBaseline, Grid, Typography } from '@mui/material';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid
        container
        sx={{ minHeight: '100vh', mt: 10 }}
        alignItems='center'
        flexDirection='column'
      >
        <Grid item>
          <Typography variant='h3'>Editar</Typography>
        </Grid>
        <Grid item xs={9} sx={{ width: '100%', mt: 5 }}>
          <EditorWrapper />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
