"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Area, Point } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crop, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface ImageCropDialogProps {
  /** URL of the image to crop */
  imageUrl: string;
  /** Optional name for the image (used in file naming) */
  imageName?: string;
  /** Aspect ratio for cropping (default: 4/3) */
  aspectRatio?: number;
  /** Callback when crop is complete - receives the cropped image as a blob or data URL */
  onCropComplete: (croppedImage: Blob | string) => void;
  /** If true, returns Data URL instead of Blob */
  returnDataUrl?: boolean;
  /** Dialog title */
  title?: string;
  /** Dialog description */
  description?: string;
}

/**
 * ImageCropDialog - A dialog component for cropping images
 *
 * Features:
 * - Drag to pan the image
 * - Zoom slider for scaling
 * - Configurable aspect ratio
 * - Returns cropped image as Blob or Data URL
 */
export function ImageCropDialog({
  imageUrl,
  imageName,
  aspectRatio = 4 / 3,
  onCropComplete,
  returnDataUrl = false,
  title = "Crop Image",
  description = "Adjust the image for display (aspect ratio 4:3)",
}: ImageCropDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropChange = useCallback((location: Point) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteCallback = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // Helper to load an image from URL
  const createImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      // Only set crossOrigin for external URLs
      if (
        !url.startsWith("/uploads") &&
        !url.startsWith(window.location.origin) &&
        !url.startsWith("data:")
      ) {
        image.setAttribute("crossOrigin", "anonymous");
      }
      image.src = url;
    });
  };

  // Create cropped image using canvas
  const createCroppedImage = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<Blob | string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    // Set canvas size to cropped area
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    if (returnDataUrl) {
      return canvas.toDataURL("image/jpeg", 0.95);
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) {
      toast({
        title: "Error",
        description: "No crop area selected",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const croppedImage = await createCroppedImage(imageUrl, croppedAreaPixels);
      onCropComplete(croppedImage);
      setOpen(false);

      // Reset state for next use
      setCrop({ x: 0, y: 0 });
      setZoom(1);

      toast({
        title: "Success",
        description: "Image cropped successfully",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to crop image";
      toast({
        title: "Crop Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-7 w-7 bg-background/80 hover:bg-background"
        onClick={() => setOpen(true)}
        title="Crop image"
      >
        <Crop className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Cropper */}
            <div className="relative w-full h-[400px] bg-muted rounded-lg overflow-hidden">
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropCompleteCallback}
              />
            </div>

            {/* Zoom control */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Zoom</label>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(value) => setZoom(value[0])}
                className="w-full"
              />
            </div>

            {/* Instructions */}
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-medium mb-1">Instructions:</p>
              <ul className="text-muted-foreground space-y-1">
                <li>- Drag to select the desired area</li>
                <li>- Use the slider to zoom in/out</li>
                <li>
                  - Aspect ratio {aspectRatio === 4 / 3 ? "4:3" : aspectRatio.toFixed(2)} ensures
                  correct display
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
