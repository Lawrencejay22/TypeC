import SelectMode from "./SelectMode.jsx";

export default function Home({ onStartPractice }) {
    return (
        <div className="flex flex-col font-sans w-full max-w-7xl mx-auto justify-center items-center">
            <SelectMode onStartPractice={onStartPractice} />
        </div>
    )
}