import { useParams } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { getPolicies } from "../../utils/policies/policies";
import PolicyCard from "../../components/policies/PolicyCard";
import { policyDisplayMessages } from './policyDisplayMessages';

const PolicyPage = () => {
    const {type = ""} = useParams();
    const policies = getPolicies({ type })
    const messages = policyDisplayMessages(type);
    return (
        <>
            <Navbar />
            <main className="max-w-6xl mx-auto p-6">
                <section className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">{messages.title}</h1>
                    <p className="text-textSecondary">
                        {messages.tagLine}
                    </p>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {policies.map((p) => (
                        <PolicyCard key={p.id} p={p} />
                    ))}
                </section>
            </main>
        </>
    );
};

export default PolicyPage