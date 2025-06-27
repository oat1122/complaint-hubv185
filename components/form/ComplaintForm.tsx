"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategorySelector } from "@/components/ui/CategorySelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { ComplaintSchema, type ComplaintFormData } from "@/lib/validations/complaint";
import { PRIORITY_LEVELS } from "@/lib/constants";

export default function ComplaintForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(ComplaintSchema),
    defaultValues: {
      priority: "MEDIUM"
    }
  });

  const watchedCategory = watch("category");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(file => {
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`ไฟล์ ${file.name} มีขนาดใหญ่เกินไป (สูงสุด 5MB)`);
          return false;
        }
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
        if (!allowedTypes.includes(file.type)) {
          toast.error(`ไฟล์ ${file.name} ไม่รองรับ`);
          return false;
        }
        return true;
      });
      
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ComplaintFormData) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('priority', data.priority);
      
      files.forEach((file) => {
        formData.append(`files`, file);
      });

      const response = await fetch('/api/complaints', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('เกิดข้อผิดพลาดในการส่งเรื่องร้องเรียน');
      }

      const result = await response.json();
      setTrackingId(result.trackingId);
      
      toast.success('ส่งเรื่องร้องเรียนเรียบร้อยแล้ว!');
      reset();
      setFiles([]);
      
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      console.error('Error submitting complaint:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (trackingId) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">ส่งเรื่องร้องเรียนสำเร็จ!</CardTitle>
          <CardDescription>
            เก็บรหัสติดตามนี้ไว้เพื่อตรวจสอบสถานะเรื่องร้องเรียนของท่าน
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">รหัสติดตาม</p>
            <p className="text-2xl font-bold text-blue-600">{trackingId}</p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={() => setTrackingId(null)}
              variant="outline"
            >
              ส่งเรื่องร้องเรียนใหม่
            </Button>
            <Button 
              onClick={() => window.location.href = `/tracking?id=${trackingId}`}
            >
              ตรวจสอบสถานะ
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>แบบฟอร์มเรื่องร้องเรียน</CardTitle>
          <CardDescription>
            กรุณากรอกข้อมูลเรื่องร้องเรียนของท่านให้ครบถ้วน
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              หัวข้อเรื่องร้องเรียน <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("title")}
              placeholder="โปรดระบุหัวข้อเรื่องร้องเรียนโดยย่อ"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">
              ประเภทปัญหา <span className="text-red-500">*</span>
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <CategorySelector
                  value={field.value}
                  onChange={field.onChange}
                  onPriorityChange={(priority) => setValue("priority", priority as any)}
                  showDescription={true}
                />
              )}
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-2">
              ระดับความสำคัญ <span className="text-red-500">*</span>
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกระดับความสำคัญ" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_LEVELS.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.color}`}>
                          {priority.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && (
              <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              รายละเอียด <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register("description")}
              placeholder="โปรดอธิบายรายละเอียดเรื่องร้องเรียนของท่าน..."
              rows={6}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              แนบไฟล์ (ถ้ามี)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">คลิกเพื่อเลือกไฟล์</p>
                <p className="text-xs text-gray-500 mt-1">
                  รองรับ: JPG, PNG, GIF, PDF, TXT (สูงสุด 5MB)
                </p>
              </label>
            </div>
            
            {files.length > 0 && (
              <div className="mt-2 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      ลบ
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">หมายเหตุ:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>การร้องเรียนนี้เป็นแบบไม่เปิดเผยตัวตน</li>
                <li>ท่านจะได้รับรหัสติดตามเพื่อตรวจสอบสถานะ</li>
                <li>เราจะตอบกลับภายใน 3-5 วันทำการ</li>
                <li>ระบบจะแนะนำระดับความสำคัญตามประเภทปัญหาที่เลือก</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "กำลังส่ง..." : "ส่งเรื่องร้องเรียน"}
        </Button>
      </div>
    </form>
  );
}
