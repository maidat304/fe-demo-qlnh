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

interface Staff {
  idNv: number
  tennv: string
  sdt: string
  chucvu: string
  ngayvl: string
}

interface StaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (staff: Staff) => void
  initialData?: Staff | null
  reloadData: () => void
}

export function StaffDialog({ open, onOpenChange, onSubmit, initialData, reloadData }: StaffDialogProps) {
  const [formData, setFormData] = useState<Staff>(
    initialData || {
      idNv: 0,
      tennv: '',
      sdt: '',
      chucvu: '',
      ngayvl: new Date().toISOString().split('T')[0],
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
      const response = await fetch(`http://localhost:5185/api/staff/${formData.idNv}`, {
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
      const response = await fetch('http://localhost:5185/api/staff', {
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
        console.error('Thêm nhân viên thất bại')
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Chỉnh sửa Nhân viên' : 'Thêm Nhân viên'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tennv" className="text-right">
                Tên Nhân viên
              </Label>
              <Input
                id="tennv"
                value={formData.tennv}
                onChange={(e) => setFormData({ ...formData, tennv: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sdt" className="text-right">
                Số điện thoại
              </Label>
              <Input
                id="sdt"
                value={formData.sdt}
                onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="chucvu" className="text-right">
                Chức vụ
              </Label>
              <Input
                id="chucvu"
                value={formData.chucvu}
                onChange={(e) => setFormData({ ...formData, chucvu: e.target.value })}
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
