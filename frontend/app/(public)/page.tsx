import { LandingForm, LandingCard } from "./_components";

const cardsContent = [
  { title: "24h", content: "Average response time" },
  { title: "50+", content: "Projects completed" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 bg-zinc-50 font-sans dark:bg-black text-zinc-600">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 md:flex-row md:items-center">
        {/*Header*/}

        <div className="hidden sm:flex sm:flex-col justify-center gap-10 md:w-1/2">
          <div className="space-y-4">
            <p className="text-sm text-zinc-400">LeadDesk</p>

            <h2 className="text-4xl font-bold tracking-tight text-zinc-900">
              Tell us about your project
            </h2>

            <p className="max-w-md text-zinc-500">
              Share your ideas with us and let's bring your project to life. Our team will review
              your requirements and get back to you within 24 hours with the best approach for your
              needs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {cardsContent.map((items) => (
              <LandingCard key={items.title} title={items.title} content={items.content} />
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col sm:hidden gap-1">
            <p className="text-sm text-zinc-400">LeadDesk</p>
            <h2 className="text-3xl font-bold text-zinc-900">Tell us about your project</h2>
            <p className="">We will answer in less than 24 hours</p>
          </div>

          <div className="pt-6">
            <LandingForm />
          </div>
        </div>
      </main>
    </div>
  );
}
