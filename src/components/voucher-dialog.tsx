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

interface Voucher {
    codeVoucher: string
    mota: string
    phantram: number
    loaima: string
    soluong: number
    diem: number
}

interface VoucherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (voucher: Voucher) => void
  initialData?: Voucher | null
  reloadData: () => void
}

export function VoucherDialog({ open, onOpenChange, onSubmit, initialData, reloadData }: VoucherDialogProps) {                                                                           
  const [formData, setFormData] = useState<Voucher>(
    initialData || {
      codeVoucher: "",
      mota: '',
      phantram: 0,
      loaima: '',
      soluong: 0,
      diem: 0
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
      const response = await fetch(`http://localhost:5185/api/voucher/${formData.codeVoucher}`, {
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
        console.error('Cập nhật voucher thất bại')
      }
    } else {
      // Nếu không có initialData, gọi POST để thêm nhân viên mới
      const response = await fetch('http://localhost:5185/api/voucher', {
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
        console.error('Thêm voucher thất bại')
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Chỉnh sửa Voucher' : 'Thêm Voucher'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codeVoucher" className="text-right">
                Mã Voucher
              </Label>
              <Input
                id="codeVoucher"
                value={formData.codeVoucher}
                onChange={(e) => setFormData({ ...formData, codeVoucher: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mota" className="text-right">
                Mô tả
              </Label>
              <Input
                id="mota"
                value={formData.mota}
                onChange={(e) => setFormData({ ...formData, mota: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phantram" className="text-right">
                Phần trăm
              </Label>
              <Input
                id="phantram"
                value={formData.phantram}
                onChange={(e) => setFormData({ ...formData, phantram: parseFloat(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="loaima" className="text-right">
                Loại mã
              </Label>
              <Input
                id="loaima"
                value={formData.loaima}
                onChange={(e) => setFormData({ ...formData, loaima: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="soluong" className="text-right">
                Số lượng
              </Label>
              <Input
                id="soluong"
                value={formData.soluong}
                onChange={(e) => setFormData({ ...formData, soluong: parseFloat(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="diem" className="text-right">
                Điệm tích luỹ
              </Label>
              <Input
                id="diem"
                value={formData.diem}
                onChange={(e) => setFormData({ ...formData, diem: parseFloat(e.target.value) || 0 })}
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
