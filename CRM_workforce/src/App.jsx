 import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './MainLayout';
import StaffPage from './staffPage';
import AttendanceModule from './Attendance';
import SalaryModule from './Salary';
import WorkModule from './WorkModule';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/staff" replace />} />
          <Route path="staff" element={<StaffPage />} />
           <Route path="attendance" element={<AttendanceModule />} />
          <Route path="salary" element={<SalaryModule />} />
           <Route path="tasks" element={<WorkModule />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
