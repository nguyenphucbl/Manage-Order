/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface UseImagePreviewProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  previewField: Path<T>;
}

export function useImagePreview<T extends FieldValues>({
  form,
  previewField,
}: UseImagePreviewProps<T>) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const avatar = form.watch(previewField as any);
  const handlePreviewImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        const newPreviewUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(newPreviewUrl);
        setFile(selectedFile);
        form.setValue(previewField, newPreviewUrl as any, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } else {
        setPreviewUrl(null);
        setFile(null);
      }
    },
    [previewField, form, previewUrl]
  );
  const resetPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
  }, [previewUrl]);
  const previewImage = previewUrl || avatar || undefined;
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  return {
    file,
    previewImage,
    handlePreviewImage,
    setFile,
    setPreviewUrl,
    previewUrl,
    resetPreview,
  };
}
