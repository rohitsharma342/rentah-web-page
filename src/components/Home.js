import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PLAY_STORE_URL, openRentahApp } from "../openRentahApp";
import { trackDeepLinkEvent } from "../deepLink/analytics";
import { usePageMeta } from "../usePageMeta";
import GoogleMapC from "../GoogleMap";
import "./ListingPage.css";

function getPeriodLabel(listingType) {
  if (listingType === 0) return "/ day";
  if (listingType === 1) return "/ week";
  if (listingType === 2) return "/ month";
  return "";
}

function formatPrice(budget) {
  const amount = Number(budget);
  if (Number.isNaN(amount)) return budget ? `$${budget}` : "";
  return `$${amount.toFixed(2)}`;
}

function formatTitle(list) {
  if (!list?.title) return "";
  const prefix = list.listingType === 0 ? "Renting My" : "Selling My";
  const title = String(list.title).trim();
  const full = `${prefix} ${title}`;
  return /[.!?]$/.test(full) ? full : `${full}.`;
}

function getCategoryLabel(list) {
  const raw = list?.category ?? list?.categoryType ?? list?.type;
  if (raw === 0 || raw === "0") return "Goods";
  if (raw === 1 || raw === "1") return "Services";
  if (raw === 2 || raw === "2") return "Spaces";
  if (typeof raw === "string" && raw.trim()) return raw;
  return list?.listingType === 3 ? "For sale" : "Services";
}

function photoUrl(item) {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item.url || item.uri || item.image || item.photo || "";
}

function PhotoTile({ src, alt, className, children, onClick }) {
  return (
    <div
      className={className}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
      role="button"
      tabIndex={0}
    >
      {src ? <img src={src} alt={alt} /> : null}
      {children}
    </div>
  );
}

function Home() {
  const navigator = useNavigate();
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedDamage, setIsExpandedDamage] = useState(false);
  const [isExpandedReturn, setIsExpandedReturn] = useState(false);

  useEffect(() => {
    fetch(`https://web.rentah.com/api/listings/${id}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.status === true) {
          setList(response.data);
          setPhotoIndex(0);
        }
        if (response.message === "No Listing with this ID exists") {
          navigator(`/request/${id}`);
        }
      });
  }, [id, navigator]);

  function openListingInApp() {
    if (!id) return;
    trackDeepLinkEvent("interested_button_clicked", {
      product_id: id,
      source: "listing_cta",
    });
    openRentahApp({ type: "product", id });
  }

  function openAppStore() {
    openRentahApp();
  }

  const photos = useMemo(
    () => (list?.listingPhotos || []).map(photoUrl).filter(Boolean),
    [list]
  );
  const currentPhoto = photos[photoIndex];
  usePageMeta({
    title: list?.title || "Rentah",
    image: photos[0] || "",
  });
  const locationLabel = list?.location
    ? String(list.location)
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
        .join(", ")
    : [list?.user?.city || list?.city, list?.user?.state || list?.state]
        .filter(Boolean)
        .join(", ");
  const description = list?.description || "";
  const canTruncate = description.length > 70;
  const memberYear = list?.user?.createdAt
    ? new Date(list.user.createdAt).getFullYear()
    : "2018";
  const listingCount =
    list?.user?.listingsCount ??
    list?.user?.totalListings ??
    list?.user?.listingCount;
  const isVerified =
    list?.user?.isVerified ?? list?.user?.verified ?? list?.user?.is_verified;
  const category = getCategoryLabel(list);
  const latitude = Number(list?.latitude);
  const longitude = Number(list?.longitude);
  const hasCoords =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    !(latitude === 0 && longitude === 0);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
    PLAY_STORE_URL
  )}`;

  const goToPhoto = (nextIndex) => {
    if (!photos.length) return;
    const wrapped = (nextIndex + photos.length) % photos.length;
    setPhotoIndex(wrapped);
  };

  const openPhoto = (index) => {
    if (!photos.length) return;
    setPhotoIndex(index);
    setShowAllPhotos(true);
  };

  const providerBlock = list?.user ? (
    <Link to={`/user/${list.user._id}`} className="listing-provider">
      {list.user.profilePicture ? (
        <img src={list.user.profilePicture} alt="" className="listing-avatar" />
      ) : (
        <div className="listing-avatar-fallback">avatar</div>
      )}
      <div className="listing-provider-copy">
        <p className="listing-provider-name">{list.user.fullName}</p>
        <p className="listing-provider-meta">
          Member since {memberYear}
          {listingCount != null ? ` · ${listingCount} listings` : ""}
        </p>
      </div>
      {isVerified !== false && <span className="listing-verified">Verified</span>}
    </Link>
  ) : null;

  const aboutBlock = (
    <>
      <p className="listing-kicker">About this listing</p>
      <p className="listing-copy">
        {description
          ? isExpanded || !canTruncate
            ? description
            : `${description.substring(0, 70).trim()}...`
          : "No description available"}
      </p>
      {description && (
        <button
          type="button"
          className="listing-read-more"
          onClick={() => setIsExpanded((open) => !open)}
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </>
  );

  const knowBlock = (
    <div className="listing-know">
      <p className="listing-kicker">Good to know</p>
      <div className="listing-accordion">
        <div className="listing-accordion-item">
          <button
            type="button"
            className="listing-accordion-btn"
            onClick={() => setIsExpandedDamage((open) => !open)}
          >
            In case of damage
            <span className="listing-accordion-icon">
              {isExpandedDamage ? "−" : "+"}
            </span>
          </button>
          {isExpandedDamage && (
            <div className="listing-accordion-panel">
              {list?.damageClause || "No damage clause available"}
            </div>
          )}
        </div>
        <div className="listing-accordion-item">
          <button
            type="button"
            className="listing-accordion-btn"
            onClick={() => setIsExpandedReturn((open) => !open)}
          >
            Return policy
            <span className="listing-accordion-icon">
              {isExpandedReturn ? "−" : "+"}
            </span>
          </button>
          {isExpandedReturn && (
            <div className="listing-accordion-panel">
              {list?.returnPolicy || "No return policy available"}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const whereBlock = (
    <div className="listing-where">
      <p className="listing-kicker">Where</p>
      <div className="listing-map">
        {hasCoords ? (
          <GoogleMapC
            latitude={latitude}
            longitude={longitude}
            height="180px"
            marginTop={0}
            borderRadius="18px"
            zoom={13}
            showCircle={false}
            gestureHandling="none"
          />
        ) : null}
      </div>
      <p className="listing-map-note">
        Exact location shared after the provider accepts.
      </p>
    </div>
  );

  const priceCard = (
    <aside className="listing-card">
      <div className="listing-price">
        <span className="listing-price-amount">{formatPrice(list?.budget)}</span>
        {getPeriodLabel(list?.listingType) && (
          <span className="listing-price-period">
            {getPeriodLabel(list?.listingType)}
          </span>
        )}
      </div>
      <p className="listing-card-copy">
        Messaging, booking and payment happen in the Rentah app.
      </p>
      <button type="button" className="listing-cta" onClick={openListingInApp}>
        Open in the Rentah app
      </button>
      <div className="listing-qr-row">
        <img src={qrSrc} alt="Download Rentah" className="listing-qr" />
        <p>Scan to install Rentah, then pick up right where you left off.</p>
      </div>
      <p className="listing-card-meta">Free to list · 5% on rentals</p>
      <p className="listing-card-meta">Verified profiles and in-app chat</p>
    </aside>
  );

  return (
    <div className="listing-page">
      {showBanner && (
        <>
          <div className="listing-promo">
            <p className="listing-promo-text">
              Just Rent It. — goods, services & spaces nearby
            </p>
            <div className="listing-promo-actions">
              <button
                type="button"
                className="listing-get-app"
                onClick={openAppStore}
              >
                Get the app
              </button>
              <button
                type="button"
                className="listing-close"
                aria-label="Dismiss banner"
                onClick={() => setShowBanner(false)}
              >
                ×
              </button>
            </div>
          </div>
          <header className="listing-topbar">
            <div className="listing-mark">
              <img src="/rentah_logo.png" alt="" />
            </div>
            <div className="listing-topbar-copy">
              <p className="listing-topbar-title">Rentah</p>
              <p className="listing-topbar-sub">
                Just Rent It - goods, services & spaces nearby
              </p>
            </div>
            <button
              type="button"
              className="listing-get-app"
              onClick={openAppStore}
            >
              Get app
            </button>
            <button
              type="button"
              className="listing-close"
              aria-label="Dismiss banner"
              onClick={() => setShowBanner(false)}
            >
              ×
            </button>
          </header>
        </>
      )}

      <div className="listing-shell">
        <div className="listing-gallery">
          <PhotoTile
            className="listing-gallery-hero"
            src={photos[0]}
            alt={list?.title || "Listing photo"}
            onClick={() => openPhoto(0)}
          />
          <div className="listing-gallery-side">
            <PhotoTile
              className="listing-gallery-tile"
              src={photos[1] || photos[0]}
              alt="Listing photo 2"
              onClick={() => openPhoto(photos[1] ? 1 : 0)}
            />
            <PhotoTile
              className="listing-gallery-tile"
              src={photos[2] || photos[1] || photos[0]}
              alt="Listing photo 3"
              onClick={() =>
                openPhoto(photos[2] ? 2 : photos[1] ? 1 : 0)
              }
            >
              {photos.length > 0 && (
                <span
                  className="listing-all-photos"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllPhotos(true);
                  }}
                >
                  All photos
                </span>
              )}
            </PhotoTile>
          </div>
        </div>

        <div
          className="listing-hero"
          onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStart == null) return;
            const dx = e.changedTouches[0].clientX - touchStart;
            if (dx > 40) goToPhoto(photoIndex - 1);
            if (dx < -40) goToPhoto(photoIndex + 1);
            setTouchStart(null);
          }}
        >
          {currentPhoto && (
            <img
              src={currentPhoto}
              alt={list?.title || "Listing"}
              className="listing-hero-img"
            />
          )}
          <span className="listing-badge">{category}</span>
          {(photos.length > 1 || photos.length === 0) && (
            <div className="listing-dots">
              {(photos.length ? photos : [0, 1, 2]).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`listing-dot${index === photoIndex ? " is-active" : ""}`}
                  aria-label={`Show photo ${index + 1}`}
                  onClick={() => photos.length && setPhotoIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="listing-layout">
          <div className="listing-body">
            <h1 className="listing-title">{formatTitle(list) || "Listing"}</h1>
            <div className="listing-price listing-price-mobile">
              <span className="listing-price-amount">
                {formatPrice(list?.budget)}
              </span>
              {getPeriodLabel(list?.listingType) && (
                <span className="listing-price-period">
                  {getPeriodLabel(list?.listingType)}
                </span>
              )}
            </div>
            <div className="listing-chips">
              <span className="listing-chip listing-chip-category">{category}</span>
              {locationLabel && (
                <span className="listing-chip">{locationLabel}</span>
              )}
              <span className="listing-chip">Available now</span>
            </div>
            {aboutBlock}
            {providerBlock}
            {knowBlock}
            {whereBlock}
          </div>
          {priceCard}
        </div>

        <div className="listing-cta-bar">
          <button type="button" className="listing-cta" onClick={openListingInApp}>
            Open in the Rentah app
          </button>
        </div>
      </div>

      {showAllPhotos && (
        <div
          className="listing-lightbox"
          onClick={() => setShowAllPhotos(false)}
        >
          <div
            className="listing-lightbox-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="listing-lightbox-close"
              onClick={() => setShowAllPhotos(false)}
            >
              ×
            </button>
            <div className="listing-lightbox-grid">
              {photos.map((photo, index) => (
                <img key={photo + index} src={photo} alt={`Listing ${index + 1}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
