import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "@/utils/useUser";
import {
  Plus,
  Trash2,
  Edit3,
  LogOut,
  ExternalLink,
  LayoutDashboard,
  Image as ImageIcon,
  Save,
  X,
  Upload,
  Check,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import upload from "@/app/api/utils/upload";

// Image Upload Component
function ImageUpload({ imageUrl, onImageChange }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;

    // Only accept image files
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload only image files");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(",")[1];
        const result = await upload({ base64 });
        onImageChange(result.url);
        toast.success("Image uploaded!");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-500 uppercase">
        Project Image
      </label>

      {imageUrl ? (
        <div className="relative group">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-800"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
            <label className="cursor-pointer bg-[#00ffff] text-black px-4 py-2 rounded-lg font-bold hover:shadow-[0_0_10px_#00ffff] transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              Change
            </label>
            <button
              onClick={() => onImageChange("")}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-all"
            >
              Remove
            </button>
          </div>
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
            <Check size={12} /> Uploaded
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive
              ? "border-[#00ffff] bg-[#00ffff]/5"
              : "border-gray-800 bg-[#1a1a1a] hover:border-gray-700"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-[#00ffff] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-bold">UPLOADING...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="text-gray-600" size={40} />
              <div>
                <p className="text-white font-bold mb-1">
                  Drop image here or click to upload
                </p>
                <p className="text-gray-500 text-xs">
                  JPG, PNG, GIF, WEBP supported
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { data: user, loading: userLoading } = useUser();
  const queryClient = useQueryClient();
  const [editingProject, setEditingProject] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    problem: "",
    solution: "",
    technologies: "",
    category: "",
    image_url: "",
    live_link: "",
    github_link: "",
  });

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }
  }, [user, userLoading]);

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : "/api/projects";
      const method = editingProject ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      toast.success(editingProject ? "Project updated!" : "Project created!");
      handleCloseForm();
    },
    onError: () => toast.error("Error saving project"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      toast.success("Project deleted");
    },
  });

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      problem: project.problem || "",
      solution: project.solution || "",
      technologies: project.technologies || "",
      category: project.category || "",
      image_url: project.image_url || "",
      live_link: project.live_link || "",
      github_link: project.github_link || "",
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      problem: "",
      solution: "",
      technologies: "",
      category: "",
      image_url: "",
      live_link: "",
      github_link: "",
    });
  };

  if (userLoading || !user)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#ff00ff]">
        VERIFYING ADMIN...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans">
      <Toaster theme="dark" position="top-right" />

      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-gray-800 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
            <LayoutDashboard className="text-[#ff00ff]" />
            PROJECT <span className="text-[#ff00ff]">CMS</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Logged in as: {user.email}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-[#00ffff] text-black px-6 py-2 rounded-lg font-bold hover:shadow-[0_0_15px_#00ffff] transition-all"
          >
            <Plus size={18} /> ADD PROJECT
          </button>
          <a
            href="/account/logout"
            className="flex items-center gap-2 border border-red-500/50 text-red-400 px-6 py-2 rounded-lg font-bold hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} /> LOGOUT
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {projectsLoading ? (
          <div className="text-center py-20 text-gray-500">
            Loading projects...
          </div>
        ) : (
          <div className="grid gap-4">
            {projects?.map((project) => (
              <div
                key={project.id}
                className="bg-[#121212] border border-gray-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-[#ff00ff]/30 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-lg bg-[#1a1a1a] overflow-hidden border border-gray-800 flex-shrink-0">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="text-gray-700" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <p className="text-gray-500 text-sm">
                      {project.category || "No Category"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
                  >
                    <Edit3 size={18} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this project?"))
                        deleteMutation.mutate(project.id);
                    }}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 p-3 bg-red-900/20 text-red-500 border border-red-900/50 rounded-lg hover:bg-red-900/40 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-gray-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingProject ? "EDIT PROJECT" : "NEW PROJECT"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-white"
              >
                <X />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Title
                  </label>
                  <input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white focus:border-[#ff00ff] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Category
                  </label>
                  <input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g. Web Dev"
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white focus:border-[#ff00ff] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white focus:border-[#ff00ff] outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Problem
                  </label>
                  <input
                    value={formData.problem}
                    onChange={(e) =>
                      setFormData({ ...formData, problem: e.target.value })
                    }
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white focus:border-[#ff00ff] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Solution
                  </label>
                  <input
                    value={formData.solution}
                    onChange={(e) =>
                      setFormData({ ...formData, solution: e.target.value })
                    }
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white focus:border-[#ff00ff] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Technologies (Comma separated)
                </label>
                <input
                  value={formData.technologies}
                  onChange={(e) =>
                    setFormData({ ...formData, technologies: e.target.value })
                  }
                  placeholder="React, Next.js, Tailwind"
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white focus:border-[#ff00ff] outline-none"
                />
              </div>

              <ImageUpload
                imageUrl={formData.image_url}
                onImageChange={(url) =>
                  setFormData({ ...formData, image_url: url })
                }
              />

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Live Demo Link
                  </label>
                  <input
                    value={formData.live_link}
                    onChange={(e) =>
                      setFormData({ ...formData, live_link: e.target.value })
                    }
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white focus:border-[#ff00ff] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    GitHub Link
                  </label>
                  <input
                    value={formData.github_link}
                    onChange={(e) =>
                      setFormData({ ...formData, github_link: e.target.value })
                    }
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white focus:border-[#ff00ff] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 flex gap-4">
              <button
                onClick={() => saveMutation.mutate(formData)}
                disabled={saveMutation.isLoading}
                className="flex-1 bg-[#ff00ff] text-white py-3 rounded-lg font-bold hover:shadow-[0_0_15px_#ff00ff] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={18} />{" "}
                {saveMutation.isLoading ? "SAVING..." : "SAVE PROJECT"}
              </button>
              <button
                onClick={handleCloseForm}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-700 transition-all"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
