
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar"; // <-- fixed path


const StoryPage = () => {
  return (
    <>
      <Navbar />

      <main className="max-w-4xl mx-auto p-6">
        <section className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            How Insurance Changed Everything For The Mehta Family
          </h1>
          <article className="space-y-6 text-textPrimary leading-relaxed">
            <p>
            Life can change in a moment. For the Mehta family, that moment came
            on a rainy evening when an unexpected medical emergency turned their
            world upside down.
            </p>
          </article>
        </section>

        <article className="space-y-6 text-textPrimary leading-relaxed">
          <p>
            When Mr. Mehta collapsed at home due to a sudden cardiac arrest, his
            family was terrified. They rushed him to the nearest hospital, but
            the thought of approvals, bills, and paperwork loomed large. In
            those critical minutes, every second mattered.
          </p>

          <p>
            Thanks to their <strong>SelfServe Health Policy</strong>, the
            hospital initiated a cashless admission within minutes. No frantic
            calls. No running for documents. The policy handled everything
            automatically from pre authorization to payment.
          </p>

          <p>
            While doctors focused on saving Mr. Mehta, the family focused on
            being there for him. The insurance covered hospitalization, surgery,
            and even post-treatment care. The claim was settled instantly, and
            the family didn’t spend a single rupee out of pocket.
          </p>

          <blockquote className="bg-primary/10 border-l-4 border-primary p-4 italic text-lg">
            “ We didn’t just get financial support we got peace of mind when we
            needed it the most. ”
          </blockquote>

          <p>
            Today, Mr. Mehta is back home, healthy and grateful. For the Mehta
            family insurance wasn’t just a policy, it was a lifeline.
          </p>
        </article>

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-block bg-primary text-textInverted px-6 py-2 rounded-md hover:bg-primaryDark transition"
          >
            Back to Home
          </Link>
        </div>
      </main>

    
    </>
  );
};

export default StoryPage;
