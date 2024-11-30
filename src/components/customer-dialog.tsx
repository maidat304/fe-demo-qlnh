import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface Customer {
    idKh: number
    tenkh: string
    ngaythamgia: string
    doanhso: number
    diemtichluy: number
  }
interface CustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (staff: Customer) => void
  initialData?: Customer | null
  reloadData: () => void
}

export function CustomerDialog({ open, onOpenChange, onSubmit, initialData, reloadData }: CustomerDialogProps) {
  const [formData, setFormData] = useState<Customer>(
    initialData || {
        idKh: 0,
        tenkh: "",
        ngaythamgia: "",
        doanhso: 0,
        diemtichluy: 0,
    }
  )

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Nếu có initialData, gọi PUT để cập nhật nhân viên
    if (initialData) {
      const response = await fetch(`http://localhost:5185/api/customer/${formData.idKh}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Nếu thành công, gọi onSubmit và đóng dialog
        onSubmit(formData)
        reloadData()
        onOpenChange(false)
      } else {
        console.error('Cập nhật nhân viên thất bại')
      }
    } else {
      // Nếu không có initialData, gọi POST để thêm nhân viên mới
      const response = await fetch('http://localhost:5185/api/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Nếu thành công, gọi onSubmit và đóng dialog
        onSubmit(formData)
        reloadData()
        onOpenChange(false)
      } else {
        console.error('Thêm khach hang thất bại')
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Chỉnh sửa Khách hàng' : 'Thêm Khách hàng'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tenkh" className="text-right">
                Tên Khách hàng
              </Label>
              <Input
                id="tennv"
                value={formData.tenkh}
                onChange={(e) => setFormData({ ...formData, tenkh: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doanhso" className="text-right">
                Doanh số
              </Label>
              <Input
                id="doanhso"
                value={formData.doanhso}
                onChange={(e) => setFormData({ ...formData, doanhso: parseFloat(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="diemtichluy" className="text-right">
                Điểm tích luỹ
              </Label>
              <Input
                id="diemtichluy"
                value={formData.diemtichluy}
                onChange={(e) => setFormData({ ...formData, diemtichluy: parseFloat(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{initialData ? 'Cập nhật' : 'Thêm'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
