import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

/**
 * Component "canh gác" (Guard Component).
 * @param {object} props
 * @param {React.ReactNode} props.children - Component con (ví dụ: <MainLayout />)
 */
const ProtectedRoute = ({ children }) => {
  // Lấy trạng thái đăng nhập từ kho (store)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    // Nếu CHƯA đăng nhập, "đá" về trang /login
    // `replace` có nghĩa là người dùng không thể nhấn "Back" để quay lại
    return <Navigate to="/login" replace />;
  }

  // Nếu ĐÃ đăng nhập, cho phép render component con (children)
  return children;
};

export default ProtectedRoute;