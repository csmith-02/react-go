import { useEffect, useState } from "react"

type Props = {
    word: string,
    speed?: number
}

const TypeWriterComponent = ({ word, speed = 250 }: Props) => {

    const [currentLetters, setCurrentLetters] = useState<string>("")

    useEffect(()=>{
      let i = 0;
      setInterval(()=>{
        if (i < word.length) {
            setCurrentLetters(word.substring(0, i + 1));
            i++;
        }
      }, speed)
      
    }, [word, speed])

    return (
        <>  
            <h1>{currentLetters}</h1>
        </>
    )
}

export default TypeWriterComponent