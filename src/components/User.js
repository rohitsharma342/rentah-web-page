import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { openRentahApp } from "../openRentahApp";
import { usePageMeta } from "../usePageMeta";
import "./ProfilePage.css";

function photoUrl(item) {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item.url || item.uri || item.image || item.photo || "";
}

function formatMoney(budget) {
  const amount = Number(budget);
  if (Number.isNaN(amount)) return budget ? `$${budget}` : "";
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

function formatWebsite(website) {
  if (!website) return "";
  return String(website)
    .replace(/^https?:\/\//i, "")
    .replace(/\/$/, "");
}

function listingKind(listingType) {
  return listingType === 3 ? "SELL" : "RENT";
}

function User() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [listing, setListing] = useState([]);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    fetch(`https://web.rentah.com/api/users/${userId}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.status === true) {
          setUser(response.user);
          setListing(response.listings || []);
        }
      });
  }, [userId]);

  function openChatInApp() {
    if (!userId) return;
    openRentahApp({ type: "user", id: userId });
  }

  function openAppStore() {
    openRentahApp();
  }

  usePageMeta({
    title: user?.fullName || "Rentah",
    image: user?.profilePicture || "",
  });

  const firstName = (user?.fullName || "them").split(" ")[0];
  const memberYear = user?.createdAt || user?.creationTimeStamp
    ? new Date(user.createdAt || user.creationTimeStamp).getFullYear()
    : "2023";
  const locationLabel = [user?.city, user?.state].filter(Boolean).join(", ");
  const isVerified = user?.isVerified ?? user?.verified ?? user?.is_verified;
  const coverSrc =
    photoUrl(user?.coverPhoto || user?.coverImage || user?.banner) ||
    photoUrl(listing[0]?.listingPhotos?.[0]);
  const listingCount =
    user?.listingsCount ?? user?.totalListings ?? listing.length;
  const rentalCount =
    user?.rentals ?? user?.rentalCount ?? user?.totalRentals ?? user?.completedRentals;
  const rating = user?.rating ?? user?.averageRating ?? user?.avgRating;
  const website = formatWebsite(user?.website);
  const websiteHref = user?.website
    ? /^https?:\/\//i.test(user.website)
      ? user.website
      : `https://${user.website}`
    : "";

  const messageCta = (
    <button type="button" className="profile-cta" onClick={openChatInApp}>
      Message {firstName} in the Rentah app
    </button>
  );

  return (
    <div className="profile-page">
      {showBanner && (
        <div className="profile-promo">
          <p className="profile-promo-text">
            Just Rent It. — goods, services & spaces nearby
          </p>
          <div className="profile-promo-actions">
            <button type="button" className="profile-get-app" onClick={openAppStore}>
              Get the app
            </button>
            <button
              type="button"
              className="profile-close"
              aria-label="Dismiss banner"
              onClick={() => setShowBanner(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="profile-shell">
        {showBanner && (
          <header className="profile-topbar">
            <div className="profile-mark">
              <img src="/rentah_logo.png" alt="" />
            </div>
            <div className="profile-topbar-copy">
              <p className="profile-topbar-title">Rentah</p>
              <p className="profile-topbar-sub">
                Just Rent It. — goods, services & spaces nearby
              </p>
            </div>
            <button type="button" className="profile-get-app" onClick={openAppStore}>
              Get app
            </button>
            <button
              type="button"
              className="profile-close"
              aria-label="Dismiss banner"
              onClick={() => setShowBanner(false)}
            >
              ×
            </button>
          </header>
        )}

        <div className="profile-cover">
          {coverSrc ? (
            <img src={coverSrc} alt="" className="profile-cover-img" />
          ) : null}
        </div>

        <div className="profile-layout">
          <aside className="profile-sidebar">
            <div className="profile-identity">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt=""
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar profile-avatar-fallback">avatar</div>
              )}
              {isVerified !== false && (
                <span className="profile-verified">Verified</span>
              )}
            </div>

            <h1 className="profile-name">{user?.fullName || "Member"}</h1>
            <p className="profile-meta">
              Member since {memberYear}
              {locationLabel ? ` · ${locationLabel}` : ""}
            </p>

            {user?.description && <p className="profile-bio">{user.description}</p>}

            {(website || user?.phone) && (
              <div className="profile-contacts">
                {website && (
                  <a
                    className="profile-pill"
                    href={websiteHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {website}
                  </a>
                )}
                {user?.phone && (
                  <a className="profile-pill" href={`tel:${user.phone}`}>
                    {user.phone}
                  </a>
                )}
              </div>
            )}

            <div className="profile-stats">
              <div className="profile-stat">
                <strong>{listingCount || 0}</strong>
                <span>Listings</span>
              </div>
              <div className="profile-stat">
                <strong>{rentalCount ?? 0}</strong>
                <span>Rentals</span>
              </div>
              <div className="profile-stat">
                <strong>{rating ?? "—"}</strong>
                <span>Rating</span>
              </div>
            </div>

            <div className="profile-cta-desktop">{messageCta}</div>
          </aside>

          <section className="profile-main">
            <div className="profile-listings-head">
              <span className="profile-kicker">Listings</span>
              <span className="profile-listings-count">{listingCount || 0}</span>
            </div>

            <div className="profile-listings">
              {listing.map((item) => (
                <button
                  type="button"
                  key={item._id}
                  className="profile-listing"
                  onClick={() => navigate(`/${item._id}`)}
                >
                  <div className="profile-listing-photo">
                    {photoUrl(item?.listingPhotos?.[0]) ? (
                      <img
                        src={photoUrl(item.listingPhotos[0])}
                        alt={item.title || "Listing"}
                      />
                    ) : null}
                  </div>
                  <div className="profile-listing-price">
                    {formatMoney(item.budget)}{" "}
                    <span>{listingKind(item.listingType)}</span>
                  </div>
                  <div className="profile-listing-title">
                    {item.title || "Listing"}
                  </div>
                  {item.location && (
                    <div className="profile-listing-location">{item.location}</div>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="profile-cta-bar">{messageCta}</div>
      </div>
    </div>
  );
}

export default User;
