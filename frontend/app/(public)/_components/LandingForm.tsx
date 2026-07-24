"use client";

import { useState } from "react";
import { ErrorMessage } from "./ErrorMessage";
import { LeadFormData, LeadSchema } from "@/lib/validations/lead.schema";

const budgets = ["< $1K", "$1K - $5K", "$5K - $20K", "$20K+"];

export function LandingForm() {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    email: "",
    budget: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = LeadSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as Record<string, string>);
      return;
    }

    setErrors({});
    console.log(result.data);
  };

  return (
    <div>
      <form className="flex-col space-y-8" onSubmit={handleSubmit} method="POST">
        <div>
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm">
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Rahul Sharma"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2"
              value={formData.name}
              onChange={handleChange}
            />

            <ErrorMessage message={errors.name} />
          </div>

          <div className="space-y-2 pt-4">
            <label htmlFor="email" className="block text-sm">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="text"
              placeholder="rahul.sharma@example.com"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2"
              value={formData.email}
              onChange={handleChange}
            />

            <ErrorMessage message={errors.email} />
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

                <span className="flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-zinc-300 px-4 text-sm font-medium transition hover:border-zinc-500 peer-checked:border-black peer-checked:bg-black peer-checked:text-white">
                  {budget}
                </span>
              </label>
            ))}
          </div>

          <ErrorMessage message={errors.budget} />
        </div>

        <div className="space-y-2">
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

          <ErrorMessage message={errors.message} />
        </div>

        <button
          type="submit"
          className="
            flex h-11 w-full items-center justify-center
            rounded-lg border border-black
            bg-black px-4 text-sm font-medium text-white
            transition hover:bg-zinc-800
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
