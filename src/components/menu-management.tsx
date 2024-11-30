"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Search } from "lucide-react";
import { EditDishDialog } from "./edit-dish-dialog";
import { AddDishDialog } from "./add-dish-dialog";
import { Input } from "@/components/ui/input";

type MenuItem = {
  idMonan: number;
  tenmon: string;
  dongia: number;
  loai: string;
  trangthai: string;
};

export function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  const fetchMenuItems = () => {
    fetch("http://localhost:5185/api/menu")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMenuItems(data.data);
          console.log("Menu items fetched successfully:", data.data);
        } else {
          console.error("Failed to fetch menu items");
        }
      })
      .catch((error) => console.error("Error fetching menu items:", error));
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleEdit = (dish: MenuItem) => {
    setEditingDish(dish);
    setIsEditDialogOpen(true);
  };

  // Lọc menu items theo search
  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.tenmon.toLowerCase().includes(search.toLowerCase()) || // Tìm theo tên món ăn
      item.loai.toLowerCase().includes(search.toLowerCase()) || // Tìm theo loại món
      item.trangthai.toLowerCase().includes(search.toLowerCase()) // Tìm theo trạng thái
  );

  return (
    <>
      <div className="">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Quản lý Thực Đơn
              </h2>
              <p className="text-muted-foreground">
                Số Món Ăn đang kinh doanh: {filteredMenuItems.length}
              </p>
            </div>
            <div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm Món Ăn
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm món ăn..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="border rounded-lg bg-white dark:bg-gray-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Mã MA</TableHead>
                  <TableHead>Tên món ăn</TableHead>
                  <TableHead className="w-32">Đơn giá</TableHead>
                  <TableHead className="w-32">Loại món</TableHead>
                  <TableHead className="w-40">Trạng Thái</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMenuItems.map((item) => (
                  <TableRow key={item.idMonan}>
                    <TableCell>{item.idMonan}</TableCell>
                    <TableCell className="font-medium">{item.tenmon}</TableCell>
                    <TableCell>{item.dongia.toLocaleString()}đ</TableCell>
                    <TableCell>{item.loai}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          item.trangthai === "Dang kinh doanh"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }
                      >
                        {item.trangthai}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleEdit(item)}
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <EditDishDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        dish={editingDish || undefined}
        onReloadData={fetchMenuItems} // Truyền hàm fetch lại dữ liệu
      />

      <AddDishDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        fetchMenu={fetchMenuItems}
      />
    </>
  );
}
