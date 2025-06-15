import MainLayout from './layouts/MainLayout';
import { StagewiseToolbar } from '@stagewise/toolbar-react';
import { ReactPlugin } from '@stagewise-plugins/react';

function App() {
  return (
    <>
      <StagewiseToolbar 
        config={{
          plugins: [ReactPlugin]
        }}
      />
      <MainLayout />
    </>
  );
}

export default App;
