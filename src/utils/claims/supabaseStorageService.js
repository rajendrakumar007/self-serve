import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not found in environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload document to Supabase Storage and return public URL
 */
export const uploadDocumentToSupabase = async (file, claimId) => {
  try {
    if (!file) {
      throw new Error("File object is missing or undefined");
    }

    console.log("Uploading file:", file.name, "Size:", file.size);

    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `${claimId}/${timestamp}-${file.name}`;
    const filePath = `claims/${fileName}`;

    console.log("Upload path:", filePath);

    const { data, error } = await supabase.storage
      .from("pdfs")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Upload error: ${error.message}`);
    }

    console.log("Upload successful, data:", data);

    const { data: publicData } = supabase.storage
      .from("pdfs")
      .getPublicUrl(filePath);

    if (!publicData?.publicUrl) {
      throw new Error("Failed to generate public URL");
    }

    const documentObj = {
      id: `${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: fileExt,
      url: publicData.publicUrl,
      uploadedAt: new Date().toISOString(),
    };

    console.log("Document object created:", documentObj);
    return documentObj;
  } catch (error) {
    console.error("Error uploading document:", error.message);
    throw error;
  }
};

// Upload multiple documents
export const uploadMultipleDocuments = async (files, claimId) => {
  const uploadPromises = files.map((file) =>
    uploadDocumentToSupabase(file, claimId)
  );
  return Promise.all(uploadPromises);
};
