import { useEffect, useState } from "react";
import API from "../services/api";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Upload, Trash2, FileText, User } from "lucide-react";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const displayFiles = files;

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await API.get("/files");
      setFiles(res.data || []);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error("Failed to load files");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const onDrop = async (acceptedFiles) => {
    if (!acceptedFiles.length) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);

      await API.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded successfully");
      fetchFiles();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "File upload failed";
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const { getInputProps, getRootProps, isDragActive } = useDropzone({ onDrop });

  const formatBytes = (bytes = 0) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const totalFiles = displayFiles.length;
  const totalBytes = displayFiles.reduce(
    (sum, f) => sum + (f.fileSize || f.size || 0),
    0
  );

  const downloadFile = async (file) => {
    try {
      const res = await API.get(`/files/download/${file._id}`, {
        responseType: "blob",
      });

      const contentType = res.headers?.["content-type"] || "";
      const disposition = res.headers?.["content-disposition"] || "";

      if (contentType.includes("application/json")) {
        const text = await res.data.text();
        const payload = JSON.parse(text);
        if (payload?.url) {
          window.open(payload.url, "_blank");
          return;
        }
        throw new Error("Download URL not found");
      }

      const fileNameMatch = disposition.match(/filename="?([^";]+)"?/);
      const resolvedName = fileNameMatch?.[1] || file.fileName || "download";
      const blobUrl = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = resolvedName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error("Failed to download file");
    }
  };

  const deleteFile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await API.delete(`/files/${id}`);
      toast.success("File deleted successfully");
      fetchFiles();
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const userName = localStorage.getItem("userName") || "Current user";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-white/80">Signed in as {userName}</p>
              <h1 className="text-2xl font-semibold">My Drive</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 border border-white/30 rounded-lg text-base font-medium text-white hover:bg-white/10 transition"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
            <label className="px-5 py-2.5 bg-white text-indigo-700 rounded-lg text-base font-semibold transition flex items-center gap-2 cursor-pointer hover:bg-white/90">
              <Upload className="w-4 h-4" />
              Upload
              <input {...getInputProps()} className="hidden" />
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500">Total files</p>
            <p className="text-2xl font-semibold text-gray-800 mt-1">{totalFiles}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500">Storage used</p>
            <p className="text-2xl font-semibold text-gray-800 mt-1">{formatBytes(totalBytes)}</p>
          </div>
          <div
            {...getRootProps()}
            className={`rounded-xl border border-dashed p-5 flex items-center justify-between gap-4 cursor-pointer transition ${
              isDragActive
                ? "bg-indigo-50 border-indigo-400"
                : "bg-white border-gray-200 hover:border-indigo-300"
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {isDragActive ? "Drop to upload" : "Quick upload"}
              </p>
              <p className="text-xs text-gray-500">Drag & drop a file here</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Upload className="w-5 h-5" />
            </div>
            <input {...getInputProps()} />
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">Files</h2>
            <span className="text-xs text-gray-500">{displayFiles.length} items</span>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading files...</div>
          ) : displayFiles.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No files uploaded yet</div>
          ) : (
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase w-1/2">
                    Name
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase w-1/4">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right w-1/4">
                    Size
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayFiles.map((f) => (
                  <tr key={f._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-800">{f.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-gray-600" />
                        </div>
                        <span className="text-sm text-gray-700">
                          {f.uploadedBy || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span className="text-sm text-gray-700">
                          {f.fileSize
                            ? (f.fileSize / 1024 / 1024 / 1024).toFixed(1) + " GB"
                            : "N/A"}
                        </span>
                        <button
                          onClick={() => downloadFile(f)}
                          className="text-blue-600 hover:text-blue-700 text-sm px-2 py-1"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => deleteFile(f._id)}
                          className="text-red-600 hover:text-red-700 text-sm px-2 py-1"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
