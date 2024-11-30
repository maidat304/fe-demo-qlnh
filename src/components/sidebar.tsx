import { Button } from "@/components/ui/button"
import { ScrollText, Users, Package, Users2, LogOut, Ticket } from 'lucide-react'

interface SidebarProps {
  currentPage: string;
  userEmail: string | null;
  onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, userEmail, onPageChange }: SidebarProps) {
  const handleLogout = () => {
    // Xử lý logic đăng xuất nếu cần
    // Ví dụ: Xóa token hoặc trạng thái người dùng
    localStorage.removeItem('authToken'); // Xóa token (nếu dùng localStorage)
    
    // Chuyển hướng về trang login
    onPageChange('logout');
  };
  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-screen p-4 flex flex-col border-r">
      <div className="flex items-center gap-2 mb-8 p-2">
        <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
          <Package className="w-6 h-6 text-rose-500 dark:text-rose-300" />
        </div>
        <div>
          <h1 className="font-semibold text-lg">Royal Restaurant</h1>
          <p className="text-xs text-muted-foreground">Quản lý Nhà hàng</p>
          {userEmail && (
            <p className="text-xs text-muted-foreground mt-1">Email: {userEmail}</p>
          )}
        </div>
      </div>
      
      <nav className="space-y-2 flex-1">
        <Button 
          variant={currentPage === 'menu' ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => onPageChange('menu')}
        >
          <ScrollText className="mr-2 h-4 w-4" />
          Quản lý Thực Đơn
        </Button>
        <Button 
          variant={currentPage === 'staff' ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => onPageChange('staff')}
        >
          <Users className="mr-2 h-4 w-4" />
          Quản lý Nhân Sự
        </Button>
        <Button 
          variant={currentPage === 'customers' ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => onPageChange('customers')}
        >
          <Users2 className="mr-2 h-4 w-4" />
          Quản lý Khách Hàng
        </Button>
        <Button 
          variant={currentPage === 'vouchers' ? "secondary" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => onPageChange('vouchers')}
        >
          <Ticket className="mr-2 h-4 w-4" />
          Quản lý Voucher
        </Button>
      </nav>

      <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Đăng Xuất
      </Button>
    </div>
  )
}