import { useState, useEffect } from 'preact/hooks'
import piggyBank from './assets/piggy-bank.gif'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

import { themeChange } from 'theme-change'


import './app.css'
import { BASE_DATA_FILES_ENDPOINT, ACCOUNT_NAME, MONETARY_UNIT, FRONT_IMAGE_URL } from './config'

const timeAgoLastUpdatedAt = (lastUpdatedAt) => {
  const d = new Date(lastUpdatedAt)
  return timeAgo.format(d)
}

export function App() {

  useEffect(() => {
    themeChange(false)
    // 👆 false parameter is required for react project
  }, [])

  const [balanceInfo, setBalanceInfo] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const baseUrl = BASE_DATA_FILES_ENDPOINT
  const passwordPrompt = async () => {
    const question = await fetchQuestion()
    const password = window.prompt(question);
    return password.toLowerCase()
  }

  const clearBeforeQuerying = async () => {
    setErrorMessage(null)
    setBalanceInfo(null)
  }

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`${baseUrl}/instructions.json`, {
        cache: 'no-store',
      });

      if (response.status != 200) {
        setErrorMessage(`Oops an error trying to get the question: ${response.statusText}`)
        throw "Error!"
      }
      const data = await response.json();
      return data.question
    } catch (error) {
      console.error(error);
    }
  }

  const computeSHA256 = async (password) => {
    if (crypto.subtle){
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } else {
      setErrorMessage(`Crypto methods are not available!`)
        throw "Error!"
    }
  }

  const fetchBalanceInfo = async (filename) => {
    try {
      const response = await fetch(`${baseUrl}/${filename}.json`, {
        cache: 'no-store',
      });
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
    await clearBeforeQuerying()
    const password = await passwordPrompt()
    const hash = await computeSHA256(password);
    await fetchBalanceInfo(hash)
  }

  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
  ]

  return (
    <>
      <div className="navbar bg-neutral text-neutral-content">
        <a className="btn btn-ghost normal-case text-xl">{ACCOUNT_NAME}</a>

        <div className="form-control">
          <label className="input-group">
            <span className="text-primary">Style</span>
            <select className="select select-ghost select-bordered" data-choose-theme>
              <option value="">Default</option>
              {
                themes.map((theme) => 
                (
                  <option value={theme}>{theme}</option>
                ))

              }
            </select>
          </label>
        </div>
      </div>
      <div class="container mx-auto px-4">
        <div class="my-4 prose">
          <h2>My personal Account</h2>
        </div>
        {
          errorMessage && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{errorMessage}</span>
            </div>
          )
        }
        {
          balanceInfo && (
            <>
              <div className="stats stats-vertical bg-accent shadow text-primary-content">
                <div className="stat">
                  <div className="stat-title">Balance</div>
                  <div className="stat-value">
                    {balanceInfo.balance}
                    <div className="badge badge-info gap-2">
                      {balanceInfo.balance_currency}
                    </div>
                  </div>
                  <div className="stat-desc text-primary">Last Updated {timeAgoLastUpdatedAt(balanceInfo.last_updated_at)}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Last Spending: {balanceInfo.last_spending_at}</div>
                  <div className="stat-value">
                    {balanceInfo.last_spending_amount}
                    <div className="badge badge-info gap-2">
                      {balanceInfo.balance_currency}
                    </div>
                  </div>
                  <div className="stat-desc text-primary">{balanceInfo.last_spending_detail}</div>
                </div>
              </div>
            </>
          )
        }
        <div>
          <div class="py-5">
            <img onClick={fetchData} src={FRONT_IMAGE_URL || piggyBank} class="mx-auto bg-white rounded-xl" alt="logo" />
          </div>
          <div class="py-5 text-center">
            <button type="button" class="btn btn-primary" onClick={fetchData}>
              My Balance
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
