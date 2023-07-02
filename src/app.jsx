import { useState } from 'preact/hooks'
import duckLogo from './assets/duck.gif'
import './app.css'

export function App() {
  const [balanceInfo, setBalanceInfo] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const baseUrl = "http://10.0.0.17:8080"

  const passwordPrompt = async () => {
    const question = await fetchQuestion()
    const password = window.prompt(question);
    return password
  }

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`${baseUrl}/instructions.json`, {
        cache: 'no-store', // Disable caching
      });
      const data = await response.json();
      // Handle the parsed JSON data here
      // console.log(data);
      // parsedData = JSON.parse(data)
      return data.question
    } catch (error) {
      // Handle any errors that occur during the fetch
      console.error(error);
    }
  }

  const computeSHA256 = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
  
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  
    return hashHex;
  }

  const fetchBalanceInfo = async (filename) => {
    try {
      const response = await fetch(`${baseUrl}/${filename}.json`, {
        cache: 'no-store', // Disable caching
      });
      debugger

      if (response.status == 404){
        setErrorMessage("Incorrect Answer")
      } else if (response.status == 200) {
        const data = await response.json();
        setBalanceInfo(data)
      } else {
        setErrorMessage(`Oops an error: ${response.statusText}`)
      }
    } catch (error) {
      setErrorMessage(`Oops a big error!: ${error.toString()}`)
    }
  } 

  const fetchData = async (filename) => {
    const password = await passwordPrompt()
    const hash = await computeSHA256(password);
    console.log("Hash:", hash)

    await fetchBalanceInfo(hash)
  }

  return (
    <>
      <div>
        <img src={duckLogo} class="logo preact" alt="Preact logo" />
      </div>
      <h1>Juana V.</h1>
      <div class="card">
        <button onClick={fetchData}>
          My Balance
        </button>
      </div>
      <p class="read-the-docs">
        My personal account
      </p>
      {
        errorMessage && (
          <p class="error">
            {errorMessage}
          </p>
        )
      }
      {
        balanceInfo && (
          <div class="balanceCard">
            
          </div>
        )
      }
    </>
  )
}
