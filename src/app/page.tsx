"use client";

import { useState } from "react";
import { ImageUpload, type ImageItem } from "@/components/image-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function HomePage() {
  const [images, setImages] = useState<ImageItem[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted images:", images);
    alert(`Submitted ${images.length} images!\nCheck console for details.`);
  };

  const handleReset = () => {
    setImages([]);
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Image Upload Form Template
          </h1>
          <p className="text-muted-foreground">
            A complete image upload solution with crop, preview, reorder and cover
            selection
          </p>
        </div>

        {/* Demo Form */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              Upload product images. First image will be used as cover.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Images</Label>
                <ImageUpload
                  images={images}
                  onChange={setImages}
                  maxImages={10}
                  enableCrop
                  enablePreview
                  enableReorder
                  showCoverBadge
                  coverBadgeLabel="Cover"
                  aspectRatio={4 / 3}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={images.length === 0}>
                  Save Images
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 md:grid-cols-2">
              <li className="flex items-center gap-2">
                <span className="text-primary">-</span>
                Drag & drop file upload
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">-</span>
                Multiple file selection
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">-</span>
                Image validation (type, size)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">-</span>
                Image cropping with react-easy-crop
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">-</span>
                Aspect ratio preview (4:3 by default)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">-</span>
                Cover image selection
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">-</span>
                Drag to reorder images
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">-</span>
                Dark mode support
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Debug Output */}
        {images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Debug: Current Images</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-48">
                {JSON.stringify(
                  images.map((img) => ({
                    id: img.id,
                    url: img.url.substring(0, 50) + "...",
                    hasFile: !!img.file,
                  })),
                  null,
                  2
                )}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
