import { Coins, Leaf, Notebook, Trash, Users } from "lucide-react";

const companies = ["Google", "Amazon", "Figma", "Netflix", "Meta", "Microsoft", "Pinterest", "Slack", "Spotify", "Oracle", "Walmart"];

const appBenefits = [
    {
        "title": "Eco-Friendly",
        "desc": "Contribute to a cleaner environment by reporting and collecting waste.",
        "img": Leaf
    },
    {
        "title": "Earn Rewards",
        "desc": "Get tokens for your contributions to waste management efforts.",
        "img": Coins
    },
    {
        "title": "Community-Driven",
        "desc": "Be part of a growing community committed to sustainable practices.",
        "img": Users
    },
    
]

const work = [
    {
        "name": "Report Waste",
        "desc": "Report waste in your environment",
        "img": Notebook
    },
    {
        "name": "Collect Waste",
        "desc": "Collect waste among reports",
        "img": Trash
    },
    {
        "name": "Collect Points and Earn Rewads",
        "desc": "Exchange collected points with rewards",
        "img": Coins
    }
]


const testimonials = [
    {
        "name": "Shivam Patel",
        "testimonial": "This job portal made job search easy and quick. Recommended to all job seekers!",
        "rating": 5
    },
    {
        "name": "Abhishek Kullu",
        "testimonial": "Found my dream job within a week! The application process was smooth.",
        "rating": 5
    },
    {
        "name": "Swapnil Pandey",
        "testimonial": "I secured a job offer within days of applying. Exceptional user experience and support.",
        "rating": 4
    },
    {
        "name": "Pavan Barnana",
        "testimonial": "Highly efficient job portal with excellent resources. Helped me land a great position.",
        "rating": 4
    }
]
const footerLinks = [
    { title: "Product", links: ["Report", "Collect", "Earn Rewards"] },
    { title: "Company", links: ["About Us", "Contact Us",] },
    { title: "Support", links: ["Ask Ai", "Conversation"] }

]
export { companies, appBenefits, work, testimonials, footerLinks };