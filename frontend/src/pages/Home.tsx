
import TypeWriterComponent from "../components/TypeWriterComponent"

const Home = () => {
    return (
        <>
            <div className="flex-1 flex flex-col gap-4 justify-center items-center font-bold text-5xl">
                <TypeWriterComponent word="Golang + React :)" speed={200} />
            </div>
        </>
    )
}

export default Home