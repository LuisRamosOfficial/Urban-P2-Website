import { MetaProvider, Title, Link, Meta } from "@solidjs/meta";
import Navbar from "./Navbar";

const Layout = (props: { children: any }) => {
  return (
    <>
    <MetaProvider>
      <Title>Urban P2</Title>
      <Meta name="description" content="Urban P2 is a project to create a decentralized social media platform." />
      <Link rel="icon" href="/favicon.ico" />
    </MetaProvider>
    <Navbar/>
    {props.children}
     
    </>
  
  
  
  ) 

} 

export default Layout;