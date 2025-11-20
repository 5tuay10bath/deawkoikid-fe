import { useState, useRef, useEffect } from "react"
import { Upload, Check, Loader2 } from "lucide-react"
import { format } from "date-fns"
import axios from "axios"
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

  // Get presigned URL when modal opens
  useEffect(() => {
    if (isOpen && id) {
      fetchPresignedUrl()
    } else {
      // Reset state when modal closes
      setSelectedFile(null)
      setPresignedUrl(null)
      setUploadSuccess(false)
    }
  }, [isOpen, id])

  const fetchPresignedUrl = async () => {
    setIsLoadingUrl(true)
    try {
      const datetime = format(new Date(), "yyyyMMddHHmmss")
      const filePath = `img/${type}/${datetime}_${id}`
      const response = await axios.get(`http://localhost:8080/api/public/presigned-url/download?filePath=${filePath}`)

      if (response.data) {
        setPresignedUrl(response.data)
        toast({
          title: "Ready to upload",
          description: "You can now select a file to upload",
        })
      }
    } catch (error) {
      console.error("Error fetching presigned URL:", error)
      toast({
        title: "Error",
        description: "Failed to prepare upload. Please try again.",
        variant: "destructive",
      })
      onClose()
    } finally {
      setIsLoadingUrl(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
    }
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
      // Upload file to S3 using presigned URL with PUT method
      await axios.put(presignedUrl, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type || "application/octet-stream",
        },
      })

      setUploadSuccess(true)
      toast({
        title: "Upload successful!",
        description: "Your file has been uploaded successfully.",
      })

      // Close modal after 1.5 seconds
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error("Error uploading file:", error)
      if (axios.isAxiosError(error)) {
        console.error("Response status:", error.response?.status)
        console.error("Response data:", error.response?.data)
        console.error("Request headers:", error.config?.headers)
      }
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
              <Button variant="outline" onClick={onClose} disabled={isUploading} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="flex-1">
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
