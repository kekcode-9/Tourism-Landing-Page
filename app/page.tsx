import LandingPage from "@/components/landing-page";
import getBase64 from "@/utilities/utility-functions";

export default function Home() {
  // getBase64('https://res.cloudinary.com/dxvx3y6ch/image/upload/f_auto,q_auto/v1/tourism/adventures/paddleboarding')
  // .then((blurDataUrl) => {
  //   console.log(`umiam blur: ${blurDataUrl}`);
  // })
  // .catch((err) => {
  //   console.log('error getting blurDataUrl: ', err);
  // })
  
  return (
    <LandingPage/>
  )
}
