import React from 'react'
import { FaCalendarAlt, FaCheckCircle } from 'react-icons/fa'

function PolicySummary() {
  const policies = [
    {
      id: 'AX12345',
      name: 'Motor Insurance',
      status: 'Active',
      nextPayment: '24 Dec 2025'
    },
    {
      id: 'HL56932',
      name: 'Health Insurance',
      status: 'Active',
      renewal: '11 Jan 2026'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      <h4 className="text-xl font-semibold text-textPrimary mb-6">Policy Summary</h4>
      {policies.map((policy, index) => (
        <div
          key={index}
          className="bg-bgCard shadow-sm rounded-md mb-4 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* LEFT SIDE */}
            <div className="md:col-span-2">
              <h6 className="text-base font-semibold text-textPrimary mb-2">
                {policy.name} - Policy #{policy.id}
              </h6>
              <p className="text-textMuted flex items-center mb-1">
                <FaCheckCircle className="text-success mr-2" />
                Status: {policy.status}
              </p>
              {policy.nextPayment && (
                <p className="text-textMuted flex items-center">
                  <FaCalendarAlt className="mr-2 text-info" />
                  Next Payment: {policy.nextPayment}
                </p>
              )}
              {policy.renewal && (
                <p className="text-textMuted flex items-center">
                  <FaCalendarAlt className="mr-2 text-info" />
                  Renewal: {policy.renewal}
                </p>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div className="text-right">
              <button className="border border-primary text-primary px-3 py-1 rounded-md text-sm font-medium mr-2 hover:bg-primaryLight/10 transition">
                View Details
              </button>
              {policy.nextPayment && (
                <button className="bg-primary text-textInverted px-3 py-1 rounded-md text-sm font-medium hover:bg-primaryDark transition">
                  Pay Now
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PolicySummary
