import { useEffect, useState } from "react";
import API from "../services/api";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const downloadFile = async (id) => {
    try {
      const res = await API.get(`/files/download/${id}`);
      window.open(res.data.url, "_blank");
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
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">My Files</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <p className="text-gray-600">Uploading...</p>
          ) : isDragActive ? (
            <p className="text-blue-600 font-semibold">Drop your file here</p>
          ) : (
            <div>
              <p className="text-gray-600 font-semibold">Drag & drop your file here</p>
              <p className="text-gray-500 text-sm mt-1">or click to select a file</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Files ({files.length})
          </h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading files...</p>
          ) : files.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No files uploaded yet</p>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {files.map((f) => (
                    <tr key={f._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{f.fileName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {f.fileSize ? (f.fileSize / 1024 / 1024).toFixed(2) + " MB" : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right space-x-4 flex justify-end">
                        <button
                          onClick={() => downloadFile(f._id)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => deleteFile(f._id)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
