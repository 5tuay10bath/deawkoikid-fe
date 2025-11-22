import { useState, useRef, useEffect } from "react"
import { Upload, Check, Loader2 } from "lucide-react"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./Dialog"
import { Button } from "./Button"
import { useToast } from "../hooks/useToast"

interface UploadFileDialogProps {
  isOpen: boolean
  onClose: () => void
  type: "contracts" | "maintenance"
  id: string
}

export default function UploadFileDialog({ isOpen, onClose, type, id }: UploadFileDialogProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null)
  const [isLoadingUrl, setIsLoadingUrl] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null)
      setPresignedUrl(null)
      setUploadSuccess(false)
    }
  }, [isOpen])

  const fetchPresignedUrl = async (fileExtension: string) => {
    setIsLoadingUrl(true)
    try {
      const filePath = `img/${type}/${id}${fileExtension}`
      const response = await axiosInstance.get("/public/presigned-url/upload", {
        params: { filePath },
      })

      if (response.data) {
        setPresignedUrl(response.data)
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to prepare upload. Please try again.",
        variant: "destructive",
      })
      setSelectedFile(null)
    } finally {
      setIsLoadingUrl(false)
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    // Get file extension
    const fileName = file.name
    const lastDot = fileName.lastIndexOf(".")
    const fileExtension = lastDot !== -1 ? fileName.substring(lastDot) : ""

    // Set file first
    setSelectedFile(file)

    // Then fetch presigned URL with correct file extension
    await fetchPresignedUrl(fileExtension)
  }

  const handleUpload = async () => {
    if (!selectedFile || !presignedUrl) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      // Upload file to S3 using presigned URL with PUT method and binary body
      await axiosInstance.put(presignedUrl, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type || "application/octet-stream",
        },
      })

      // If contract type, update contract status
      if (type === "contracts") {
        await axiosInstance.put(`/contracts/status/${id}`)
      }

      setUploadSuccess(true)
      toast({
        title: "Upload successful!",
        description: "Your file has been uploaded successfully.",
      })

      // Close modal after 1.5 seconds
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch {
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSelectFileClick = () => {
    fileInputRef.current?.click()
  }

  const typeLabel = type === "contracts" ? "Contract" : "Maintenance"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload {typeLabel} File</DialogTitle>
        </DialogHeader>

        {isLoadingUrl ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm text-gray-600">Preparing upload...</p>
          </div>
        ) : uploadSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-green-100 p-3 mb-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-gray-900">Upload Successful!</p>
            <p className="text-sm text-gray-600">Your file has been uploaded.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept="*/*" />

            {/* File selection area */}
            <div
              onClick={handleSelectFileClick}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              {selectedFile ? (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                  <p className="text-xs text-blue-600 mt-2">Click to change file</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Click to select file</p>
                  <p className="text-xs text-gray-500">Any file type, max 10MB</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} disabled={isUploading || isLoadingUrl} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !presignedUrl || isUploading || isLoadingUrl}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
