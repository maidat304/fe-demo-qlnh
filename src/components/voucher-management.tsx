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
import { VoucherDialog } from "./voucher-dialog"

interface Voucher {
  codeVoucher: string
  mota: string
  phantram: number
  loaima: string
  soluong: number
  diem: number
}

export function VoucherManagement() {
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [search, setSearch] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentVoucher, setCurrentVoucher] = useState<Voucher | null>(null)

  const fetchVoucherData = () => {
    fetch("http://localhost:5185/api/voucher")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setVouchers(data.data);
          console.log("Menu items fetched successfully:", data.data);
        } else {
          console.error("Failed to fetch menu items");
        }
      })
      .catch((error) => console.error("Error fetching voucher items:", error));
  };

  useEffect(() => {
    fetchVoucherData()
  }, [])

  const handleAdd = (newVoucher: Voucher) => {
    setVouchers([...vouchers, newVoucher])
    setIsAddDialogOpen(false)
  }
  const handleEdit = (updatedVoucher: Voucher) => {
    setVouchers(vouchers.map(s => s.codeVoucher === updatedVoucher.codeVoucher ? updatedVoucher : s))
    setIsEditDialogOpen(false)
  }

  const handleDelete = async (codeVoucher: string) => {
    // Gọi API DELETE để xóa nhân viên
    const response = await fetch(`http://localhost:5185/api/voucher/${codeVoucher}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  
    if (response.ok) {
      // Nếu xóa thành công, cập nhật lại danh sách nhân viên trong state
      setVouchers(vouchers.filter(s => s.codeVoucher !== codeVoucher))
    } else {
      console.error('Xóa voucher thất bại')
    }
  }
  

  const filteredVoucher = vouchers.filter(s =>
    s.codeVoucher?.toLowerCase().includes(search.toLowerCase()) ||
    s.phantram?.toString().includes(search.toLowerCase()) ||
    s.diem?.toString().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Voucher</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Voucher
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm voucher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã Voucher</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Phần trăm</TableHead>
            <TableHead>Loại mã</TableHead>
            <TableHead>Số lượng</TableHead>
            <TableHead>Điệm tích luỹ</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredVoucher.map((s) => (
            <TableRow key={s.codeVoucher}>
              <TableCell>{s.codeVoucher}</TableCell>
              <TableCell>{s.mota}</TableCell>
              <TableCell>{s.phantram}%</TableCell>
              <TableCell>{s.loaima}</TableCell>
              <TableCell>{s.soluong}</TableCell>
              <TableCell>{s.diem}</TableCell>
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
                        setCurrentVoucher(s)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(s.codeVoucher)} className="text-red-500">
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

      <VoucherDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAdd}
        reloadData={fetchVoucherData}
      />

      <VoucherDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEdit}
        initialData={currentVoucher}
        reloadData={fetchVoucherData}
      />
    </div>
  )
}

