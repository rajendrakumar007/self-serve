export const policyDisplayMessages = (type) => {
    switch (type) {
        case "car":
            return {
                title: "Car Insurance Plans",
                tagLine: "Choose from our curated list of car insurance plans and add-ons."
            };
        case "bike":
            return {
                title: "Bike Insurance Plans",
                tagLine: "Pick comprehensive or third-party two-wheeler cover with add-ons."
            };
        case "health":
            return {
                title: "Health Insurance Plans",
                tagLine: "Explore our health insurance options for you and your family."
            };
        case "life":
            return {
                title: "Life Insurance Plans",
                tagLine: "Secure your   family's future with our life insurance policies."
            };
        case "travel":
            return {
                title: "Travel Insurance Plans",
                tagLine: "Travel with peace of mind using our comprehensive travel insurance."
            };
        case "airpass":
            return {
                title: "Air Pass Insurance Plans",
                tagLine: "Get the best air pass insurance for frequent flyers."
            };
        default:
            return {
                title: "Insurance Plans",
                tagLine: "Explore our insurance options."
            };
    }
};