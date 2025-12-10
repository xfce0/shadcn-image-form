"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewDialogProps {
  /** URL of the image to preview */
  imageUrl: string;
  /** Optional name for the image */
  imageName?: string;
  /** Aspect ratio for preview (default: 4/3) */
  aspectRatio?: number;
}

/**
 * ImagePreviewDialog - A dialog to preview how image will look with different aspect ratios
 *
 * Features:
 * - Shows original image
 * - Shows how image looks with specified aspect ratio (default 4:3)
 * - Useful tip about image centering
 */
export function ImagePreviewDialog({
  imageUrl,
  imageName,
  aspectRatio = 4 / 3,
}: ImagePreviewDialogProps) {
  const [open, setOpen] = useState(false);

  const aspectRatioStr =
    aspectRatio === 4 / 3
      ? "4:3"
      : aspectRatio === 16 / 9
        ? "16:9"
        : aspectRatio === 1
          ? "1:1"
          : aspectRatio.toFixed(2);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-1 left-1 h-7 w-7 bg-background/80 hover:bg-background"
        onClick={() => setOpen(true)}
        title="Preview image"
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
            <DialogDescription>
              Preview how the image will look with aspect ratio {aspectRatioStr}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Original image */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Original Image</h3>
              <div className="relative w-full overflow-hidden rounded-lg border">
                <Image
                  src={imageUrl}
                  alt={imageName || "Preview"}
                  width={400}
                  height={400}
                  className="w-full h-auto object-contain"
                  unoptimized
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Full image without cropping
              </p>
            </div>

            {/* Card preview */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Card Display ({aspectRatioStr})</h3>
              <div
                className="relative w-full overflow-hidden rounded-lg border bg-gradient-to-br from-muted/30 to-muted/50"
                style={{ aspectRatio }}
              >
                <Image
                  src={imageUrl}
                  alt={imageName || "Preview"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <p className="text-xs text-muted-foreground">
                How it will display in card view
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="font-medium mb-1">Tip:</p>
            <p className="text-muted-foreground">
              Make sure important parts of the image are centered, as the image
              will be cropped to fit the {aspectRatioStr} aspect ratio.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
