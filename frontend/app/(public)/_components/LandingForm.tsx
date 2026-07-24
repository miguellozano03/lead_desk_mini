"use client";
import { useState } from "react";

const budgets = ["< $1K", "$1K - $5K", "$5K - $20K", "$20K+"];

interface FormData {
  name: string;
  email: string;
  budget: string;
  message: string;
}

export function LandingForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    budget: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <div>
      <form action="" className="flex-col space-y-8" onSubmit={handleSubmit} method="POST">
        <div>
          <div className="space-y-6">
            <label htmlFor="name" className="mb-2 block text-sm">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Rahul Sharma"
              className="w-full rounded-lg  border px-3 py-2 border-zinc-300"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-6 pt-2">
            <label htmlFor="email" className="mb-2 block text-sm">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              className="w-full rounded-lg  border px-3 py-2 border-zinc-300"
              placeholder="rahul.sharma@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm">Your budget</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {budgets.map((budget) => (
              <label key={budget}>
                <input
                  type="radio"
                  name="budget"
                  value={budget}
                  checked={formData.budget === budget}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <span
                  className="
                      flex h-11 w-full cursor-pointer items-center justify-center
                      rounded-lg border border-zinc-300 px-4 text-sm font-medium
                      transition
                      hover:border-zinc-500
                      peer-checked:border-black
                      peer-checked:bg-black
                      peer-checked:text-white
                    "
                >
                  {budget}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <label htmlFor="message" className="text-sm">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            rows={4}
            placeholder="I need a chatbot for my restaurant..."
            className="w-full resize-none rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-black"
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="
            flex h-11 w-full items-center justify-center
            rounded-lg border border-black
            bg-black px-4 text-sm font-medium text-white
            transition
            hover:bg-zinc-800
            active:scale-[0.98]
            cursor-pointer
          "
        >
          Send
        </button>
      </form>
    </div>
  );
}
