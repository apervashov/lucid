import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FormulaInput } from './components/FormulaInput';
import './App.css';

// Create React Query client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#fafafa', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '1rem',
        boxSizing: 'border-box',
        width: '100%',
        margin: '0 auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '60rem',
          margin: '0 auto',
          padding: '2rem',
          boxSizing: 'border-box'
        }}>
          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '600', 
            marginBottom: '1.5rem', 
            color: '#111827',
            lineHeight: '1.2'
          }}>
            Formula Editor
          </h1>
          <div style={{ 
            width: '100%', 
            backgroundColor: 'white', 
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
            borderRadius: '0.5rem', 
            overflow: 'visible',
            border: '1px solid #e5e7eb'
          }}>
            <FormulaInput />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
