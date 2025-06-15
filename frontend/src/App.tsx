import { Toaster } from 'react-hot-toast';
import { MainLayout } from './components/layout/MainLayout';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainLayout />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;
