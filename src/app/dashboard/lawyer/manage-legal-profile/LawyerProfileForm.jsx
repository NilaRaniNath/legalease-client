"use client";

import { useState } from "react";
import { 
  Button, Card, Avatar, Chip, Modal,
  ModalBody, ModalHeader, ModalFooter, ModalContainer 
} from "@heroui/react";
import { Plus, Edit3, Trash2, Upload, DollarSign, Briefcase, User } from "lucide-react";
import Swal from "sweetalert2"; 

export default function LawyerProfileForm({ currentUserId, initialProfile, initialServices }) {
  const [profile, setProfile] = useState({
    userId: currentUserId,
    name: initialProfile?.name || "",
    specialization: initialProfile?.specialization || "",
    fee: initialProfile?.fee || "",
    bio: initialProfile?.bio || "",
    image: initialProfile?.image || "",
    status: initialProfile?.status || "Available"
  });

  const [services, setServices] = useState(initialServices || []);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [currentService, setCurrentService] = useState({ _id: "", serviceName: "", description: "", price: "" });

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const imgData = await res.json();

      if (imgData.success) {
        setProfile((prev) => ({ ...prev, image: imgData.data.display_url }));
        Swal.fire({ icon: "success", title: "Image uploaded successfully!", toast: true, position: "top-end", showConfirmButton: false, timer: 2000 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/lawyer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ title: "Success!", text: "Profile updated perfectly!", icon: "success" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleServiceSubmit = async () => {
    const endpoint = modalType === "add" ? "/api/lawyer/services" : `/api/lawyer/services/${currentService._id}`;
    const method = modalType === "add" ? "POST" : "PUT";

    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentService, userId: currentUserId }),
      });
      const data = await res.json();

      if (data.success) {
        if (modalType === "add") {
          setServices((prev) => [...prev, data.data]);
        } else {
          setServices((prev) => prev.map((s) => (s._id === currentService._id ? data.data : s)));
        }
        onClose();
        Swal.fire({ icon: "success", title: `Service ${modalType === "add" ? "Added" : "Updated"}!`, toast: true, position: "top-end", showConfirmButton: false, timer: 2000 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (serviceId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this service!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:8000/api/lawyer/services/${serviceId}`, { method: "DELETE" });
          const data = await res.json();
          if (data.success) {
            setServices((prev) => prev.filter((s) => s._id !== serviceId));
            Swal.fire("Deleted!", "Your legal service has been deleted.", "success");
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 text-slate-100 p-4">
      {/* বাম পাশ: প্রোফাইল ফর্ম (Modern Navy Theme) */}
      <Card className="lg:col-span-1 bg-[#152238] border border-slate-700/50 p-6 rounded-2xl h-fit space-y-6 shadow-xl shadow-black/20">
        <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-slate-700/50">
          <div className="relative group">
            <Avatar 
              src={profile.image || null} 
              className="w-24 h-24 rounded-2xl bg-[#0B1524] border border-slate-600 group-hover:border-sky-400 transition-all"
              fallback={<User className="w-10 h-10 text-slate-400" />}
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-2xl cursor-pointer transition-opacity duration-200">
              <Upload className="w-5 h-5 text-sky-400" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          {uploadingImage && <p className="text-xs text-blue-400 animate-pulse">Uploading to ImgBB...</p>}
          <h3 className="font-bold text-lg text-slate-100">{profile.name || "Your Name"}</h3>
          <Chip color={profile.status === "Available" ? "success" : "danger"} variant="flat" size="sm" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{profile.status}</Chip>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          {/* ১. Full Name */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-slate-400">Full Name</label>
            <input 
              type="text" 
              placeholder="Enter official name" 
              value={profile.name} 
              onChange={(e) => setProfile({...profile, name: e.target.value})} 
              required 
              className="w-full px-4 py-2.5 bg-[#0B1524] border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 hover:border-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          {/* ২. Specialization Field */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-sky-400">Specialization Field</label>
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Briefcase className="w-4 h-4 text-slate-500" />
              </span>
              <input 
                type="text" 
                placeholder="e.g., Corporate Law" 
                value={profile.specialization} 
                onChange={(e) => setProfile({...profile, specialization: e.target.value})} 
                required 
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B1524] border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 hover:border-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          {/* ৩. Consultation Fee */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-sky-400">Consultation Fee ($/hr)</label>
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <DollarSign className="w-4 h-4 text-slate-500" />
              </span>
              <input 
                type="number" 
                placeholder="0.00" 
                value={profile.fee} 
                onChange={(e) => setProfile({...profile, fee: e.target.value})} 
                required 
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B1524] border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 hover:border-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          {/* ৪. Professional Bio */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-sky-400">Professional Bio</label>
            <textarea 
              placeholder="Describe your experience..." 
              rows={4} 
              value={profile.bio} 
              onChange={(e) => setProfile({...profile, bio: e.target.value})} 
              required 
              className="w-full px-4 py-2.5 bg-[#0B1524] border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 hover:border-slate-600 focus:outline-none focus:border-sky-500 transition-colors resize-none"
            />
          </div>

          <Button type="submit" className="w-full font-bold shadow-lg shadow-sky-500/10 bg-sky-500 hover:bg-sky-600 text-slate-900 py-2.5" radius="xl">
            Save Profile Info
          </Button>
        </form>
      </Card>

      {/* ডান পাশ: সার্ভিসেস টেবিল (Modern Navy Theme) */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-[#152238] border border-slate-700/50 p-6 rounded-2xl space-y-4 shadow-xl shadow-black/20">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-100">Manage Services</h2>
              <p className="text-xs text-slate-400">Add or edit core legal operations you list on your details page.</p>
            </div>
            <Button 
              onPress={() => { setModalType("add"); setCurrentService({ _id: "", serviceName: "", description: "", price: "" }); onOpen(); }} 
              variant="flat" startContent={<Plus className="w-4 h-4" />} radius="xl" className="font-semibold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20"
            >
              Add Service
            </Button>
          </div>

          <div className="overflow-x-auto w-full rounded-2xl border border-slate-700/50 bg-[#0B1524]">
            <table className="w-full text-left border-collapse text-slate-300">
              <thead>
                <tr className="border-b border-slate-700/50 bg-[#111C2E]">
                  <th className="p-4 text-xs font-bold tracking-wider text-slate-400 uppercase">SERVICE NAME</th>
                  <th className="p-4 text-xs font-bold tracking-wider text-slate-400 uppercase">DESCRIPTION</th>
                  <th className="p-4 text-xs font-bold tracking-wider text-slate-400 uppercase">PRICE</th>
                  <th className="p-4 text-xs font-bold tracking-wider text-slate-400 uppercase text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-sm text-slate-500">
                      No special legal services added yet.
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr key={service._id} className="border-b border-slate-800 hover:bg-[#111C2E] transition-colors text-sm">
                      <td className="p-4 font-semibold text-slate-100">{service.serviceName}</td>
                      <td className="p-4 max-w-xs truncate text-slate-400">{service.description}</td>
                      <td className="p-4 text-emerald-400 font-bold">${service.price}</td>
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-2">
                          <Button isIconOnly size="sm" variant="light" color="warning" onPress={() => { setModalType("edit"); setCurrentService(service); onOpen(); }}><Edit3 className="w-4.5 h-4.5 text-amber-400" /></Button>
                          <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDeleteService(service._id)}><Trash2 className="w-4 h-4 text-rose-400" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modern Navy Theme উপযোগী HeroUI মোডাল */}
      <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" className="bg-[#152238] text-slate-100 border border-slate-700 rounded-2xl max-w-md mx-auto">
       
        <ModalContainer>
          {() => (
            <>
              <ModalHeader className="font-bold text-xl border-b border-slate-700 text-slate-100">
                {modalType === "add" ? "Add New Legal Service" : "Edit Service Details"}
              </ModalHeader>
              
              <ModalBody className="space-y-4 py-6 text-slate-300">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-400">Service Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Document Review" 
                    value={currentService.serviceName} 
                    onChange={(e) => setCurrentService({...currentService, serviceName: e.target.value})} 
                    className="w-full px-4 py-2.5 bg-[#0B1524] border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 hover:border-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-400">Description</label>
                  <textarea 
                    placeholder="What does this package include?" 
                    rows={3} 
                    value={currentService.description} 
                    onChange={(e) => setCurrentService({...currentService, description: e.target.value})} 
                    className="w-full px-4 py-2.5 bg-[#0B1524] border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 hover:border-slate-600 focus:outline-none focus:border-sky-500 transition-colors resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-400">Service Cost ($)</label>
                  <input 
                    type="number" 
                    placeholder="Fixed pricing format" 
                    value={currentService.price} 
                    onChange={(e) => setCurrentService({...currentService, price: e.target.value})} 
                    className="w-full px-4 py-2.5 bg-[#0B1524] border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 hover:border-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </ModalBody>
              
              <ModalFooter className="border-t border-slate-700">
                <Button variant="flat" className="text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/10" onPress={onClose}>Cancel</Button>
                <Button className="font-bold bg-sky-500 hover:bg-sky-600 text-slate-900" onPress={handleServiceSubmit}>
                  {modalType === "add" ? "Create Service" : "Apply Changes"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContainer>
      </Modal>
    </div>
  );
}