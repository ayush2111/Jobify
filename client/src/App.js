import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Register, Landing, Error, ProtectedRoute } from './Pages/index.js';
import { AddJob, AllJobs, Profile, SharedLayout, Stats } from './Pages/dashboard/index.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><SharedLayout/></ProtectedRoute>}>
          <Route index element={<Stats />} />
          <Route path="all-jobs" element={<AllJobs />} />
          <Route path="add-job" element={<AddJob />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
