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
import { Plus, Search, MoreHorizontal, Pencil } from 'lucide-react'
import { CustomerDialog } from "./customer-dialog"

interface Customer {
  idKh: number
  tenkh: string
  ngaythamgia: string
  doanhso: number
  diemtichluy: number
}

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)

  const fetchCustomerData = () => {
    fetch("http://localhost:5185/api/customer")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCustomers(data.data);
          console.log("Menu items fetched successfully:", data.data);
        } else {
          console.error("Failed to fetch menu items");
        }
      })
      .catch((error) => console.error("Error fetching menu items:", error));
  };

  useEffect(() => {
    fetchCustomerData()
  }, [])

  const handleAdd = (newCustomer: Customer) => {
    setCustomers([...customers, newCustomer])
    setIsAddDialogOpen(false)
  }
  const handleEdit = (updatedCustomer: Customer) => {
    setCustomers(customers.map(s => s.idKh === updatedCustomer.idKh ? updatedCustomer : s))
    setIsEditDialogOpen(false)
  }
  

  const filteredCustomer = customers.filter(s =>
    s.tenkh.toLowerCase().includes(search.toLowerCase())
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
            <TableHead>Ngày tham gia</TableHead>
            <TableHead>Doanh số</TableHead>
            <TableHead>Điệm tích luỹ</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomer.map((s) => (
            <TableRow key={s.idKh}>
              <TableCell>{s.idKh}</TableCell>
              <TableCell>{s.tenkh}</TableCell>
              <TableCell>{s.ngaythamgia}</TableCell>
              <TableCell>{s.doanhso}</TableCell>
              <TableCell>{s.diemtichluy}</TableCell>
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
                        setCurrentCustomer(s)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CustomerDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAdd}
        reloadData={fetchCustomerData}
      />

      <CustomerDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEdit}
        initialData={currentCustomer}
        reloadData={fetchCustomerData}
      />
    </div>
  )
}

