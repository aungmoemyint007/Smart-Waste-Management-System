import './App.css';
import { createTheme, Divider, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/dates/styles.css';
import HomePage from './Pages/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ReportPage from './Pages/ReportPage';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import PostJob from './PostJob/PostJob';

import PostedJobPage from './Pages/PostedJobPage';
import PostJobPage from './Pages/CollectPage';
import JobHistoryPage from './Pages/JobHistoryPage';
import SignUpPage from './Pages/SignUpPage';
import AiChat from './Pages/AiChat';
import { Toaster } from 'react-hot-toast';  // Import Toaster
import TestLogin from './Pages/TestLogin';
import LeaderboardPage from './Pages/Leaderboard';
import {PointsProvider} from './context/PointsContext';
import { Provider, useSelector } from 'react-redux';
import store from './Store.tsx';

function App() {
  const theme = createTheme({
    fontFamily: "Poppins, sans-serif",
    focusRing: "never",
    primaryColor: "bright-sun",
    primaryShade: 4,
    colors: {
      'bright-sun': ['#fffbeb', '#fff3c6', '#ffe588', '#ffd149', '#ffbd20', '#f99b07', '#dd7302', '#b75006', '#943c0c', '#7a330d', '#461902'],
      'mine-shaft': ['#f6f6f6', '#e7e7e7', '#d1d1d1', '#b0b0b0', '#888888', '#6d6d6d', '#5d5d5d', '#4f4f4f', '#454545', '#3d3d3d', '#2d2d2d'],
    },
  });

  return (
      <Provider store={store}>
        <MantineProvider defaultColorScheme="dark" theme={theme}>
        <PointsProvider>
        <BrowserRouter>
          <div className="relative h-screen">
            <Header />
            <Divider size="sm" mx="md" />
            <Routes>
              <Route path='/report' element={<ReportPage />} />
              <Route path='/test' element={<TestLogin />} />
              <Route path='/ai-chat' element={<AiChat />} />
              <Route path="/collect" element={<PostJobPage />} />
              <Route path="/exchange" element={<JobHistoryPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path='/signup' element={<SignUpPage />} />
              <Route path='/login' element={<SignUpPage />} />
              <Route path='*' element={<HomePage />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
        <Toaster /> {/* Add the Toaster component here */}
        </PointsProvider>
      </MantineProvider>
      </Provider>
  );
}

export default App;
