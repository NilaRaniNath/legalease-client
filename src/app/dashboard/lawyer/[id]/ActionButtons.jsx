// app/dashboard/lawyer/[id]/ActionButtons.jsx
"use client";

import { useState } from "react";
import { Button, Modal } from "@heroui/react"; // 👈 useDisclosure পুরোপুরি রিমুভ করা হয়েছে
import { CalendarCheck, ShieldAlert } from "lucide-react";

export default function ActionButtons({ lawyerId, lawyerName, fee, specialisation, user }) {
  // React-এর নিজস্ব স্টেট দিয়ে মডাল ওপেন/ক্লোজ কন্ট্রোল
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hiringSuccess, setHiringSuccess] = useState(false);

  const confirmHiring = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:8000/api/user/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          lawyerId,
          lawyerName,
          specialisation,
          fee
        })
      });

      if (response.ok) {
        setHiringSuccess(true);
        setTimeout(() => {
          setIsOpen(false); // মডাল ক্লোজ
          setHiringSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Hiring request failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Button color="warning" variant="flat" className="w-full font-medium py-6" disabled>
        Please Login as a User to Request Hiring
      </Button>
    );
  }

  if (user.role !== "user") {
    return (
      <p className="text-xs text-amber-500 flex items-center gap-1.5 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
        <ShieldAlert className="w-4 h-4 flex-shrink-0" />
        Hiring is only permitted for client accounts. Current Role: <span className="capitalize font-bold">{user.role}</span>
      </p>
    );
  }

  return (
    <>
      <Button 
        color="primary" 
        className="w-full font-bold py-6 text-base shadow-lg shadow-blue-600/10 cursor-pointer"
        startContent={<CalendarCheck className="w-5 h-5" />}
        onClick={() => setIsOpen(true)} // 👈 বাটনে ক্লিক করলে স্টেট true হবে
      >
        Send Hiring Request
      </Button>

      {/* HeroUI মডাল কন্ট্রোল */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} backdrop="blur">
        <Modal.Content className="bg-slate-900 border border-white/10 text-foreground">
          {() => (
            <>
              <Modal.Header>Confirm Consultation Request</Modal.Header>
              <Modal.Body className="text-sm space-y-2">
                {hiringSuccess ? (
                  <div className="p-4 bg-success-500/10 border border-success-500/20 rounded-xl text-success font-semibold text-center">
                    🎉 Hiring request submitted successfully!
                  </div>
                ) : (
                  <>
                    <p>You are requesting a legal consultation with <strong>{lawyerName}</strong>.</p>
                    <ul className="list-disc pl-5 text-xs text-gray-400">
                      <li>Specialization: {specialisation}</li>
                      <li>Consultation Base Fee: ৳{fee}</li>
                    </ul>
                  </>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="light" color="danger" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                {!hiringSuccess && (
                  <Button color="primary" isLoading={isSubmitting} onClick={confirmHiring}>
                    Confirm Request
                  </Button>
                )}
              </Modal.Footer>
            </>
          )}
        </Modal.Content>
      </Modal>
    </>
  );
}