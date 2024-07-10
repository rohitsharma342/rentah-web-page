import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
// import GoogleMap from "../GoogleMap"
import GoogleMapC from "../GoogleMap";
import Header from "../components/Header";
function Home() {
  let navigator = useNavigate();
  const { id } = useParams();
  const [os, setOs] = useState("");
  const [list, setList] = useState([]);
  // const[request,setRequest]=useState([])

  console.log(os);

  //console.log(id)
  useEffect(() => {
    fetch(`https://web.rentah.com/api/listings/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        if (response.status == true) {
          setList(response.data);
        }
        if (response.message === "No Listing with this ID exists") {
          navigator(`/request/${id}`);
        }
      });
  }, []);
  // const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  // const isAndroid = /android/i.test(navigator.userAgent);
   const appScheme = 'https://web.rentah.com';
  // const appStoreURL = 'https://apps.apple.com/in/app/rentah/id1668164022'; // iOS App Store URL
  // const playStoreURL = 'https://play.google.com/store/apps/details?id=com.app.rentah&pcampaignid=web_share'; // Android Play Store URL
  
  // const appScheme = 'yourapp://'; // Custom scheme for your app
const appStoreURL = 'https://apps.apple.com/in/app/rentah/id1668164022'; // iOS App Store URL
const playStoreURL = 'https://play.google.com/store/apps/details?id=com.app.rentah&pcampaignid=web_share'; // Android Play Store URL

function getOS() {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator?.userAgentData?.platform || window.navigator.platform;
  const macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  
  if (macosPlatforms.includes(platform)) {
    return 'Mac OS';
  } else if (iosPlatforms.includes(platform)) {
    return 'iOS';
  } else if (windowsPlatforms.includes(platform)) {
    return 'Windows';
  } else if (/Android/.test(userAgent)) {
    return 'Android';
  } else if (/Linux/.test(platform)) {
    return 'Linux';
  }
  return null;
}

function handleClick() {
  const os = getOS();
  let url =id
  if (os === 'iOS') {
    // Attempt to open the app using the custom scheme
    const timeout = setTimeout(() => {
      window.location.href = appStoreURL; // Redirect to App Store if the app is not installed
    }, 1000); // Delay of 1000 milliseconds

    window.location.href = `${appScheme}?id=${encodeURIComponent(url)}&isListing=true`; // Attempt to open the app
    window.addEventListener('blur', () => clearTimeout(timeout)); // Clear timeout if the app opens
  } else if (os === 'Android') {
    // Attempt to open the app using the custom scheme
    const timeout = setTimeout(() => {
      window.location.href = playStoreURL; // Redirect to Play Store if the app is not installed
    }, 1000); // Delay of 1000 milliseconds

    window.location.href = `${appScheme}?id=${encodeURIComponent(url)}&isListing=true`; // Attempt to open the app
    window.addEventListener('blur', () => clearTimeout(timeout)); // Clear timeout if the app opens
  } else {
    alert('Please open this on a mobile device.');  
  }
}

  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedDamage, setIsExpandedDamage] = useState(false);
  const [isExpandedReturn, setIsExpandedReturn] = useState(false);
  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };
  const toggleDescriptionDamage = () => {
    setIsExpandedDamage(!isExpandedDamage);
  };
  const toggleDescriptionReturn = () => {
    setIsExpandedReturn(!isExpandedReturn);
  };
  return (
    <>
      <section>
        <div className="container-fluid">
          <div className="row">
            {/* <Header/> */}
            <div className="col-md-12 mt-3">
              <div
                id="carouselExampleIndicators"
                style={{ zIndex: "-1000" }}
                class="carousel slide sticky-top"
                data-bs-ride="carousel"
              >
                <div className="carousel-indicators">
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="0"
                    className="active"
                    aria-current="true"
                    aria-label="Slide 1"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="1"
                    aria-label="Slide 2"
                  ></button>
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="2"
                    aria-label="Slide 3"
                  ></button>
                </div>
                <div className="carousel-inner">
                  {list.listingPhotos?.map((itm) => (
                    <div className="carousel-item active">
                      <img src={itm} loading="lazy" className="d-block "  style={{height:"200px"}}  alt="" />
                    </div>
                  ))}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
              <div
                className=" pt-3 mt-3 bg-light px-2"
                style={{ borderRadius: "18px" }}
              >
                {list.listingType === 0 && <h4>${list.budget}/Day</h4>}
                {list.listingType === 1 && <h4>${list.budget}/Week</h4>}
                {list.listingType === 2 && <h4>${list.budget}/Month</h4>}
                {list.listingType === 3 && <h4>${list.budget}/For Sale</h4>}

                <p
                  className="float-end"
                  style={{ marginTop: "-40px", fontSize: "13px" }}
                >
                  <i class="bi bi-geo-alt-fill"></i> {list.user?.city},
                  {list.user?.state}
                </p>
                {list.listingType == 0 ? (
                  <h6>Renting My {list.title}</h6>
                ) : (
                  <h6>Selling My {list.title}</h6>
                )}

                <hr />
                {/* <h4 >Description</h4> */}
      <p style={{ fontSize: '16px' }}>
        {list.description 
          ? (isExpanded ? list.description : `${list.description.substring(0, 150)}...`)
          : 'No description available'}
      </p>
      {list.description && (
        <h6 style={{ fontSize: '13px',color:"#179778",textDecoration:"underline" }} onClick={toggleDescription}>
          {isExpanded ? 'Show Less' : 'Read More'}
        </h6>
      )}
                <hr />
                <div className="mb-0 d-flex gap-3 align-items-center">
                  <img
                    src={list.user?.profilePicture}
                    className="profile-img"
                    alt=""
                  />
                  <div className="mt-3">
                  <h5 style={{fontSize:"18px"}}>
                    Listed By {list.user?.fullName}
                  </h5>
                  <p >
                    Member Since 2018
                  </p>
                  </div>
                </div>
                <hr/>
                <button
                  className="btn mb-3 form-control mt-2 pt-2 pb-2 "
                  style={{
                    background: "#179778",
                    borderRadius: "10px",
                    color: "white",
                    fontSize:"20px"
                    // margin:"10px"
                  }}
                  data-bs-toggle=""
                  data-bs-target=""
                  onClick={handleClick}
                >
                  I'm Interested
                </button>
                <h4 style={{ fontSize: '15px' }}>
                  <i class="bi bi-exclamation-octagon-fill"></i> In Case Of
                  Damage
                </h4>
                <p style={{ fontSize: '13px' }}>
        {list.damageClause 
          ? (isExpandedDamage ? list.damageClause : `${list.damageClause.substring(0, 100)}...`)
          : 'No damageClause available'}
      </p>
      {list.damageClause && (
        <h6 style={{ fontSize: '13px',color:"#179778",textDecoration:"underline" }} onClick={toggleDescriptionDamage}>
          {isExpandedDamage ? 'Show Less' : 'Read More'}
        </h6>
      )}
           <hr />
                <h4 style={{ fontSize: '15px', }}>
                  <i class="bi bi-clipboard2-data-fill"></i> Return Policy
                </h4>
                <p style={{ fontSize: '13px' }}>
        {list.returnPolicy 
          ? (isExpandedReturn ? list.returnPolicy : `${list.returnPolicy.substring(0, 100)}...`)
          : 'No returnPolicy available'}
      </p>
      {list.returnPolicy && (
        <h6 style={{ fontSize: '13px',color:"#179778",textDecoration:"underline" }} onClick={toggleDescriptionReturn}>
          {isExpandedReturn ? 'Show Less' : 'Read More'}
        </h6>
      )}
                {/* <button
                  className="btn  form-control mt-2  "
                  style={{
                    background: "#179778",
                    borderRadius: "10px",
                    color: "white",
                    // margin:"10px"
                  }}
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={handleClick}
                >
                  I'm Interested
                </button> */}
                <GoogleMapC latitude={list.latitude} longitude={list.longitude} />
                <hr />
                {/* <div className="mb-5">
                  <img
                    src={list.user?.profilePicture}
                    className="profile-img"
                    alt=""
                  />
                  <h5 >
                    Listed By {list.user?.fullName}
                  </h5>
                  <p style={{ marginLeft: "120px", marginTop: "0px" }}>
                    Member Since 2018
                  </p>
                </div> */}
              </div>
              <div
                className="modal fade"
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog ">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        Rentah
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>

                    <div className="modal-body">
                      <img
                        src="../rentah_logo.png"
                        className="rentah-logo"
                        alt=""
                      />
                      <h3 className="text-center mt-3">
                        Thanks For Your Interest
                      </h3>
                      <p className="text-center">
                        Please download Rentah app from App Store or Google play
                        store for direct and kickstarting conversation.
                      </p>
                    </div>
                    <div className="modal-footer ">
                      <a
                        href="hhttps://apps.apple.com/in/app/rentah/id1668164022"
                        className="form-control btn btn-success"
                      >
                        App Store
                      </a>
                      <a
                        href="https://play.google.com/store/apps/details?id=com.app.rentah"
                        className="form-control btn btn-success"
                      >
                        Play Store
                      </a>
                      {/* {os==="I" && <a href='https://www.apple.com/in/app-store'  className='form-control btn btn-success' >Continue</a>}
                      {os==="A" && <a href="https://play.google.com/store/search?q=rentah&c=apps" className='form-control btn btn-success' >Continue</a>}
                      {os==="W" && <a href="https://play.google.com/store/search?q=rentah&c=apps" className='form-control btn btn-success' >Continue</a>} */}
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
