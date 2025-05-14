"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleErrorApi } from "@/lib/utils";
import { useAccountMe, useAccountMeUpdate } from "@/queries/useAccount";
import { useUploadMediaMutation } from "@/queries/useMedia";
import {
  UpdateMeBody,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UpdateProfileForm() {
  const { data, refetch } = useAccountMe();
  const updateMeMutation = useAccountMeUpdate();
  const uploadMediaMutation = useUploadMediaMutation();
  const profile = data?.payload.data;
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: "",
      avatar: undefined,
    },
  });

  // Lấy các trạng thái của form để kiểm soát UI
  const { isDirty, isSubmitting, isValid } = form.formState;
  const avatar = form.watch("avatar");
  const name = form.watch("name");
  const handleReset = () => {
    form.reset();
    setFile(null);
    setPreviewUrl(null);
  };
  const onSubmit = async (data: UpdateMeBodyType) => {
    if (updateMeMutation.isPending) return;
    try {
      let body = {
        ...data,
      };
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadMediaMutation.mutateAsync(formData);
        const imageUrl = res.payload.data;
        body = {
          ...data,
          avatar: imageUrl,
        };
      }
      const updateMe = await updateMeMutation.mutateAsync(body);
      toast.success("Cập nhật thông tin", {
        description: updateMe.payload.message,
      });
      // Cập nhật lại dữ liệu trong cache
      refetch();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError, duration: 3000 });
    }
  };
  // preview image
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const handlePreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const newPreviewUrl = URL.createObjectURL(selectedFile);

      setPreviewUrl(newPreviewUrl);
      setFile(selectedFile);
      form.setValue("avatar", newPreviewUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      setPreviewUrl(null);
      setFile(null);
    }
  };
  const previewAvatar = useMemo(() => {
    if (previewUrl) {
      return previewUrl;
    }
    return avatar || profile?.avatar || undefined;
  }, [avatar, previewUrl, profile]);
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        avatar: profile.avatar ?? undefined,
      });
    }
  }, [profile, form]);
  console.log("Form state:", {
    isDirty,
    isValid,
    errors: form.formState.errors,
    values: form.getValues(),
    defaultValues: form.formState.defaultValues,
  });
  return (
    <Form {...form}>
      <form
        noValidate
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onReset={handleReset}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card x-chunk="dashboard-07-chunk-0">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatar} alt="Preview" />
                        <AvatarFallback className="rounded-none">
                          {name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={avatarInputRef}
                        onChange={handlePreviewImage}
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => {
                          avatarInputRef.current?.click();
                        }}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="name">Tên</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className=" items-center gap-2 md:ml-auto flex">
                <Button
                  variant="outline"
                  size="sm"
                  type="reset"
                  disabled={!isDirty}
                >
                  Hủy
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  disabled={isSubmitting || !isDirty || !isValid}
                >
                  {isSubmitting ? "Đang cập nhật..." : "Lưu Thông Tin"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
