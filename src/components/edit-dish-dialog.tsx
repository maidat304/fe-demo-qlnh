"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ban } from "lucide-react";

interface EditDishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dish?: {
    idMonan: number;
    tenmon: string;
    dongia: number;
    loai: string;
  };
}

export function EditDishDialog({
  open,
  onOpenChange,
  dish,
  onReloadData, // Thêm callback để reload dữ liệu từ MenuManagement
}: EditDishDialogProps & { onReloadData: () => void }) {
  const [formData, setFormData] = useState({
    tenmon: dish?.tenmon || "",
    dongia: dish?.dongia.toString() || "",
    loai: dish?.loai || "",
  });

  useEffect(() => {
    if (dish) {
      setFormData({
        tenmon: dish.tenmon || "",
        dongia: dish.dongia.toString() || "",
        loai: dish.loai || "",
      });
    }
  }, [dish]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dish) {
      console.error("Không có món ăn được chọn để chỉnh sửa.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5185/api/menu/${dish.idMonan}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenmon: formData.tenmon,
          dongia: parseFloat(formData.dongia),
          loai: formData.loai,
        }),
      });

      if (!response.ok) {
        throw new Error(`Cập nhật thất bại: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Cập nhật thành công:", result);
      onReloadData(); // Gọi callback để reload dữ liệu
      onOpenChange(false);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const handleDelete = async () => {
    if (!dish) {
      console.error("Không có món ăn được chọn để xóa.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5185/api/menu/${dish.idMonan}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Xóa món ăn thất bại: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Món ăn đã được xóa:", result);
      onReloadData(); // Gọi callback để reload dữ liệu
      onOpenChange(false);
    } catch (error) {
      console.error("Lỗi khi gọi API xóa món ăn:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between mt-4">
            <DialogTitle className="text-2xl">Sửa Thông Tin</DialogTitle>
            <Button variant="destructive" className="gap-2" onClick={handleDelete}>
              <Ban className="h-4 w-4" />
              Ngưng Kinh Doanh
            </Button>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="id">Mã Món Ăn</Label>
              <Input
                id="id"
                value={dish?.idMonan || ""}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Tên Món Ăn</Label>
              <Input
                id="name"
                value={formData.tenmon}
                onChange={(e) =>
                  setFormData({ ...formData, tenmon: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Đơn Giá</Label>
              <Input
                id="price"
                type="number"
                value={formData.dongia}
                onChange={(e) =>
                  setFormData({ ...formData, dongia: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Loại</Label>
              <Input
                id="price"
                value={formData.loai}
                onChange={(e) =>
                  setFormData({ ...formData, loai: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Huỷ
            </Button>
            <Button type="submit">Xác nhận</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
