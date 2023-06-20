import { useEffect, useState } from "react"
import {  useParams ,useNavigate } from 'react-router-dom'
// import GoogleMap from "../GoogleMap"
import GoogleMapC from "../GoogleMap"
import Header from "../components/Header"
function Home() {
  let navigator =useNavigate()
        const {id} =useParams()
        const [os,setOs] = useState("")
         const[list,setList]=useState([])
        // const[request,setRequest]=useState([])

        console.log(os)
        
//console.log(id)
         useEffect(()=>{
          fetch(`https://rentahapp.onrender.com/api/listings/${id}`)
          .then((res)=>{ return res.json()})
          .then(response=>{
           if(response.status==true){
            setList(response.data)
           }if(response.message==="No Listing with this ID exists"){
        navigator(`/request/${id}`)
           }
          })
         },[])

        
       
        
         function handleClick(){
          let userAgent1= window.navigator.userAgent
          let platform= window.navigator?.userAgentData?.platform
          let userAgent = navigator.userAgent || navigator.vendor || window.opera;
          
          if(platform=="Windows"){
            setOs("W")
        }
         if(platform =="iPhone"){
          setOs("I")
        }
         if(platform =="Android"){
          setOs("A")
        }


          
          
          if (/Windows Phone/i.test(userAgent)) {
            setOs("W")
            
        }
        if (/Android/i.test(userAgent)) {
          setOs("A")
      }
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        setOs("I")
    }
    if(/Windows/i.test(userAgent)){
      setOs("W")
    }
   
    
        }
      
      
      return (
        <>
        <section>
        <div className='container'>
          <div className='row'>
          <Header/>
            <div className='col-md-12'>
              
              <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                  {list.listingPhotos?.map(itm=>(

                
                  <div className="carousel-item active">
                    <img src={itm} className="d-block w-100" alt="" />
                  </div>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
              <div className='rounded bg-grey mt-3'>
                {list.listingType===0?
                <h3>${list.budget}/
                </h3>
                :
                <h3>${list.budget}</h3>
    }
                <p className='float-end' style={{ marginTop : "-40px" }}><i class="bi bi-geo-alt-fill"></i> {list.user?.city},{list.user?.state}</p>
                {list.listingType==0?
                <p>Renting My {list.title}</p>
                :
                <p>Selling My {list.title}</p>
                }
                
                <hr />
                <h2>Description</h2>
                <p>{list.description}</p>
                <hr />
                <h3><i class="bi bi-exclamation-octagon-fill"></i> In Case Of Damage</h3>
                <p>{list.damageClause}</p>
                <h3><i class="bi bi-clipboard2-data-fill"></i> Return Policy</h3>
                <p>{list.returnPolicy}</p>
                <button className='btn btn-success form-control rounded' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={handleClick}>I'm Intrested</button>
                <GoogleMapC
                
                />
                <hr />
                <div className="mb-5">
                  <img src={list.user?.profilePicture} className='profile-img'alt="" />
                  <h5 style={{ marginLeft  : "120px", marginTop : "-65px" }}>Listed By {list.user?.fullName}</h5>
                  <p style={{ marginLeft : "120px", marginTop : "0px" }}>Member Since 2018</p>
                </div>
              </div>
              <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog ">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">Rentah</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                     
                    <div className="modal-body">
                      <img src='../rentah_logo.png' className='rentah-logo' alt=""/>
                      <h3 className='text-center mt-3'>Thanks For Your Intrest</h3>
                      <p className='text-center'>Please download Rentah app from App Store or Google play store for direct and kickstarting conversation.</p>
                    </div>
                    <div className="modal-footer">
                      {os==="I" && <a href='https://www.apple.com/in/app-store'  className='form-control btn btn-success' >Continue</a>}
                      {os==="A" && <a href="https://play.google.com/store/search?q=rentah&c=apps" className='form-control btn btn-success' >Continue</a>}
                      {os==="W" && <a href="https://play.google.com/store/search?q=rentah&c=apps" className='form-control btn btn-success' >Continue</a>}
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        </>
     );
  
}
export default Home;