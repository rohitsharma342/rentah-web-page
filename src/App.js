import { useState } from "react"
function App() {
  const [os,setOs] = useState("")
  function handleClick(){
    let userAgent= window.navigator.userAgent
    let platform= window.navigator?.userAgentData?.platform
    if(platform=="Windows"){
        alert("hello windows")
    }
  }


  return (
    <>
      <section>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                  <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <img src="https://cdn.britannica.com/67/92867-050-BC3DC984/cameras-camera-reviews-crystal-displays-photographs-film.jpg" class="d-block w-100" alt="..." />
                  </div>
                  <div class="carousel-item">
                    <img src="https://rukminim1.flixcart.com/flap/850/400/image/7c9975f767d61c6c.jpg?q=90" class="d-block w-100" alt="..." />
                  </div>
                  <div class="carousel-item">
                    <img src="https://imgeng.jagran.com/images/2023/mar/Best%20Cameras%20For%20Photography16691861357791678962439662.jpg" class="d-block w-100" alt="..." />
                  </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
              <div className='rounded bg-grey'>
                <h2>$900/day</h2>
                <p className='float-end' style={{ marginTop : "-40px" }}>jaipur,Rajasthan</p>
                <p>Renting My Camera</p>
                <hr />
                <h2>Description</h2>
                <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                <hr />
                <h3><i class="bi bi-exclamation-octagon-fill"></i> In Case Of Damage</h3>
                <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for</p>
                <h3><i class="bi bi-clipboard2-data-fill"></i> Return Policy</h3>
                <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'</p>
                <button className='btn btn-success form-control rounded' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={handleClick}>Rent It</button>
                <img src='https://developers.google.com/static/maps/images/landing/hero_maps_static_api.png' className='mt-3'></img>
                <hr />
                <div>
                  <img src='https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg' className='profile-img' />
                  <h4 style={{ marginLeft  : "120px", marginTop : "-80px" }}>Listed By Rohit Sharma</h4>
                  <p style={{ marginLeft : "120px", marginTop : "0px" }}>Member Since 2018</p>
                </div>
              </div>
              <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog rounded">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <img src='../rentah_logo.png' className='rentah-logo'/>
                      <h3 className='text-center mt-3'>Thanks For Your Intrest</h3>
                      <p className='text-center'>Please download Rentah app from App Store or Google play store for direct and kickstarting conversation.</p>
                    </div>
                    <div className="modal-footer">
                      
                      <a  className='form-control btn btn-success' >Continue</a>
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

export default App;
