import {createContext,useContext,useEffect,useMemo,useState} from 'react'
import {sanityClient} from '../lib/sanityClient'
import {sanitizePromotions} from '../data/store-promotions'

// Only published, explicitly enabled campaigns. Missing or unavailable
// Sanity data must never cause a historical promotion to reappear.
export const PROMOTIONS_QUERY=String.raw`*[_type == "promotion" && !(_id in path("drafts.**")) && !(_id in path("versions.**")) && active == true] {
  _id, name, "id": slug.current, count, priceUSD, active, startsAt, endsAt, conditions,
  "productIds": eligibleProducts[]->id
}`
const PromotionsContext=createContext([])
export function PromotionsProvider({children}){
  const [records,setRecords]=useState([])
  const [time,setTime]=useState(Date.now())
  useEffect(()=>{
    let alive=true
    const load=()=>{
      // Always bypass CDN for campaign switching and price changes.
      sanityClient.withConfig({useCdn:false}).fetch(PROMOTIONS_QUERY)
        .then(data=>{if(alive)setRecords(Array.isArray(data)?data:[])})
        .catch(error=>{
          console.error('[Sanity] promociones no verificadas',error)
          if(alive)setRecords([])
        })
    }
    load()
    const refresh=setInterval(load,60000)
    const clock=setInterval(()=>setTime(Date.now()),30000)
    return ()=>{alive=false;clearInterval(refresh);clearInterval(clock)}
  },[])
  const active=useMemo(()=>sanitizePromotions(records,new Date(time)),[records,time])
  return <PromotionsContext.Provider value={active}>{children}</PromotionsContext.Provider>
}
export function usePromotions(){return useContext(PromotionsContext)}
