'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { MenuManagement } from '@/components/menu-management';
import { StaffManagement } from '@/components/staff-management';
import { CustomerManagement } from '@/components/customer-management';
import { VoucherManagement } from '@/components/voucher-management';
import { LoginPage } from '@/components/login-page';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('menu');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setCurrentPage('menu');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    setCurrentPage('login');
  };

  // Hiển thị trang Login nếu chưa đăng nhập
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        currentPage={currentPage}
        userEmail={userEmail}
        onPageChange={(page) => {
          if (page === 'logout') {
            handleLogout(); // Gọi hàm đăng xuất
          } else {
            setCurrentPage(page); // Thay đổi trang
          }
        }}
      />
      <main className="flex-1 overflow-y-auto p-8">
        {currentPage === 'menu' && <MenuManagement />}
        {currentPage === 'staff' && <StaffManagement />}
        {currentPage === 'customers' && <CustomerManagement />}
        {currentPage === 'vouchers' && <VoucherManagement />}
      </main>
    </div>
  );
}

