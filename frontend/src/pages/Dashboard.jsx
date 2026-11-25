import React, { useState } from "react";
import { Link } from "react-router-dom";
import DonateItem from "./DonateItem";
import SmartTools from "./SmartTools";
import "./Dashboard.css";

const STORAGE_KEY = "revive-ai-demo-donations";
const menuItems = [
  { name: "Dashboard", icon: "🏠" },
  { name: "Donate Item", icon: "🎁" },
  { name: "Browse Items", icon: "🔍" },
  { name: "Smart Tools", icon: "🤖" },
  { name: "My Donations", icon: "📦" },
  { name: "My Requests", icon: "📋" },
  { name: "My Profile", icon: "👤" },
];

function loadDonations() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function Dashboard() {
  
const [activeSection, setActiveSection] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const sections = {
      donate: "Donate Item",
      browse: "Browse Items",
      donations: "My Donations",
      requests: "My Requests",
      profile: "My Profile",
    };
    return sections[params.get("section")] || "Dashboard";
  });

  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window === "undefined" || window.innerWidth > 750
  );
  const [donations, setDonations] = useState(loadDonations);
  const [browseSearch, setBrowseSearch] = useState("");
  const [browseCategory, setBrowseCategory] = useState("All");

  const navigateSection = (name) => {
    setActiveSection(name);
    if (window.innerWidth <= 750) setSidebarOpen(false);
  };

  const filteredItems = donations.filter((item) => {
    const matchSearch = `${item.title} ${item.description} ${item.location}`
      .toLowerCase().includes(browseSearch.toLowerCase().trim());
    const matchCategory = browseCategory === "All" || item.category === browseCategory;
    return matchSearch && matchCategory;
  });

  const saveDonation = (details) => {
    const item = {
      ...details,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [item, ...donations];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setDonations(updated);
      return true;
    } catch {
      return false;
    }
  };

  const stats = [
    { title: "Items Donated", value:donations.length, icon: "🎁", color: "green" },
    { title: "Items Received", value: "0", icon: "📦", color: "blue" },
    { title: "Pending Requests", value: "0", icon: "⏳", color: "orange" },
    { title: "Environmental Impact", value: "0 kg", icon: "🌱", color: "purple" },
  ];

  const quickActions = [
    { title: "Donate an Item", description: "Give your unused items a second life.", icon: "🎁", action: "Donate Item" },
    { title: "Explore Items", description: "Discover useful items shared by others.", icon: "🔍", action: "Browse Items" },
    { title: "My Donations", description: "Track the items you have donated.", icon: "📦", action: "My Donations" },
  ];

  return (
    <div className={`dashboard-page ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
      {sidebarOpen && (
        <button type="button" className="sidebar-backdrop"
          aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} />
      )}

      <aside id="dashboard-sidebar" className="dashboard-sidebar">
        <Link to="/" className="dashboard-logo">ReVive <span>AI ♻</span></Link>
        <p className="sidebar-heading">MAIN MENU</p>
        <nav className="sidebar-menu" aria-label="Dashboard navigation">
          {menuItems.map((item) => (
            <button type="button" key={item.name}
              className={`sidebar-link ${activeSection === item.name ? "active" : ""}`}
              onClick={() => navigateSection(item.name)}>
              <span>{item.icon}</span>{item.name}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span>🌿</span><h4>Make a Difference!</h4>
            <p>Every small action creates a greener tomorrow.</p>
          </div>
          <Link to="/" className="sidebar-logout">↪ Back to Home</Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-navbar">
          <div className="dashboard-nav-left">
            <button type="button" className="sidebar-toggle"
              aria-controls="dashboard-sidebar" aria-expanded={sidebarOpen}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              onClick={() => setSidebarOpen((open) => !open)}>☰</button>
            <div><h2>{activeSection}</h2><p>Welcome to your ReVive AI workspace!</p></div>
          </div>
          <div className="dashboard-user">
            <span className="notification-icon" aria-hidden="true">🔔</span>
            <div className="user-avatar">U</div>
            <div className="user-details"><h4>User</h4><p>Member</p></div>
          </div>
        </header>

        {activeSection === "Dashboard" ? (
          <div className="dashboard-content">
            <section className="dashboard-welcome">
              <div>
                <p className="welcome-label">YOUR SUSTAINABLE JOURNEY</p>
                <h1>Welcome Back! 👋</h1>
                <p>Ready to make a difference? Let's reuse, recycle and revive together.</p>
                <button className="welcome-button" onClick={() => navigateSection("Donate Item")}>Donate an Item →</button>
              </div>
              <div className="welcome-illustration" aria-hidden="true">🌱</div>
            </section>

            <section className="dashboard-stats">
              {stats.map((stat) => (
                <div className="stat-card" key={stat.title}>
                  <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
                  <div><p>{stat.title}</p><h2>{stat.value}</h2></div>
                </div>
              ))}
            </section>

            <section className="dashboard-section">
              <div className="section-heading"><h2>Quick Actions</h2><p>What would you like to do today?</p></div>
              <div className="quick-actions">
                {quickActions.map((action) => (
                  <button type="button" className="action-card" key={action.title}
                    onClick={() => navigateSection(action.action)}>
                    <div className="action-icon">{action.icon}</div>
                    <h3>{action.title}</h3><p>{action.description}</p><span>Explore →</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="dashboard-section activity-section">
              <div className="section-heading"><h2>Recent Activity</h2><p>Keep track of your latest activities.</p></div>
              {donations.length ? (
                <div className="recent-activity">
                  <strong>📦 {donations[0].title}</strong>
                  <span>Recently added to My Donations</span>
                  <button type="button" onClick={() => navigateSection("My Donations")}>View all →</button>
                </div>
              ) : (
                <div className="empty-activity">
                  <span>📭</span><h3>No activities yet</h3>
                  <p>Your donations and requests will appear here. Start by donating your first item!</p>
                </div>
              )}
            </section>

            <section className="impact-banner">
              <div><h2>🌍 Together for a Greener Planet</h2>
                <p>Reuse more. Waste less. Make every item count.</p></div>
              <span>♻️</span>
            </section>
          </div>
        ) : activeSection === "Smart Tools" ? (
          <div className="dashboard-content">
            <SmartTools />
          </div>
        ) : activeSection === "Donate Item" ? (
          <div className="dashboard-content">
            <DonateItem onSave={saveDonation} onViewDonations={() => navigateSection("My Donations")} />
          </div>
        ) : activeSection === "Browse Items" ? (
          <div className="dashboard-content">
            <section className="my-donations-header">
              <div>
                <h2>Browse Items</h2>
                <p>Explore items added in this browser demo.</p>
              </div>
              <button type="button" className="welcome-button"
                onClick={() => navigateSection("Donate Item")}>
                + List an Item
              </button>
            </section>
            <div className="browse-filters">
              <label>
                Search items
                <input
                  type="search"
                  value={browseSearch}
                  onChange={(event) => setBrowseSearch(event.target.value)}
                  placeholder="Search by name, description or location"
                />
              </label>
              <label>
                Category
                <select value={browseCategory}
                  onChange={(event) => setBrowseCategory(event.target.value)}>
                  {["All", "Clothing", "Electronics", "Books", "Furniture", "Home Essentials", "Others"].map((x) => (
                    <option key={x} value={x}>{x}</option>
                  ))}
                </select>
              </label>
            </div>
            {filteredItems.length === 0 ? (
              <div className="empty-activity">
                <span>🔍</span>
                <h3>{donations.length ? "No matching items" : "No items available yet"}</h3>
                <p>{donations.length
                  ? "Try changing your search or category filter."
                  : "Add an item using Donate Item to see it here. Listings are only visible in this browser until backend integration."}</p>
              </div>
            ) : (
              <div className="donations-grid">
                {filteredItems.map((item) => (
                  <article className="donation-card" key={item.id}>
                    <div className="donation-card-icon" aria-hidden="true">📦</div>
                    <div>
                      <span className="donation-type">{item.donationType}</span>
                      <h3>{item.title}</h3>
                      <p>{item.category} · {item.condition}</p>
                      <p>📍 {item.location}</p>
                      <p>{item.description}</p>
                      {item.imageName && <small>Selected photo: {item.imageName} (preview only)</small>}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : activeSection === "My Donations" ? (
          <div className="dashboard-content">
            <section className="my-donations-header">
              <div><h2>My Donations</h2><p>Items you've added in this browser demo.</p></div>
              <button className="welcome-button" onClick={() => navigateSection("Donate Item")}>+ Add Item</button>
            </section>
            {donations.length === 0 ? (
              <div className="empty-activity"><span>📦</span><h3>No donations yet</h3>
                <p>Your donated items will appear here after you submit the form.</p></div>
            ) : (
              <div className="donations-grid">
                {donations.map((item) => (
                  <article className="donation-card" key={item.id}>
                    <div className="donation-card-icon">📦</div>
                    <div><span className="donation-type">{item.donationType}</span>
                      <h3>{item.title}</h3>
                      <p>{item.category} · {item.condition}</p>
                      <p>📍 {item.location}</p>
                      <p>{item.description}</p>
                      {item.imageName && <small>Image selected: {item.imageName} (preview only)</small>}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="dashboard-placeholder">
            <span>{menuItems.find((item) => item.name === activeSection)?.icon || "🌱"}</span>
            <h2>{activeSection}</h2>
            <p>This section will be connected in a later development step.</p>
            <button onClick={() => navigateSection("Dashboard")}>← Back to Dashboard</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
