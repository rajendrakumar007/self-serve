import { useState } from "react";
import SubmitClaim from "../Components/SubmitClaimForm";
import ClaimSummary from "../Components/ClaimSummary";
import TrackClaims from "../Components/TrackClaims";

export default function ClaimsModule({ userId }) {
  const [lastClaim, setLastClaim] = useState(null);
  const [mode, setMode] = useState("submit"); // submit | summary | track

  return (
    <div className="space-y-4">
      {mode === "submit" && (
        <SubmitClaim
          userId={userId}
          onSubmitted={(c) => {
            setLastClaim(c);
            setMode("summary");
          }}
        />
      )}

      {mode === "summary" && lastClaim && (
        <ClaimSummary
          claim={lastClaim}
          onSubmitAnother={() => setMode("submit")}
          onTrackClaims={() => setMode("track")}
        />
      )}

      {mode === "track" && <TrackClaims userId={userId} />}
    </div>
  );
}
