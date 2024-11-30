"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddDishDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fetchMenu: () => void 
}

export function AddDishDialog({ open, onOpenChange, fetchMenu }: AddDishDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '/placeholder.svg?height=200&width=200'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Kiểm tra xem tất cả các trường có hợp lệ không
    if (!formData.name || !formData.price || !formData.category) {
      console.error("Vui lòng điền đầy đủ thông tin.")
      return
    }

    // Gọi API để thêm món ăn mới
    try {
      const response = await fetch("http://localhost:5185/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tenmon: formData.name,
          dongia: parseFloat(formData.price),
          loai: formData.category
        })
      })
      
      if (!response.ok) {
        throw new Error(`Không thể thêm món ăn: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Món ăn được thêm thành công:", result)
      fetchMenu()
      onOpenChange(false)
    } catch (error) {
      console.error("Lỗi khi gọi API:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Thêm Món Ăn Mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="flex items-start gap-6">
              <div className="flex-1 grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Tên Món Ăn</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Đơn Giá</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Loại Món</Label>
                  <Input
                    id="name"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Huỷ
            </Button>
            <Button type="submit">Thêm Món Ăn</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
