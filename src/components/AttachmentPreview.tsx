import React, { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { 
  FileText, 
  Image as ImageIcon, 
  File, 
  Video,
  Download,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import { Attachment } from '../App';

interface AttachmentPreviewProps {
  attachment: Attachment;
  allAttachments?: Attachment[];
  onClose: () => void;
  isOpen: boolean;
}

interface AttachmentGridProps {
  attachments: Attachment[];
  onPreview: (attachment: Attachment) => void;
  showThumbnails?: boolean;
}

export function AttachmentPreview({ attachment, allAttachments = [], onClose, isOpen }: AttachmentPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(
    allAttachments.findIndex(att => att.id === attachment.id) || 0
  );
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const currentAttachment = allAttachments[currentIndex] || attachment;
  const isImage = currentAttachment.type.startsWith('image/');
  const isVideo = currentAttachment.type.startsWith('video/');
  const isPDF = currentAttachment.type === 'application/pdf';
  const isDocument = currentAttachment.type.includes('document') || 
                    currentAttachment.type.includes('word') ||
                    currentAttachment.name.endsWith('.doc') ||
                    currentAttachment.name.endsWith('.docx');

  const handlePrevious = () => {
    if (allAttachments.length > 1) {
      setCurrentIndex((prev) => prev === 0 ? allAttachments.length - 1 : prev - 1);
      resetView();
    }
  };

  const handleNext = () => {
    if (allAttachments.length > 1) {
      setCurrentIndex((prev) => prev === allAttachments.length - 1 ? 0 : prev + 1);
      resetView();
    }
  };

  const resetView = () => {
    setZoom(1);
    setRotation(0);
    setIsVideoPlaying(false);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const downloadAttachment = () => {
    try {
      const link = document.createElement('a');
      link.href = currentAttachment.url;
      link.download = currentAttachment.name;
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderPreviewContent = () => {
    if (isImage) {
      return (
        <div className="relative flex-1 flex items-center justify-center bg-gray-900">
          <img
            src={currentAttachment.url}
            alt={currentAttachment.name}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              cursor: zoom > 1 ? 'grab' : 'default'
            }}
            draggable={false}
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="relative flex-1 flex items-center justify-center bg-gray-900">
          <video
            src={currentAttachment.url}
            controls
            className="max-w-full max-h-full"
            style={{ transform: `scale(${zoom})` }}
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <div className="text-center p-8">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">PDF Document</h3>
            <p className="text-gray-600 mb-4">{currentAttachment.name}</p>
            <p className="text-sm text-gray-500 mb-6">
              PDF preview is not available in this browser. Download to view the document.
            </p>
            <Button onClick={downloadAttachment}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      );
    }

    if (isDocument) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <div className="text-center p-8">
            <File className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Document</h3>
            <p className="text-gray-600 mb-4">{currentAttachment.name}</p>
            <p className="text-sm text-gray-500 mb-6">
              Document preview is not available. Download to view the file.
            </p>
            <Button onClick={downloadAttachment}>
              <Download className="h-4 w-4 mr-2" />
              Download File
            </Button>
          </div>
        </div>
      );
    }

    // Fallback for unknown file types
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <File className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">File</h3>
          <p className="text-gray-600 mb-4">{currentAttachment.name}</p>
          <p className="text-sm text-gray-500 mb-6">
            Preview not available for this file type.
          </p>
          <Button onClick={downloadAttachment}>
            <Download className="h-4 w-4 mr-2" />
            Download File
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 bg-black">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black text-white border-b border-gray-800">
            <div className="flex items-center space-x-4">
              <h2 className="font-medium truncate max-w-md">{currentAttachment.name}</h2>
              <span className="text-sm text-gray-400">
                {formatFileSize(currentAttachment.size)}
              </span>
              {allAttachments.length > 1 && (
                <span className="text-sm text-gray-400">
                  {currentIndex + 1} of {allAttachments.length}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Navigation for multiple attachments */}
              {allAttachments.length > 1 && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handlePrevious}
                    className="text-white hover:bg-gray-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleNext}
                    className="text-white hover:bg-gray-800"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Image/Video controls */}
              {isImage && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.25}
                    className="text-white hover:bg-gray-800"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="text-white hover:bg-gray-800"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleRotate}
                    className="text-white hover:bg-gray-800"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </>
              )}

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={downloadAttachment}
                className="text-white hover:bg-gray-800"
              >
                <Download className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-white hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          {renderPreviewContent()}

          {/* Footer with file info */}
          <div className="p-4 bg-black text-white border-t border-gray-800">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div>
                Uploaded: {new Date(currentAttachment.uploadDate).toLocaleString()}
              </div>
              <div>
                Type: {currentAttachment.type}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AttachmentGrid({ attachments, onPreview, showThumbnails = true }: AttachmentGridProps) {
  const getFileIcon = (type: string, name: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-8 w-8" />;
    if (type.startsWith('video/')) return <Video className="h-8 w-8" />;
    if (type === 'application/pdf') return <FileText className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!showThumbnails) {
    return (
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div 
            key={attachment.id} 
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onPreview(attachment)}
          >
            <div className="flex items-center space-x-3">
              <div className="text-gray-400">
                {getFileIcon(attachment.type, attachment.name)}
              </div>
              <div>
                <p className="font-medium text-sm">{attachment.name}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(attachment.size)} • {new Date(attachment.uploadDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="relative group cursor-pointer rounded-lg border overflow-hidden hover:shadow-md transition-all duration-200"
          onClick={() => onPreview(attachment)}
        >
          {/* Thumbnail */}
          <div className="aspect-square bg-gray-100 flex items-center justify-center">
            {attachment.preview ? (
              <img
                src={attachment.preview}
                alt={attachment.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400">
                {getFileIcon(attachment.type, attachment.name)}
              </div>
            )}
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* File info */}
          <div className="p-2 bg-white">
            <p className="font-medium text-xs truncate">{attachment.name}</p>
            <p className="text-xs text-gray-500">
              {formatFileSize(attachment.size)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}