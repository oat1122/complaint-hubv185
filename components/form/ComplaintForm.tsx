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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  X, 
  Camera, 
  Paperclip,
  CheckCircle,
  Clock,
  Send,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Share2,
  Download,
  Smartphone,
  Image as ImageIcon,
  File
} from "lucide-react";
import { ComplaintSchema, type ComplaintFormData } from "@/lib/validations/complaint";
import { PRIORITY_LEVELS } from "@/lib/constants";

export default function ComplaintForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [formStep, setFormStep] = useState(1);
  const totalSteps = 3;

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
  const watchedTitle = watch("title");
  const watchedDescription = watch("description");
  const watchedPriority = watch("priority");

  // Auto-save to localStorage for mobile users
  const saveFormData = () => {
    if (typeof window !== 'undefined') {
      const formData = {
        title: watchedTitle,
        description: watchedDescription,
        category: watchedCategory,
        priority: watchedPriority
      };
      localStorage.setItem('complaint_draft', JSON.stringify(formData));
    }
  };

  // Load saved form data
  const loadFormData = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('complaint_draft');
      if (saved) {
        const data = JSON.parse(saved);
        setValue('title', data.title || '');
        setValue('description', data.description || '');
        setValue('category', data.category);
        setValue('priority', data.priority || 'MEDIUM');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(file => {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`ไฟล์ ${file.name} มีขนาดใหญ่เกินไป (สูงสุด 5MB)`);
        return false;
      }
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`ไฟล์ ${file.name} ไม่รองรับ`);
        return false;
      }
      return true;
    });
    
    setFiles(prev => [...prev, ...validFiles]);
    if (validFiles.length > 0) {
      toast.success(`เพิ่มไฟล์ ${validFiles.length} ไฟล์แล้ว`);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('ลบไฟล์แล้ว');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    }
  };

  // Camera capture for mobile
  const handleCameraCapture = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = (e) => {
          const target = e.target as HTMLInputElement;
          if (target.files) {
            addFiles(Array.from(target.files));
          }
        };
        input.click();
      } catch (error) {
        toast.error('ไม่สามารถเปิดกล้องได้');
      }
    }
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
      
      // Clear saved data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('complaint_draft');
      }
      
      toast.success('ส่งเรื่องร้องเรียนเรียบร้อยแล้ว!');
      reset();
      setFiles([]);
      setFormStep(1);
      
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      console.error('Error submitting complaint:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTrackingId = async () => {
    if (trackingId) {
      try {
        await navigator.clipboard.writeText(trackingId);
        toast.success('คัดลอกรหัสติดตามแล้ว');
      } catch (err) {
        toast.error('ไม่สามารถคัดลอกได้');
      }
    }
  };

  const handleShare = async () => {
    if (trackingId && navigator.share) {
      try {
        await navigator.share({
          title: 'รหัสติดตามเรื่องร้องเรียน',
          text: `รหัสติดตาม: ${trackingId}`,
          url: `${window.location.origin}/tracking?id=${trackingId}`
        });
      } catch (err) {
        handleCopyTrackingId();
      }
    } else {
      handleCopyTrackingId();
    }
  };

  const isFileImage = (file: File) => {
    return file.type.startsWith('image/');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Progress calculation
  const getFormProgress = () => {
    let progress = 0;
    if (watchedTitle) progress += 25;
    if (watchedDescription && watchedDescription.length >= 10) progress += 25;
    if (watchedCategory) progress += 25;
    if (watchedPriority) progress += 25;
    return progress;
  };

  // Success Screen
  if (trackingId) {
    return (
      <Card className="max-w-2xl mx-auto card-modern animate-fade-in-scale">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-gradient-success rounded-full flex items-center justify-center mx-auto shadow-large animate-bounce-gentle">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            {/* Success Message */}
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                ส่งเรื่องร้องเรียนสำเร็จ!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                เก็บรหัสติดตามนี้ไว้เพื่อตรวจสอบสถานะเรื่องร้องเรียนของท่าน
              </p>
            </div>

            {/* Tracking ID Display */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-gray-200 dark:border-gray-600">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">รหัสติดตาม</p>
              <div className="flex items-center justify-center space-x-3">
                <p className="text-2xl sm:text-3xl font-bold text-primary font-mono tracking-wider">
                  {trackingId}
                </p>
                <Button
                  onClick={handleCopyTrackingId}
                  variant="outline"
                  size="sm"
                  className="tap-target"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                onClick={() => setTrackingId(null)}
                variant="outline"
                className="flex-1 tap-target"
              >
                ส่งเรื่องร้องเรียนใหม่
              </Button>
              <Button 
                onClick={() => window.location.href = `/tracking?id=${trackingId}`}
                className="flex-1 btn-primary tap-target"
              >
                ตรวจสอบสถานะ
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="sm:w-auto tap-target"
              >
                <Share2 className="w-4 h-4 mr-2" />
                แชร์
              </Button>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">ขั้นตอนต่อไป</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
                <li>• เราจะตรวจสอบเรื่องร้องเรียนภายใน 24 ชั่วโมง</li>
                <li>• ติดตามสถานะได้ตลอดเวลาด้วยรหัสข้างต้น</li>
                <li>• จะได้รับการแจ้งเตือนเมื่อมีความคืบหน้า</li>
                <li>• หากต้องการข้อมูลเพิ่มเติม สามารถส่งเรื่องใหม่ได้</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Progress Bar - Mobile Friendly */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 animate-slide-in">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">เปอร์เซ็นต์ความสมบูรณ์ของ form</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">{getFormProgress()}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill transition-all duration-500 ease-out"
            style={{ width: `${getFormProgress()}%` }}
          ></div>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="card-modern animate-slide-in">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="w-6 h-6 text-primary" />
            <span>แบบฟอร์มเรื่องร้องเรียน</span>
          </CardTitle>
          <CardDescription>
            กรุณากรอกข้อมูลเรื่องร้องเรียนของท่านให้ครบถ้วน เพื่อให้เราสามารถดำเนินการได้อย่างมีประสิทธิภาพ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-sm font-medium text-primary">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">1</div>
              <span>ข้อมูลพื้นฐาน</span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                หัวข้อเรื่องร้องเรียน <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("title")}
                placeholder="โปรดระบุหัวข้อเรื่องร้องเรียนโดยย่อ"
                className="input-modern"
                onChange={(e) => {
                  register("title").onChange(e);
                  saveFormData();
                }}
              />
              {errors.title && (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.title.message}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {watchedTitle?.length || 0}/200 ตัวอักษร
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                รายละเอียด <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register("description")}
                placeholder="โปรดอธิบายรายละเอียดเรื่องร้องเรียนของท่าน ยิ่งละเอียดยิ่งดี..."
                rows={6}
                className="input-modern resize-none"
                onChange={(e) => {
                  register("description").onChange(e);
                  saveFormData();
                }}
              />
              {errors.description && (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description.message}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {watchedDescription?.length || 0}/2000 ตัวอักษร
              </p>
            </div>
          </div>

          {/* Step 2: Category and Priority */}
          <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-sm font-medium text-primary">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">2</div>
              <span>ประเภทและความสำคัญ</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ประเภทปัญหา <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <CategorySelector
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        saveFormData();
                      }}
                      onPriorityChange={(priority) => setValue("priority", priority as any)}
                      showDescription={true}
                    />
                  )}
                />
                {errors.category && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ระดับความสำคัญ <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      value={field.value} 
                      onValueChange={(value) => {
                        field.onChange(value);
                        saveFormData();
                      }}
                    >
                      <SelectTrigger className="input-modern">
                        <SelectValue placeholder="เลือกระดับความสำคัญ" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITY_LEVELS.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.color}`}>
                                {priority.label}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.priority && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.priority.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: File Upload */}
          <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-sm font-medium text-primary">
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs">3</div>
              <span>ไฟล์แนบ (ถ้ามี)</span>
            </div>

            {/* File Upload Area */}
            <div className="space-y-4">
              <div 
                className={`border-2 border-dashed rounded-xl p-6 sm:p-8 transition-all duration-300 ${
                  dragActive 
                    ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.txt,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                
                <div className="text-center space-y-4">
                  <div className="flex justify-center space-x-2">
                    <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      ลากและวางไฟล์ที่นี่
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      หรือคลิกเพื่อเลือกไฟล์
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="btn-primary cursor-pointer tap-target inline-flex items-center justify-center px-4 py-2 rounded-xl"
                    >
                      <File className="w-4 h-4 mr-2" />
                      เลือกไฟล์
                    </label>
                    
                    <Button
                      type="button"
                      onClick={handleCameraCapture}
                      variant="outline"
                      className="tap-target sm:inline-flex"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">ถ่ายรูป</span>
                      <span className="sm:hidden">กล้อง</span>
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    รองรับ: JPG, PNG, GIF, PDF, DOC, DOCX (สูงสุด 5MB ต่อไฟล์)
                  </p>
                </div>
              </div>
              
              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ไฟล์ที่เลือก ({files.length})
                  </h4>
                  <div className="grid gap-3">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg flex-shrink-0">
                            {isFileImage(file) ? (
                              <ImageIcon className="w-5 h-5 text-primary" />
                            ) : (
                              <FileText className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                          {isFileImage(file) && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setPreviewFile(file)}
                              className="tap-target opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="tap-target text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 sm:p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100">ข้อมูลสำคัญ</h4>
                <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                  <li>• การร้องเรียนนี้เป็นแบบไม่เปิดเผยตัวตน ข้อมูลของท่านจะปลอดภัย</li>
                  <li>• ท่านจะได้รับรหัสติดตามเพื่อตรวจสอบสถานะ</li>
                  <li>• เราจะตอบกลับภายใน 3-5 วันทำการ</li>
                  <li>• ระบบจะแนะนำระดับความสำคัญตามประเภทปัญหาที่เลือก</li>
                  <li>• ข้อมูลจะถูกเก็บไว้ชั่วคราวในเครื่องหากยังไม่ส่ง</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button - Sticky on Mobile */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700 safe-bottom -mx-4 lg:mx-0 lg:static lg:bg-transparent lg:dark:bg-transparent lg:border-0 lg:p-0">
        <Button 
          type="submit" 
          disabled={isSubmitting || getFormProgress() < 75} 
          className="w-full btn-primary tap-target text-lg py-3 sm:py-2 sm:text-base lg:w-auto lg:px-8"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              กำลังส่ง...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              ส่งเรื่องร้องเรียน
            </>
          )}
        </Button>
      </div>

      {/* Image Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 safe-top safe-bottom">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setPreviewFile(null)}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 tap-target z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={URL.createObjectURL(previewFile)}
              alt={previewFile.name}
              className="max-w-full max-h-full object-contain rounded-lg"
              onLoad={() => URL.revokeObjectURL(URL.createObjectURL(previewFile))}
            />
          </div>
        </div>
      )}
    </form>
  );
}

