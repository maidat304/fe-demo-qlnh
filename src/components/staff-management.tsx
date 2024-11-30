"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { StaffDialog } from "./staff-dialog"

interface Staff {
  idNv: number
  tennv: string
  ngayvl: string
  sdt: string
  chucvu: string
}

export function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [search, setSearch] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null)

  const fetchStaffData = () => {
    fetch("http://localhost:5185/api/staff")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setStaff(data.data);
          console.log("Menu items fetched successfully:", data.data);
        } else {
          console.error("Failed to fetch menu items");
        }
      })
      .catch((error) => console.error("Error fetching menu items:", error));
  };

  useEffect(() => {
    fetchStaffData()
  }, [])

  const handleAdd = (newStaff: Staff) => {
    setStaff([...staff, { ...newStaff, idNv: Date.now() }])
    setIsAddDialogOpen(false)
  }
  const handleEdit = (updatedStaff: Staff) => {
    setStaff(staff.map(s => s.idNv === updatedStaff.idNv ? updatedStaff : s))
    setIsEditDialogOpen(false)
  }

  const handleDelete = async (id: number) => {
    // Gọi API DELETE để xóa nhân viên
    const response = await fetch(`http://localhost:5185/api/staff/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  
    if (response.ok) {
      // Nếu xóa thành công, cập nhật lại danh sách nhân viên trong state
      setStaff(staff.filter(s => s.idNv !== id))
    } else {
      console.error('Xóa nhân viên thất bại')
    }
  }
  

  const filteredStaff = staff.filter(s => 
    s.tennv?.toLowerCase().includes(search.toLowerCase()) ||
    s.chucvu?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Nhân sự</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Nhân viên
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm nhân viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Chức vụ</TableHead>
            <TableHead>Ngày vào làm</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStaff.map((s) => (
            <TableRow key={s.idNv}>
              <TableCell>{s.idNv}</TableCell>
              <TableCell>{s.tennv}</TableCell>
              <TableCell>{s.sdt}</TableCell>
              <TableCell>{s.chucvu}</TableCell>
              <TableCell>{s.ngayvl}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setCurrentStaff(s)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(s.idNv)} className="text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <StaffDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAdd}
        reloadData={fetchStaffData}
      />

      <StaffDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEdit}
        initialData={currentStaff}
        reloadData={fetchStaffData}
      />
    </div>
  )
}

